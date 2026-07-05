#!/bin/sh
set -e

AWS_REGION="${AWS_REGION:-us-east-1}"
API_NAME="${API_NAME:-doclens-poc-api}"
LAMBDA_NAME="${LAMBDA_NAME:-doclens-poc-upload}"
STAGE_NAME="${STAGE_NAME:-dev}"
AWS_ENDPOINT_URL="${AWS_ENDPOINT_URL:-http://floci:4566}"
LAMBDA_ROLE_ARN="${LAMBDA_ROLE_ARN:-arn:aws:iam::000000000000:role/lambda-role}"
WORKSPACE_DIR="${WORKSPACE_DIR:-/workspace}"
LAMBDA_DIR="${WORKSPACE_DIR}/tools/floci/lambda/upload-api"
FUNCTION_ZIP="${LAMBDA_DIR}/function.zip"
ENV_FILE="${WORKSPACE_DIR}/.env.local.floci"
FLOCI_PUBLIC_PORT="${FLOCI_PUBLIC_PORT:-4566}"

echo "Waiting for Floci at ${AWS_ENDPOINT_URL}..."
ATTEMPTS=0
until aws sts get-caller-identity --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS + 1))

  if [ "${ATTEMPTS}" -ge 30 ]; then
    echo "Floci did not become ready in time."
    exit 1
  fi

  sleep 2
done

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text --endpoint-url "${AWS_ENDPOINT_URL}")"

echo "AWS region: ${AWS_REGION}"
echo "AWS account: ${ACCOUNT_ID}"
echo "API name: ${API_NAME}"
echo "Lambda name: ${LAMBDA_NAME}"
echo "Stage name: ${STAGE_NAME}"
echo "Endpoint URL: ${AWS_ENDPOINT_URL}"
echo "Lambda role ARN: ${LAMBDA_ROLE_ARN}"

echo "Packaging Lambda..."
cd "${LAMBDA_DIR}"
rm -f "${FUNCTION_ZIP}"
zip -q "${FUNCTION_ZIP}" index.mjs

echo "Creating or updating Lambda..."
if aws lambda get-function \
  --function-name "${LAMBDA_NAME}" \
  --region "${AWS_REGION}" \
  --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null 2>&1; then
  aws lambda update-function-code \
    --function-name "${LAMBDA_NAME}" \
    --zip-file "fileb://${FUNCTION_ZIP}" \
    --region "${AWS_REGION}" \
    --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null

  aws lambda update-function-configuration \
    --function-name "${LAMBDA_NAME}" \
    --runtime nodejs22.x \
    --handler index.handler \
    --role "${LAMBDA_ROLE_ARN}" \
    --environment "Variables={APP_ENV=local}" \
    --region "${AWS_REGION}" \
    --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null
else
  aws lambda create-function \
    --function-name "${LAMBDA_NAME}" \
    --runtime nodejs22.x \
    --role "${LAMBDA_ROLE_ARN}" \
    --handler index.handler \
    --zip-file "fileb://${FUNCTION_ZIP}" \
    --environment "Variables={APP_ENV=local}" \
    --region "${AWS_REGION}" \
    --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null
fi

LAMBDA_ARN="$(aws lambda get-function \
  --function-name "${LAMBDA_NAME}" \
  --region "${AWS_REGION}" \
  --query Configuration.FunctionArn \
  --output text \
  --endpoint-url "${AWS_ENDPOINT_URL}")"

echo "Lambda ARN: ${LAMBDA_ARN}"

EXISTING_API_ID="$(aws apigatewayv2 get-apis \
  --region "${AWS_REGION}" \
  --query "Items[?Name=='${API_NAME}'].ApiId | [0]" \
  --output text \
  --endpoint-url "${AWS_ENDPOINT_URL}")"

if [ "${EXISTING_API_ID}" != "None" ] && [ -n "${EXISTING_API_ID}" ]; then
  API_ID="${EXISTING_API_ID}"
  echo "API already exists: ${API_ID}"
else
  echo "Creating HTTP API..."
  API_ID="$(aws apigatewayv2 create-api \
    --name "${API_NAME}" \
    --protocol-type HTTP \
    --cors-configuration AllowOrigins="*",AllowMethods="GET,POST,OPTIONS",AllowHeaders="content-type" \
    --region "${AWS_REGION}" \
    --query ApiId \
    --output text \
    --endpoint-url "${AWS_ENDPOINT_URL}")"
fi

echo "API ID: ${API_ID}"

echo "Creating Lambda integration..."
INTEGRATION_ID="$(aws apigatewayv2 create-integration \
  --api-id "${API_ID}" \
  --integration-type AWS_PROXY \
  --integration-uri "${LAMBDA_ARN}" \
  --payload-format-version "2.0" \
  --region "${AWS_REGION}" \
  --query IntegrationId \
  --output text \
  --endpoint-url "${AWS_ENDPOINT_URL}")"

echo "Integration ID: ${INTEGRATION_ID}"

upsert_route() {
  ROUTE_KEY="$1"
  ROUTE_ID="$(aws apigatewayv2 get-routes \
    --api-id "${API_ID}" \
    --region "${AWS_REGION}" \
    --query "Items[?RouteKey=='${ROUTE_KEY}'].RouteId | [0]" \
    --output text \
    --endpoint-url "${AWS_ENDPOINT_URL}")"

  if [ "${ROUTE_ID}" != "None" ] && [ -n "${ROUTE_ID}" ]; then
    aws apigatewayv2 update-route \
      --api-id "${API_ID}" \
      --route-id "${ROUTE_ID}" \
      --target "integrations/${INTEGRATION_ID}" \
      --region "${AWS_REGION}" \
      --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null
  else
    aws apigatewayv2 create-route \
      --api-id "${API_ID}" \
      --route-key "${ROUTE_KEY}" \
      --target "integrations/${INTEGRATION_ID}" \
      --region "${AWS_REGION}" \
      --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null
  fi
}

echo "Creating or updating routes..."
upsert_route "GET /health"
upsert_route "POST /upload-file"

echo "Creating stage if needed..."
if aws apigatewayv2 get-stage \
  --api-id "${API_ID}" \
  --stage-name "${STAGE_NAME}" \
  --region "${AWS_REGION}" \
  --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null 2>&1; then
  echo "Stage already exists: ${STAGE_NAME}"
else
  aws apigatewayv2 create-stage \
    --api-id "${API_ID}" \
    --stage-name "${STAGE_NAME}" \
    --auto-deploy \
    --region "${AWS_REGION}" \
    --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null
fi

echo "Adding Lambda invoke permission..."
aws lambda add-permission \
  --function-name "${LAMBDA_NAME}" \
  --statement-id "AllowExecutionFromApiGateway-${API_ID}" \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}/*/*/*" \
  --region "${AWS_REGION}" \
  --endpoint-url "${AWS_ENDPOINT_URL}" >/dev/null 2>&1 || true

API_BASE_URL="http://localhost:${FLOCI_PUBLIC_PORT}/execute-api/${API_ID}/${STAGE_NAME}"

echo ""
echo "API Gateway ready."
echo "Base URL:"
echo "${API_BASE_URL}"
echo ""
echo "Health endpoint:"
echo "${API_BASE_URL}/health"
echo ""
echo "Upload endpoint:"
echo "${API_BASE_URL}/upload-file"
echo ""
cat > "${ENV_FILE}" <<EOF
VITE_API_BASE_URL=${API_BASE_URL}
VITE_APP_ENV=local
EOF
echo "Environment file written to:"
echo "${ENV_FILE}"

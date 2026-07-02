#!/bin/sh
set -e

AWS_REGION="${AWS_REGION:-eu-west-1}"
PROJECT_NAME="${PROJECT_NAME:-doclens}"
ENVIRONMENT="${ENVIRONMENT:-dev}"
API_NAME="${API_NAME:-doclens-poc-api}"
LAMBDA_NAME="${LAMBDA_NAME:-doclens-poc-health}"
ROLE_NAME="${ROLE_NAME:-LabRole}"

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

echo "AWS region: ${AWS_REGION}"
echo "AWS account: ${ACCOUNT_ID}"
echo "API name: ${API_NAME}"
echo "Lambda name: ${LAMBDA_NAME}"
echo "Role name: ${ROLE_NAME}"
echo "Role ARN: ${ROLE_ARN}"

echo "Checking existing Lambda execution role..."
if aws iam get-role --role-name "${ROLE_NAME}" >/dev/null 2>&1; then
  echo "Role found: ${ROLE_NAME}"
else
  echo "Role ${ROLE_NAME} was not found or cannot be read."
  echo "In AWS Academy/VocLabs, the expected role is usually LabRole."
  exit 1
fi

echo "Packaging Lambda..."
cd /workspace/tools/floci/lambda/health
rm -f function.zip
zip -q function.zip index.mjs

echo "Creating or updating Lambda..."
if aws lambda get-function --function-name "${LAMBDA_NAME}" --region "${AWS_REGION}" >/dev/null 2>&1; then
  aws lambda update-function-code \
    --function-name "${LAMBDA_NAME}" \
    --zip-file fileb://function.zip \
    --region "${AWS_REGION}" >/dev/null

  aws lambda update-function-configuration \
    --function-name "${LAMBDA_NAME}" \
    --runtime nodejs22.x \
    --handler index.handler \
    --role "${ROLE_ARN}" \
    --environment "Variables={APP_ENV=${ENVIRONMENT}}" \
    --region "${AWS_REGION}" >/dev/null
else
  aws lambda create-function \
    --function-name "${LAMBDA_NAME}" \
    --runtime nodejs22.x \
    --role "${ROLE_ARN}" \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --environment "Variables={APP_ENV=${ENVIRONMENT}}" \
    --region "${AWS_REGION}" >/dev/null
fi

LAMBDA_ARN="$(aws lambda get-function \
  --function-name "${LAMBDA_NAME}" \
  --region "${AWS_REGION}" \
  --query Configuration.FunctionArn \
  --output text)"

echo "Lambda ARN: ${LAMBDA_ARN}"

EXISTING_API_ID="$(aws apigatewayv2 get-apis \
  --region "${AWS_REGION}" \
  --query "Items[?Name=='${API_NAME}'].ApiId | [0]" \
  --output text)"

if [ "${EXISTING_API_ID}" != "None" ] && [ -n "${EXISTING_API_ID}" ]; then
  API_ID="${EXISTING_API_ID}"
  echo "API already exists: ${API_ID}"
else
  echo "Creating HTTP API..."
  API_ID="$(aws apigatewayv2 create-api \
    --name "${API_NAME}" \
    --protocol-type HTTP \
    --cors-configuration AllowOrigins="*",AllowMethods="GET,OPTIONS",AllowHeaders="content-type" \
    --region "${AWS_REGION}" \
    --query ApiId \
    --output text)"
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
  --output text)"

echo "Integration ID: ${INTEGRATION_ID}"

echo "Creating or updating GET /health route..."
EXISTING_ROUTE_ID="$(aws apigatewayv2 get-routes \
  --api-id "${API_ID}" \
  --region "${AWS_REGION}" \
  --query "Items[?RouteKey=='GET /health'].RouteId | [0]" \
  --output text)"

if [ "${EXISTING_ROUTE_ID}" != "None" ] && [ -n "${EXISTING_ROUTE_ID}" ]; then
  aws apigatewayv2 update-route \
    --api-id "${API_ID}" \
    --route-id "${EXISTING_ROUTE_ID}" \
    --target "integrations/${INTEGRATION_ID}" \
    --region "${AWS_REGION}" >/dev/null
else
  aws apigatewayv2 create-route \
    --api-id "${API_ID}" \
    --route-key "GET /health" \
    --target "integrations/${INTEGRATION_ID}" \
    --region "${AWS_REGION}" >/dev/null
fi

echo "Creating default stage if needed..."
if aws apigatewayv2 get-stage \
  --api-id "${API_ID}" \
  --stage-name "\$default" \
  --region "${AWS_REGION}" >/dev/null 2>&1; then
  echo "Default stage already exists."
else
  aws apigatewayv2 create-stage \
    --api-id "${API_ID}" \
    --stage-name "\$default" \
    --auto-deploy \
    --region "${AWS_REGION}" >/dev/null
fi

echo "Adding Lambda invoke permission..."
aws lambda add-permission \
  --function-name "${LAMBDA_NAME}" \
  --statement-id "AllowExecutionFromApiGateway-${API_ID}" \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}/*/*/health" \
  --region "${AWS_REGION}" >/dev/null 2>&1 || true

API_ENDPOINT="$(aws apigatewayv2 get-api \
  --api-id "${API_ID}" \
  --region "${AWS_REGION}" \
  --query ApiEndpoint \
  --output text)"

echo ""
echo "API Gateway ready."
echo "API endpoint:"
echo "${API_ENDPOINT}"
echo ""
echo "Health endpoint:"
echo "${API_ENDPOINT}/health"
echo ""
echo "Use this in .env.local:"
echo "VITE_API_BASE_URL=${API_ENDPOINT}"
echo "VITE_APP_ENV=${ENVIRONMENT}"

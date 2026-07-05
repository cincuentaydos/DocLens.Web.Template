#!/bin/sh
set -e

AWS_REGION="${AWS_REGION:-eu-west-1}"
ROLE_NAME="${ROLE_NAME:-LabRole}"

echo "Checking AWS identity..."
aws sts get-caller-identity

echo ""
echo "Checking LabRole visibility..."
aws iam get-role --role-name "${ROLE_NAME}" >/dev/null
echo "OK: ${ROLE_NAME} is visible."

echo ""
echo "Checking Lambda permissions..."
if aws lambda list-functions --region "${AWS_REGION}" >/dev/null 2>&1; then
  echo "OK: lambda:ListFunctions is allowed."
else
  echo "ERROR: lambda:ListFunctions is not allowed for this identity."
fi

echo ""
echo "Checking API Gateway permissions..."
if aws apigatewayv2 get-apis --region "${AWS_REGION}" >/dev/null 2>&1; then
  echo "OK: apigatewayv2:GetApis is allowed."
else
  echo "ERROR: apigatewayv2:GetApis is not allowed for this identity."
fi

echo ""
echo "Required permissions for the full PoC deployment:"
echo "- lambda:CreateFunction"
echo "- lambda:GetFunction"
echo "- lambda:ListFunctions"
echo "- lambda:UpdateFunctionCode"
echo "- lambda:UpdateFunctionConfiguration"
echo "- lambda:AddPermission"
echo "- apigatewayv2:CreateApi"
echo "- apigatewayv2:GetApis"
echo "- apigatewayv2:CreateIntegration"
echo "- apigatewayv2:CreateRoute"
echo "- apigatewayv2:CreateStage"
echo "- iam:PassRole on LabRole"

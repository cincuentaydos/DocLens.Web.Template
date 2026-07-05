#!/bin/sh
set -e

echo "Checking AWS CLI..."
aws --version

echo "Checking AWS identity..."
aws sts get-caller-identity

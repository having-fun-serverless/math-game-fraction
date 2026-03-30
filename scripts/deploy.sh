#!/usr/bin/env bash
set -euo pipefail

# Golden Honmoon Math Game — S3 + CloudFront deploy script
# Usage: ./scripts/deploy.sh --bucket <bucket-name> [--region <region>]
#
# Requirements:
#   - AWS CLI v2 configured with appropriate credentials
#   - Node.js + npm installed

STACK_NAME="golden-honmoon-math-site"
REGION="us-east-1"
BUCKET_NAME=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --bucket)
      BUCKET_NAME="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: $0 --bucket <bucket-name> [--region <region>]"
      exit 1
      ;;
  esac
done

if [[ -z "$BUCKET_NAME" ]]; then
  echo "Error: --bucket is required"
  echo "Usage: $0 --bucket <bucket-name> [--region <region>]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> Deploying CloudFormation stack: $STACK_NAME"
aws cloudformation deploy \
  --stack-name "$STACK_NAME" \
  --template-file "$REPO_ROOT/infra/s3-website.yaml" \
  --parameter-overrides BucketName="$BUCKET_NAME" \
  --region "$REGION" \
  --no-fail-on-empty-changeset

echo "==> Building the app"
cd "$REPO_ROOT"
npm run build

echo "==> Uploading assets to s3://$BUCKET_NAME/ (long-term cache)"
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
  --delete \
  --region "$REGION" \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

echo "==> Uploading index.html (no cache)"
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
  --region "$REGION" \
  --cache-control "no-cache,no-store,must-revalidate"

echo "==> Invalidating CloudFront cache"
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text)

if [[ -n "$DISTRIBUTION_ID" && "$DISTRIBUTION_ID" != "None" ]]; then
  aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --region us-east-1 > /dev/null
  echo "   Cache invalidated for distribution $DISTRIBUTION_ID"
fi

echo "==> Fetching website URL"
WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text)

echo ""
echo "✅ Deploy complete!"
echo "   Website: $WEBSITE_URL"

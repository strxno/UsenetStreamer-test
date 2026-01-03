#!/bin/bash
# Script to build and push UsenetStreamer to GitHub Container Registry

# Configuration - UPDATE THESE VALUES
GITHUB_USERNAME="your-github-username"  # Replace with your GitHub username
IMAGE_NAME="usenetstreamer"
VERSION_TAG="custom-$(date +%Y%m%d)"  # Or use a specific version like "1.6.0-custom"
LATEST_TAG="latest"

# Full image name
IMAGE_FULL_NAME="ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}"

echo "Building Docker image..."
docker build -t ${IMAGE_FULL_NAME}:${VERSION_TAG} -t ${IMAGE_FULL_NAME}:${LATEST_TAG} .

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build successful!"
echo ""
echo "To push to ghcr.io, you need to:"
echo "1. Login to GitHub Container Registry:"
echo "   echo \$GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USERNAME} --password-stdin"
echo ""
echo "2. Push the image:"
echo "   docker push ${IMAGE_FULL_NAME}:${VERSION_TAG}"
echo "   docker push ${IMAGE_FULL_NAME}:${LATEST_TAG}"
echo ""
echo "To get a GitHub token:"
echo "1. Go to https://github.com/settings/tokens"
echo "2. Generate new token (classic)"
echo "3. Select 'write:packages' permission"
echo "4. Copy the token and use it in the login command above"



# PowerShell script to build and push UsenetStreamer to GitHub Container Registry

# Configuration - UPDATE THESE VALUES
$GITHUB_USERNAME = "your-github-username"  # Replace with your GitHub username
$IMAGE_NAME = "usenetstreamer"
$VERSION_TAG = "custom-$(Get-Date -Format 'yyyyMMdd')"  # Or use a specific version like "1.6.0-custom"
$LATEST_TAG = "latest"

# Full image name
$IMAGE_FULL_NAME = "ghcr.io/$GITHUB_USERNAME/$IMAGE_NAME"

Write-Host "Building Docker image..." -ForegroundColor Green
docker build -t "${IMAGE_FULL_NAME}:${VERSION_TAG}" -t "${IMAGE_FULL_NAME}:${LATEST_TAG}" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "To push to ghcr.io, you need to:" -ForegroundColor Yellow
Write-Host "1. Login to GitHub Container Registry:" -ForegroundColor Yellow
Write-Host "   `$token = 'YOUR_GITHUB_TOKEN'" -ForegroundColor Cyan
Write-Host "   `$token | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Push the image:" -ForegroundColor Yellow
Write-Host "   docker push ${IMAGE_FULL_NAME}:${VERSION_TAG}" -ForegroundColor Cyan
Write-Host "   docker push ${IMAGE_FULL_NAME}:${LATEST_TAG}" -ForegroundColor Cyan
Write-Host ""
Write-Host "To get a GitHub token:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "2. Generate new token (classic)" -ForegroundColor Cyan
Write-Host "3. Select 'write:packages' permission" -ForegroundColor Cyan
Write-Host "4. Copy the token and use it in the login command above" -ForegroundColor Cyan



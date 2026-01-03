# Building and Pushing to GitHub Container Registry (ghcr.io)

## Prerequisites

1. **Docker installed** (Docker Desktop on Windows/Mac, or Docker on Linux)
2. **GitHub account** with a Personal Access Token (PAT) that has `write:packages` permission

## Step 1: Get GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Docker Push Token"
4. Select the `write:packages` permission
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

## Step 2: Build the Docker Image

### On Linux/Mac (or WSL on Windows):

```bash
# Update the script with your GitHub username
nano build-and-push.sh  # Edit GITHUB_USERNAME

# Make it executable
chmod +x build-and-push.sh

# Run it
./build-and-push.sh
```

### On Windows (PowerShell):

```powershell
# Set your variables
$GITHUB_USERNAME = "your-github-username"  # Replace with your username
$IMAGE_NAME = "usenetstreamer"
$VERSION_TAG = "custom-$(Get-Date -Format 'yyyyMMdd')"
$LATEST_TAG = "latest"
$IMAGE_FULL_NAME = "ghcr.io/$GITHUB_USERNAME/$IMAGE_NAME"

# Build the image
docker build -t "${IMAGE_FULL_NAME}:${VERSION_TAG}" -t "${IMAGE_FULL_NAME}:${LATEST_TAG}" .
```

### Manual Build:

```bash
# Replace YOUR_USERNAME with your GitHub username
docker build -t ghcr.io/YOUR_USERNAME/usenetstreamer:custom -t ghcr.io/YOUR_USERNAME/usenetstreamer:latest .
```

## Step 3: Login to GitHub Container Registry

```bash
# Replace YOUR_USERNAME and YOUR_TOKEN with your actual values
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

Or on Windows PowerShell:
```powershell
$token = "YOUR_TOKEN"
$token | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

## Step 4: Push the Image

```bash
# Push both tags
docker push ghcr.io/YOUR_USERNAME/usenetstreamer:custom
docker push ghcr.io/YOUR_USERNAME/usenetstreamer:latest
```

Or if you used the script variables:
```bash
docker push ${IMAGE_FULL_NAME}:${VERSION_TAG}
docker push ${IMAGE_FULL_NAME}:${LATEST_TAG}
```

## Step 5: Make the Package Public (Optional)

By default, packages are private. To make it public:

1. Go to https://github.com/YOUR_USERNAME?tab=packages
2. Click on your `usenetstreamer` package
3. Click "Package settings"
4. Scroll down to "Danger Zone"
5. Click "Change visibility" → "Public"

## Step 6: Use on Unraid

Update your docker-compose.yml or container settings in Unraid:

```yaml
services:
  usenetstreamer:
    image: ghcr.io/YOUR_USERNAME/usenetstreamer:latest
    # ... rest of your config
```

Or pull it manually:
```bash
docker pull ghcr.io/YOUR_USERNAME/usenetstreamer:latest
```

## Alternative: Build Directly on Unraid

If you have SSH access to your Unraid server:

1. Copy the entire project folder to Unraid (via SMB, SFTP, or git clone)
2. SSH into Unraid
3. Navigate to the project folder
4. Run the build commands from Step 2-4 above

## Troubleshooting

### "denied: permission denied"
- Make sure your GitHub token has `write:packages` permission
- Make sure you're logged in: `docker login ghcr.io`

### "unauthorized: authentication required"
- Check your GitHub username is correct
- Regenerate your token if needed

### Build fails
- Make sure you're in the project root directory
- Check that Dockerfile exists
- Try: `docker build --no-cache -t ghcr.io/YOUR_USERNAME/usenetstreamer:test .`



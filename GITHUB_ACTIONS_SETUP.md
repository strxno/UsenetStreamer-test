# GitHub Actions Setup - Automatic Docker Builds

GitHub will automatically build and push your Docker image to `ghcr.io` whenever you push code!

## How It Works

The workflow (`.github/workflows/docker-publish.yml`) will:
- ✅ Build automatically when you push to `master` or `main` branch
- ✅ Build on pull requests (but won't push)
- ✅ Build on version tags (e.g., `v1.6.1`)
- ✅ Support manual triggering from GitHub UI
- ✅ Build for both `linux/amd64` and `linux/arm64` (for Unraid compatibility)
- ✅ Push to `ghcr.io/YOUR_USERNAME/usenetstreamer`

## Setup Steps

### 1. Push Your Code to GitHub

If you haven't already, create a repository and push:

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit your changes
git commit -m "Add retry logic, improve error handling, and prioritize original titles"

# Add your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/usenetstreamer.git

# Push to GitHub
git push -u origin master
```

### 2. Make Package Public (Optional but Recommended)

By default, packages are private. To make it public so you can pull without authentication:

1. Go to https://github.com/YOUR_USERNAME?tab=packages
2. Click on `usenetstreamer` package
3. Click "Package settings"
4. Scroll to "Danger Zone"
5. Click "Change visibility" → Select "Public"

### 3. Wait for Build

After pushing, GitHub Actions will automatically:
- Build your Docker image
- Push it to `ghcr.io/YOUR_USERNAME/usenetstreamer:latest`
- Also create tags like `ghcr.io/YOUR_USERNAME/usenetstreamer:master` and `ghcr.io/YOUR_USERNAME/usenetstreamer:YOUR_COMMIT_SHA`

You can watch the build progress at:
`https://github.com/YOUR_USERNAME/usenetstreamer/actions`

### 4. Use on Unraid

Once the build completes, update your Unraid container to use:

```
ghcr.io/YOUR_USERNAME/usenetstreamer:latest
```

Or a specific branch/tag:
```
ghcr.io/YOUR_USERNAME/usenetstreamer:master
```

## Image Tags

The workflow creates multiple tags:
- `latest` - Always points to the latest build from default branch
- `master` or `main` - Latest from that branch
- `SHA-COMMIT` - Specific commit SHA
- `v1.6.1` - Version tags (if you create git tags)

## Manual Build Trigger

You can manually trigger a build from GitHub:
1. Go to your repository
2. Click "Actions" tab
3. Select "Build and Push Docker Image"
4. Click "Run workflow"

## Troubleshooting

### Build fails
- Check the Actions tab for error logs
- Make sure Dockerfile is in the root directory
- Verify all files are committed

### Can't pull image
- Make sure package is public (see step 2 above)
- Or authenticate: `docker login ghcr.io -u YOUR_USERNAME`

### Authentication issues
- GitHub Actions automatically uses `GITHUB_TOKEN` - no setup needed!
- For local pulls, you may need to authenticate if package is private

## Next Steps

1. **Push your code** to GitHub
2. **Wait for build** to complete (check Actions tab)
3. **Make package public** (optional)
4. **Update Unraid** to use the new image

That's it! Every time you push code, GitHub will automatically build and push a new Docker image! 🚀



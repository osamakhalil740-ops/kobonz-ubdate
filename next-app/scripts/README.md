# Deployment Scripts

This directory contains automation scripts for safely deploying phases to the repository.

## Available Scripts

### Phase 6: Analytics & Notifications
```bash
bash scripts/push-phase-6.sh
```
Safely commits and pushes Phase 6 files with comprehensive safety checks.

### Phase 7: SEO, Performance & Security
```bash
bash scripts/push-phase-7.sh
```
Safely commits and pushes Phase 7 files with build verification.

### Phase 9: Deployment & CI/CD
```bash
bash scripts/push-phase-9.sh
```
Safely commits and pushes Phase 9 configuration files.

## Safety Features

All scripts include:
- ✅ Pre-flight checks (git, directory, dependencies)
- ✅ File verification (ensures all phase files exist)
- ✅ Security scanning (no .env files, no secrets)
- ✅ Build verification (ensures code compiles)
- ✅ User confirmations (at critical steps)
- ✅ Detailed commit messages
- ✅ PR creation instructions

## Requirements

- Git installed and configured
- Node.js and npm installed
- Internet connection
- Write access to repository

## Usage

### On Linux/macOS:
```bash
# Make script executable
chmod +x scripts/push-phase-*.sh

# Run script
./scripts/push-phase-6.sh
```

### On Windows (Git Bash):
```bash
bash scripts/push-phase-6.sh
```

### On Windows (PowerShell):
See `push-phase-*.ps1` scripts (if available)

## What Each Script Does

1. **Pre-flight Checks**
   - Verifies git installation
   - Checks you're in correct directory
   - Validates repository setup
   - Tests internet connectivity

2. **File Verification**
   - Ensures all phase files are present
   - Checks for missing files
   - Validates file structure

3. **Security Checks**
   - Scans for .env files
   - Checks for hardcoded secrets
   - Validates no sensitive data

4. **Build Verification**
   - Installs dependencies
   - Runs TypeScript compilation
   - Builds the application
   - Ensures no errors

5. **Git Operations**
   - Creates feature branch
   - Stages only phase-specific files
   - Creates detailed commit
   - Pushes to remote

6. **PR Instructions**
   - Provides PR URL
   - Suggests PR title
   - Includes PR description template

## Troubleshooting

### Script fails with "Not in next-app directory"
**Solution:** Run from `next-app/` directory:
```bash
cd next-app
bash scripts/push-phase-6.sh
```

### Script fails with "Build failed"
**Solution:** Fix build errors first:
```bash
npm install
npm run build
```

### Script fails with "Secrets detected"
**Solution:** Review flagged content, ensure no real secrets are being committed.

### Script fails to push
**Solution:** Check authentication:
```bash
git config --list | grep user
gh auth status  # if using GitHub CLI
```

## Manual Fallback

If scripts fail, you can manually execute:

```bash
# 1. Create branch
git checkout -b feature/phase-X-name

# 2. Stage files (see script for file list)
git add <files>

# 3. Commit
git commit -m "feat(phase-X): description"

# 4. Push
git push -u origin feature/phase-X-name

# 5. Create PR on GitHub
```

## Support

For issues with these scripts:
1. Check script output for specific error
2. Review troubleshooting section above
3. Manually execute git commands if needed
4. Contact repository maintainer

---

**Safety First:** These scripts are designed to prevent accidental modifications to existing code. They will abort if any safety check fails.

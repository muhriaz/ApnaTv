# Installation & Setup Guide

## System Requirements

### Minimum Requirements

- **OS:** Windows 10+ / macOS 10.15+ / Linux (Ubuntu 20.04+)
- **Node.js:** v16.0 or higher
- **npm:** v8.0 or higher
- **RAM:** 4GB minimum
- **Disk Space:** 2GB for dependencies and build files

### Samsung TV Requirements

- **TV Model:** Samsung Smart TV 2016 or newer
- **Tizen OS:** 3.0 or higher
- **Internet:** Stable broadband connection
- **Network:** Ethernet or WiFi capability

## Installation Steps

### 1. Install Node.js and npm

**Windows:**

- Download from https://nodejs.org/
- Run installer with default settings
- Verify installation:

```bash
node --version
npm --version
```

**macOS:**

```bash
# Using Homebrew
brew install node
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Clone/Download Project

```bash
# Navigate to your projects folder
cd d:\coding-tut

# Project is already in apnatv folder
cd apnatv
```

### 3. Install Dependencies

```bash
# Install all npm packages
npm install

# If you encounter issues, use:
npm install --legacy-peer-deps

# Or clean install:
npm cache clean --force
rm -r node_modules
npm install
```

### 4. Verify Installation

```bash
# Check TypeScript compilation
npm run type-check

# Run linter
npm run lint

# Build project
npm run build
```

## Development Setup

### VS Code Setup (Recommended)

1. **Install VS Code:**
   - Download from https://code.visualstudio.com/

2. **Install Extensions:**
   - ESLint
   - Prettier - Code Formatter
   - TypeScript Vue Plugin
   - SCSS IntelliSense
   - Thunder Client (for API testing)

3. **Open Project:**
   - File → Open Folder → Select apnatv folder

4. **Start Development Server:**

```bash
npm run dev
```

Access at: `http://localhost:8080`

## Building for Samsung TV

### Prerequisites

- Samsung Tizen Studio installed
- Developer certificate created
- Samsung TV on same network

### Package Creation

1. **Build optimized bundle:**

```bash
npm run build
```

2. **Create Tizen package:**

```bash
# Install Tizen CLI tools
npm install -g tizen-cli

# Create package
tizen package -t wgt -s ProfileName -- ./dist
```

3. **Deploy to TV:**

```bash
# Find TV device
tizen devices

# Install package
tizen install -s [DEVICE_ID] -p AplaTV.wgt
```

## Configuration

### 1. Environment Variables

Create `.env` file in root directory:

```env
# API Configuration
XTREAM_API_ENDPOINT=http://your-xtream-server.com
EPG_URL=http://example.com/epg.xml

# VPN Configuration
VPN_PROVIDER=nordvpn
VPN_API_KEY=your_api_key

# Database
DATABASE_PATH=./apnatv.db

# Feature Flags
ENABLE_DVR=true
ENABLE_VPN=true
ENABLE_CASTING=true
ENABLE_4K=true

# Storage Limits
MAX_RECORDINGS=5
MAX_PROFILES=10
```

### 2. Application Settings

Settings are stored in SQLite database located at `./apnatv.db`

Access via database repositories:

```typescript
import { SettingsRepository } from "@db/Repositories";
```

## Troubleshooting

### Common Issues

**Issue: npm install fails**

```bash
# Solution 1: Clear npm cache
npm cache clean --force

# Solution 2: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 3: Reinstall Node.js
```

**Issue: Port 8080 already in use**

```bash
# Solution: Use different port
npm run dev -- --port 3000
```

**Issue: TypeScript compilation errors**

```bash
# Check all errors
npm run type-check

# Fix fixable errors
npm run lint -- --fix
```

**Issue: Samsung TV connection fails**

- Ensure TV is on same network
- Check firewall settings
- Verify TV IP address
- Reinstall Tizen package

### Getting Help

1. Check `DEVELOPMENT.md` for detailed docs
2. Review `FEATURES.md` for feature list
3. Check browser console for errors (F12)
4. Review Tizen SDK documentation

## Next Steps

1. **Add Playlists:**
   - Add M3U URL via Settings → Playlists
   - Or add Xtream credentials

2. **Configure EPG:**
   - Set EPG URL in Settings
   - Enable program guide

3. **Set Up User Profile:**
   - Create user profiles
   - Enable parental controls if needed

4. **Add VPN (Optional):**
   - Configure VPN provider
   - Connect to VPN

5. **Test Streaming:**
   - Navigate to Live TV
   - Select and play channel
   - Test playback controls

## Performance Tips

1. **Optimize for older TVs:**
   - Limit to 1080p quality
   - Disable 4K content
   - Use SD for slower networks

2. **Improve playlist loading:**
   - Keep M3U files under 10MB
   - Use CDN for playlist hosting
   - Cache playlists locally

3. **Better EPG performance:**
   - Limit EPG to 7-day guide
   - Update EPG once daily
   - Use gzip compression

## Security Best Practices

1. **PIN Protection:**
   - Set strong 4-digit PIN for parental controls
   - Change PIN periodically

2. **VPN Usage:**
   - Enable VPN for all connections (optional)
   - Use reputable VPN provider
   - Check for DNS leaks

3. **Account Security:**
   - Don't share Xtream credentials
   - Update credentials regularly
   - Monitor account usage

## Uninstallation

### Remove from Computer

```bash
# Remove project folder
rmdir /s /q d:\coding-tut\apnatv

# Or use File Explorer to delete folder
```

### Remove from Samsung TV

- Settings → Apps → AplaTV → Delete
- Or uninstall via Tizen CLI:

```bash
tizen uninstall -s [DEVICE_ID] -p com.yourcompany.apnatv
```

## Support Resources

- **Tizen Documentation:** https://docs.tizen.org/
- **React Docs:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/
- **Samsung TV Dev:** https://developer.samsung.com/smarttv

---

**Last Updated:** May 2026
**Version:** 1.0.0

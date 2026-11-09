# AplaTV - Professional IPTV App for Samsung TV

## Quick Start Guide

### Prerequisites

- Node.js 16+ and npm
- Git
- Samsung TV with Tizen OS support
- A code editor (VS Code recommended)

### Installation

1. **Navigate to project directory:**

```bash
cd d:\coding-tut\apnatv
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

4. **Build for production:**

```bash
npm run build
```

### Project Structure

```
apnatv/
├── src/
│   ├── components/           # React UI components
│   │   ├── App.tsx          # Main app container
│   │   ├── Navigation.tsx    # Menu navigation
│   │   ├── Player.tsx        # Video player
│   │   ├── EPGGrid.tsx       # Channel grid
│   │   ├── SearchBar.tsx     # Search functionality
│   │   ├── Settings.tsx      # Settings panel
│   │   └── ParentalControls.tsx
│   ├── services/            # Business logic
│   │   ├── PlaylistService.ts    # M3U & Xtream API
│   │   ├── EPGService.ts         # Electronic Program Guide
│   │   ├── PlayerService.ts      # Playback control
│   │   ├── RecordingService.ts   # DVR functionality
│   │   ├── AuthService.ts        # User & parental controls
│   │   ├── VPNService.ts         # VPN integration
│   │   ├── CastingService.ts     # Google Cast & AirPlay
│   │   └── SearchService.ts      # Content search
│   ├── db/                  # Database layer
│   │   ├── Database.ts      # SQLite connection
│   │   └── Repositories.ts  # Data access layer
│   ├── styles/              # SCSS stylesheets
│   │   ├── main.scss
│   │   └── App.scss
│   └── index.tsx           # Entry point
├── public/                  # Static assets
│   └── index.html
├── dist/                    # Build output
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Feature Implementation Guide

### 1. Playlist Management

**M3U Playlist:**

```typescript
import PlaylistService from "@services/PlaylistService";

// Parse M3U URL
const channels = await PlaylistService.parseM3UPlaylist(
  "http://example.com/playlist.m3u",
);

// Get stream URL
const streamUrl = channels[0].url;
```

**Xtream API:**

```typescript
const account = {
  username: "user",
  password: "pass",
  baseUrl: "http://xtreamserver.com",
};

// Validate credentials
const isValid = await PlaylistService.validateXtreamCredentials(account);

// Get live streams
const streams = await PlaylistService.getXtreamLiveStreams(account);

// Get stream URL
const url = PlaylistService.getXtreamStreamUrl(account, streamId);
```

### 2. EPG Integration

```typescript
import EPGService from "@services/EPGService";

// Fetch EPG
const schedules = await EPGService.fetchEPG("http://example.com/epg.xml");

// Get current program
const current = EPGService.getCurrentProgram(schedules[0]);

// Get next program
const next = EPGService.getNextProgram(schedules[0]);

// Search programs
const results = EPGService.searchPrograms(schedules, "movie name");
```

### 3. Video Playback

```typescript
import PlayerService from "@services/PlayerService";

// Control playback
PlayerService.play();
PlayerService.pause();
PlayerService.setVolume(75);
PlayerService.setQuality("HD");

// Audio and subtitle handling
PlayerService.setAudioTracks(audioTracks);
PlayerService.selectAudioTrack(trackId);
PlayerService.setSubtitles(subtitleTracks);
PlayerService.selectSubtitle(subtitleId);

// Picture-in-Picture
PlayerService.togglePictureInPicture();
```

### 4. DVR Recording

```typescript
import RecordingService from "@services/RecordingService";

// Start recording
const recording = RecordingService.startRecording(
  streamId,
  "Program Name",
  120, // duration in minutes
  {
    duration: 120,
    quality: "HD",
    format: "MP4",
  },
);

// Get recordings
const active = RecordingService.getActiveRecordings();
const completed = RecordingService.getCompletedRecordings();

// Stop recording
RecordingService.stopRecording(recordingId);
```

### 5. User Profiles & Parental Controls

```typescript
import AuthService from "@services/AuthService";

// Create profile
const profile = AuthService.createProfile("John", 18, "1234");

// Add to favorites
AuthService.addToFavorites(profileId, contentId);

// Setup parental controls
AuthService.setupParentalControls(profileId, {
  enabled: true,
  pin: "4321",
  restrictedAges: ["18+"],
  lockedCategories: ["Adult"],
  contentRating: "15",
  purchaseRestriction: true,
});

// Check if content allowed
const allowed = AuthService.isContentAllowed(profileId, contentAge, category);
```

### 6. VPN Integration

```typescript
import VPNService from "@services/VPNService";

// Discover devices
await VPNService.discoverDevices();

// Create connection
const connection = VPNService.createConnection(
  "nordvpn",
  "username",
  "password",
);

// Connect
await VPNService.connect(connectionId);

// Check status
const isConnected = VPNService.isConnected();
```

### 7. Google Cast & AirPlay

```typescript
import CastingService from "@services/CastingService";

// Discover devices
const devices = await CastingService.discoverDevices();

// Cast stream
const session = await CastingService.castToDevice(
  deviceId,
  streamUrl,
  "Program Name",
);

// Control casting
CastingService.controlPlayback(sessionId, "play");
CastingService.controlPlayback(sessionId, "seek", 30);
```

### 8. Search Functionality

```typescript
import SearchService from "@services/SearchService";

// Basic search
const results = SearchService.search("movie name", {
  type: "movie",
  limit: 20,
});

// Get suggestions
const suggestions = SearchService.getSuggestions("query", 10);

// Search history
const history = SearchService.getSearchHistory();
SearchService.clearSearchHistory();
```

## Database Operations

### Save Playlist

```typescript
import { Database } from "@db/Database";
import { PlaylistRepository } from "@db/Repositories";

const db = new Database();
await db.initialize();

const repo = new PlaylistRepository(db);
await repo.savePlaylist({
  id: "pl-1",
  name: "My Playlist",
  url: "http://example.com/m3u",
  type: "M3U",
  userId: "user-1",
});
```

### Save Favorites

```typescript
const favRepo = new FavoritesRepository(db);
await favRepo.addFavorite(userId, contentId, "channel");

// Get favorites
const favorites = await favRepo.getFavorites(userId);
```

### Track History

```typescript
const histRepo = new HistoryRepository(db);
await histRepo.addToHistory(
  userId,
  contentId,
  "movie",
  120, // current time
  3600, // duration
);

// Get resume point
const resume = await histRepo.getResumePoint(userId, contentId);
```

## Configuration

Create `.env` file in root directory:

```
VPN_PROVIDER_API_KEY=your_vpn_api_key
XTREAM_API_ENDPOINT=http://your-xtream-server.com
EPG_URL=http://example.com/epg.xml
DATABASE_PATH=./apnatv.db
```

## Samsung TV Deployment

### Tizen Packaging

1. Install Samsung SDK
2. Create Tizen package from build output
3. Sign with developer certificate
4. Install on device

```bash
# Generate Tizen package
tizen package -t wgt -s MyProfile -- ./dist

# Install on device
tizen install -s [DEVICE_ID] -p ./AplaTV.wgt
```

### Configuration for Samsung TV

Edit `config.xml` for Tizen:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets"
        xmlns:tizen="http://tizen.org/ns/widgets"
        id="http://yourdomain.com/apnatv"
        version="1.0.0"
        viewmodes="windowed">
  <tizen:application id="apnatv" package="com.yourcompany.apnatv" required_version="3.0"/>
  <content src="index.html"/>
  <name>AplaTV</name>
  <description>Professional IPTV App for Samsung TV</description>
</widget>
```

## API Reference

### PlaylistService

- `parseM3UPlaylist(url)` - Parse M3U from URL
- `getXtreamLiveStreams(account)` - Get Xtream live channels
- `getXtreamVOD(account)` - Get Xtream VOD content
- `getXtreamSeries(account)` - Get Xtream series
- `validateXtreamCredentials(account)` - Validate API access

### EPGService

- `fetchEPG(epgUrl)` - Fetch EPG data
- `getCurrentProgram(schedule)` - Get now-playing program
- `getNextProgram(schedule)` - Get next program
- `getProgramsInRange(schedule, start, end)` - Get programs in time range
- `searchPrograms(schedules, query)` - Search programs

### PlayerService

- `play()` / `pause()` - Playback control
- `setVolume(0-100)` - Set volume
- `setQuality('auto'|'SD'|'HD'|'4K')` - Set quality
- `selectAudioTrack(trackId)` - Select audio
- `selectSubtitle(trackId)` - Select subtitle
- `togglePictureInPicture()` - Toggle PiP mode

### RecordingService

- `startRecording(streamId, title, duration, settings)` - Start DVR
- `stopRecording(recordingId)` - Stop recording
- `getActiveRecordings()` - Get active recordings
- `getCompletedRecordings()` - Get finished recordings

### AuthService

- `createProfile(name, age, pin)` - Create user profile
- `switchToProfile(profileId, pin)` - Switch profile
- `setupParentalControls(profileId, settings)` - Setup controls
- `addToFavorites(profileId, contentId)` - Add favorite
- `addToWatchHistory(profileId, contentId)` - Track history

### VPNService

- `discoverDevices()` - Find VPN providers
- `createConnection(providerId, username, password)` - Create VPN connection
- `connect(connectionId)` - Connect to VPN
- `disconnect(connectionId)` - Disconnect VPN
- `isConnected()` - Check VPN status

### CastingService

- `discoverDevices()` - Find cast devices
- `castToDevice(deviceId, streamUrl, title)` - Start casting
- `controlPlayback(sessionId, command, parameter)` - Control playback
- `stopCasting(sessionId)` - Stop casting

### SearchService

- `search(query, filters)` - Search content
- `getSuggestions(query, limit)` - Get search suggestions
- `getSearchHistory(limit)` - Get search history
- `advancedSearch(criteria)` - Advanced search

## Troubleshooting

### Dependencies Issues

```bash
npm install --force
npm cache clean --force
```

### Build Errors

```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Run linter
```

### Samsung TV Compatibility

- Ensure Tizen SDK version compatibility
- Test on actual TV hardware
- Check Samsung SDK documentation

## License

MIT License - See LICENSE file for details

## Support & Documentation

- Samsung Tizen Web API: https://docs.tizen.org/
- React Documentation: https://react.dev
- TypeScript Docs: https://www.typescriptlang.org/

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Platform:** Samsung TV (Tizen OS 3.0+)

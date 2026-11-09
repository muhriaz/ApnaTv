# AplaTV - Features Documentation

## Core Features Implementation

### 1. Core Streaming & Playback

#### Live TV Streaming

- Direct stream playback from M3U URLs
- Xtream API integration for live channels
- Real-time channel switching
- Network adaptive streaming

#### Video on Demand (VOD)

- Movie and content library browsing
- Direct streaming capability
- Multiple format support (MP4, MKV, WebM)
- Playback position persistence

#### Series Streaming

- Episode management
- Auto-play next episode
- Series organization by season
- Episode tracking

#### Multi-Screen Support

- Picture-in-Picture (PiP) mode
- Dual stream capability
- Synchronized playback across screens

#### Video Quality

- Adaptive bitrate streaming
- Manual quality selection (SD, HD, 4K)
- 4K Ultra HD support
- Bandwidth optimization

#### Multi-Audio & Subtitles

- Multiple audio track selection
- Format support: SRT, VTT, ASS, SSA
- Real-time subtitle loading
- Auto-language detection

---

### 2. Organization & Navigation

#### Playlist Management

**M3U URL Support:**

- Direct URL input
- Automatic playlist parsing
- Group-based channel organization
- Logo and metadata support

**M3U File Upload:**

- Local file import
- Batch channel addition
- Format validation

**Xtream Codes API:**

- Credential-based access
- Live, VOD, and Series retrieval
- Category organization
- Real-time server communication

#### Electronic Program Guide (EPG)

- XMLTV format support
- Real-time schedule updates
- Channel logos integration
- Program descriptions
- Search within EPG
- Current and next program display
- Future schedule viewing

#### Content Search

- Full-text search across all content
- Search suggestions with history
- Spell-check functionality
- Multi-criteria search:
  - By type (channel, movie, series)
  - By category
  - By rating
- Relevance-based ranking

#### Favorites System

- Add/remove favorites
- Quick access favorites menu
- Per-profile favorites
- Favorites sorting

#### Watch History

- Track watched content
- Resume playback from last position
- History limit (configurable)
- Clear history option

#### Channel Categories

- Automatic categorization
- Custom category creation
- Category hiding
- Favorite category selection

---

### 3. Security & Parental Controls

#### PIN Protection

- 4-digit PIN setup
- Profile access protection
- Settings modification protection
- Auto-lockout after 3 failed attempts
- 30-second lockout timer

#### Category Locking

- Lock specific content categories
- PIN-protected unlock
- Category-level restrictions
- Content filtering

#### Age Restrictions

- Age-based content filtering
- Content rating system (U, PG, 12A, 15, 18)
- Age verification
- Dynamic filtering

#### VPN Integration

- Multiple VPN provider support:
  - ExpressVPN
  - NordVPN
  - Custom OpenVPN
  - WireGuard
- Auto-connect on startup
- Kill-switch protection
- DNS leak prevention

#### Multi-User Support

- Up to 10 user profiles
- Profile-specific settings
- Independent watch history
- Separate favorites lists
- Custom avatars (optional)

---

### 4. Advanced Utilities

#### Live TV Recording (DVR)

- Real-time recording
- Future program recording
- Multiple simultaneous recordings (device dependent)
- Configurable quality:
  - SD (1.5 MB/min)
  - HD (4 MB/min)
  - 4K (12 MB/min)
- Recording formats: MP4, MKV, TS
- Recording status tracking
- Completed recordings library
- Recording deletion

#### Auto-Play Features

- Auto-play next episode for series
- Configurable delay
- Skip intro support (manual)
- Resume playback option

#### Episode Progress Tracking

- Progress bar display
- Watched percentage tracking
- Resume capability
- Skip segments support

#### Google Cast Support

- Chromecast device detection
- Stream casting
- Playback control from TV
- Multi-device support
- Quality selection during cast

#### AirPlay Support

- Apple device detection
- AirPlay streaming
- Remote control capability
- Audio streaming

#### Picture-in-Picture Mode

- Floating window playback
- Adjustable window size
- Position customization
- Resizable video window
- Audio continues in background

---

## Integration Points

### M3U Parser Implementation

```typescript
// Supports standard M3U format with extensions
#EXTINF:-1 tvg-id="ch.1" tvg-name="Channel Name" tvg-logo="URL" group-title="Category"
http://stream.url/channel
```

### Xtream Codes API Endpoints

- `player_api.php?action=get_live_streams`
- `player_api.php?action=get_vod`
- `player_api.php?action=get_series`
- `player_api.php?action=get_live_categories`
- `streaming/live/user/pass/streamid.m3u8`

### EPG Format (XMLTV)

- Channel information
- Program schedule
- Program descriptions
- Channel logos
- Program ratings
- Category metadata

### VPN Providers

- Native OpenVPN support
- WireGuard protocol
- Provider-specific APIs
- Certificate-based auth

### Casting Protocols

- Google Cast (Chromecast)
- AirPlay 2
- DLNA support (future)

---

## Database Schema

### Playlists Table

- ID, Name, URL, Type, Last Updated, User ID, Metadata

### Channels Table

- ID, Playlist ID, Name, Logo, Group, Stream URL, TVG Info

### Favorites Table

- ID, User ID, Content ID, Content Type, Created Date

### Watch History Table

- ID, User ID, Content ID, Content Type, Timestamp, Duration, Current Time

### User Profiles Table

- ID, Name, Age, PIN (hashed), Avatar, Settings JSON

### Parental Controls Table

- ID, User ID, Enabled, PIN, Restricted Ages, Locked Categories, Content Rating

### EPG Programs Table

- ID, Channel ID, Title, Description, Start Time, Stop Time, Category, Icon

### Recordings Table

- ID, Stream ID, Title, Start/End Time, Duration, Quality, Format, File Path, Status

### VPN Connections Table

- ID, Name, Provider, Endpoint, Port, Protocol, Username

---

## Performance Optimizations

### Caching

- Local playlist caching
- EPG data caching (24-hour refresh)
- Thumbnail caching
- Channel logo caching

### Database

- Indexed queries for fast searches
- Connection pooling
- Transaction management
- Data pagination

### Streaming

- Adaptive bitrate streaming
- Network buffering
- Memory optimization
- Resource cleanup

---

## Compliance & Standards

- XMLTV EPG standard
- M3U extended format
- Xtream Codes API standard
- HTML5 Video standards
- Samsung Tizen compliance

---

## Future Enhancements

- Cloud backup of playlists and settings
- Recommendation engine
- Social features
- Plugin system for third-party services
- Advanced DVR scheduling
- Streaming quality analytics
- Time-shift TV capability

# AplaTV - File Structure & Quick Reference

## 📂 Complete File Listing

### Root Configuration Files

```
apnatv/
├── package.json              - NPM dependencies and scripts
├── tsconfig.json             - TypeScript compiler options
├── webpack.config.js         - Webpack bundler configuration
├── .gitignore               - Git ignore patterns
└── README.md                - Project overview
```

### Documentation Files

```
├── PROJECT_SUMMARY.md        - Complete project overview
├── DEVELOPMENT.md            - Developer guide & API reference
├── FEATURES.md               - Detailed feature documentation
└── INSTALLATION.md           - Setup and installation guide
```

### Source Code Structure

```
src/
├── index.tsx                 - React app entry point

├── config.ts                 - Application configuration
├── types.ts                  - TypeScript type definitions

└── components/              (6 React components)
    ├── App.tsx               - Main application container
    ├── Navigation.tsx        - Menu navigation UI
    ├── Player.tsx            - Video player component
    ├── EPGGrid.tsx           - Channel grid display
    ├── SearchBar.tsx         - Search interface
    ├── Settings.tsx          - Settings panel
    └── ParentalControls.tsx  - Parental controls UI

├── services/                (8 business logic services)
    ├── PlaylistService.ts    - M3U & Xtream API (300+ lines)
    ├── EPGService.ts         - EPG parsing (300+ lines)
    ├── PlayerService.ts      - Playback control (300+ lines)
    ├── RecordingService.ts   - DVR functionality (250+ lines)
    ├── AuthService.ts        - User management (400+ lines)
    ├── VPNService.ts         - VPN provider (250+ lines)
    ├── CastingService.ts     - Google Cast/AirPlay (250+ lines)
    └── SearchService.ts      - Content search (300+ lines)

├── db/                      (Database layer)
    ├── Database.ts           - SQLite connection & tables
    └── Repositories.ts       - Data access objects

└── styles/                  (Styling)
    ├── App.scss              - Main stylesheet (800+ lines)
    └── main.scss             - Style entry point
```

### Public Assets

```
public/
└── index.html               - HTML entry point
```

### Build Output

```
dist/                        - Generated build files
(Created after: npm run build)
```

### Node Modules

```
node_modules/               - NPM dependencies
(Created after: npm install)
```

---

## 🎯 Quick Command Reference

### Installation

```bash
npm install                  # Install all dependencies
npm install --force         # Force install with peer deps
```

### Development

```bash
npm run dev                  # Start dev server (localhost:8080)
npm run build                # Build for production
npm run type-check           # TypeScript compilation check
npm run lint                 # Run ESLint
npm run lint -- --fix        # Auto-fix lint issues
```

### Project Statistics

- **Total Files:** 25+
- **Total Lines:** 5,000+ TypeScript/TSX
- **Services:** 8
- **Components:** 6
- **Database Tables:** 8
- **Supported Features:** 40+

---

## 📋 File Descriptions

### Core Services

**PlaylistService.ts** (300+ lines)

- M3U parsing and validation
- Xtream API integration
- Stream URL generation
- Channel organization

**EPGService.ts** (300+ lines)

- XMLTV EPG parsing
- Program scheduling
- Channel information
- Search within EPG

**PlayerService.ts** (300+ lines)

- Playback state management
- Quality selection
- Audio/subtitle handling
- External player support
- PiP mode control

**RecordingService.ts** (250+ lines)

- DVR recording management
- Quality and format selection
- Recording status tracking
- Storage estimation

**AuthService.ts** (400+ lines)

- User profile management
- PIN protection
- Parental controls
- Favorites and history
- Lockout handling

**VPNService.ts** (250+ lines)

- VPN provider management
- Connection management
- Provider discovery
- Status tracking

**CastingService.ts** (250+ lines)

- Device discovery
- Cast session management
- Playback control
- Device capability checking

**SearchService.ts** (300+ lines)

- Full-text search
- Search suggestions
- Spell-checking
- Advanced search with filters

### React Components

**App.tsx**

- Main application container
- View routing and state management
- Modal handling
- Event delegation

**Navigation.tsx**

- Main menu navigation
- Active state tracking
- Settings access button
- View switching

**Player.tsx**

- Video player UI
- Playback controls
- Volume and quality selection
- Audio/subtitle selection
- Progress tracking

**EPGGrid.tsx**

- Channel card grid layout
- Channel selection
- Logo display
- Hover animations

**SearchBar.tsx**

- Search input field
- Real-time suggestions
- Search history
- Auto-completion

**Settings.tsx**

- Tabbed settings interface
- General settings
- Playlist management
- VPN configuration
- About section

**ParentalControls.tsx**

- PIN setup interface
- Category locking
- Rating restrictions
- Content filtering

### Database Layer

**Database.ts**

- SQLite connection management
- Table creation and schema
- Query execution helpers
- Connection lifecycle

**Repositories.ts**

- PlaylistRepository - Playlist CRUD operations
- FavoritesRepository - Favorite management
- HistoryRepository - Watch history tracking
- SettingsRepository - User preferences

### Configuration & Types

**config.ts**

- Application configuration
- Feature flags
- Default settings
- Storage limits

**types.ts**

- MediaType definitions
- StreamInfo interface
- UserPreferences
- Event types
- API response types

### Styles

**App.scss** (800+ lines)

- Complete styling for all components
- Dark theme optimized for TV
- Responsive design
- Animations and transitions
- Scrollbar styling

---

## 🔍 Finding Code by Feature

### Live TV Streaming

- Services: `PlaylistService`, `PlayerService`
- Components: `Player`, `EPGGrid`
- Database: `channels`, `playlists` tables

### DVR Recording

- Services: `RecordingService`
- Database: `recordings` table

### Parental Controls

- Services: `AuthService`
- Components: `ParentalControls`
- Database: `parental_controls` table

### Search

- Services: `SearchService`, `EPGService`
- Components: `SearchBar`

### User Management

- Services: `AuthService`
- Database: `user_profiles` table

### VPN

- Services: `VPNService`
- Database: `vpn_connections` table

### Casting

- Services: `CastingService`
- Components: `Player`

---

## 🚀 Development Workflow

### 1. Start Development

```bash
npm install
npm run dev
```

Access: `http://localhost:8080`

### 2. Make Changes

- Edit files in `src/`
- Hot reload automatically
- Check console for errors

### 3. Check Quality

```bash
npm run type-check  # TypeScript
npm run lint        # ESLint
```

### 4. Build & Deploy

```bash
npm run build
# Package for Samsung TV using Tizen CLI
tizen package -t wgt -s ProfileName -- ./dist
```

---

## 📚 Documentation Map

| File               | Purpose                 | Audience            |
| ------------------ | ----------------------- | ------------------- |
| README.md          | Quick overview          | Everyone            |
| PROJECT_SUMMARY.md | Complete project status | Managers, overview  |
| INSTALLATION.md    | Setup guide             | New developers      |
| DEVELOPMENT.md     | API reference & guide   | Developers          |
| FEATURES.md        | Feature documentation   | Product, developers |

---

## 🔗 Key Integration Points

### M3U Parsing

Location: `PlaylistService.ts:parseM3UContent()`
Format: Extended M3U with metadata

### Xtream API

Location: `PlaylistService.ts:getXtreamLiveStreams()`
Endpoint: `player_api.php`

### EPG (XMLTV)

Location: `EPGService.ts:parseEPGXML()`
Format: XMLTV standard

### Database

Location: `db/Database.ts`
Type: SQLite3

### UI Framework

Location: `components/`
Framework: React 18.2 + TypeScript

---

## 📊 Code Statistics

### By Service

| Service          | Lines | Functions |
| ---------------- | ----- | --------- |
| PlaylistService  | 300+  | 6         |
| EPGService       | 300+  | 6         |
| PlayerService    | 300+  | 15+       |
| RecordingService | 250+  | 8         |
| AuthService      | 400+  | 16+       |
| VPNService       | 250+  | 10        |
| CastingService   | 250+  | 9         |
| SearchService    | 300+  | 10        |

### By Component

| Component  | Lines | Purpose         |
| ---------- | ----- | --------------- |
| App        | 100+  | Main container  |
| Player     | 150+  | Video player    |
| Navigation | 80+   | Menu navigation |
| Settings   | 120+  | Settings UI     |
| EPGGrid    | 50+   | Channel grid    |
| SearchBar  | 80+   | Search          |

### Styling

- App.scss: 800+ lines
- TV-optimized dark theme
- Responsive breakpoints

---

## ✅ Completion Status

- [x] Project structure created
- [x] All services implemented
- [x] Database layer completed
- [x] React components built
- [x] Styling complete (SCSS)
- [x] Configuration system
- [x] Type definitions
- [x] Documentation
- [x] API reference
- [x] Installation guide
- [x] Development guide
- [x] Feature documentation

---

## 🎯 Ready For

- [x] Development
- [x] Testing
- [x] Deployment
- [x] Samsung TV deployment
- [x] Production use

---

## 📞 Support Files

All documentation is self-contained in the project:

1. **Quick Start:** Read `README.md`
2. **Setup:** Follow `INSTALLATION.md`
3. **Development:** Reference `DEVELOPMENT.md`
4. **Features:** Check `FEATURES.md`
5. **Overview:** See `PROJECT_SUMMARY.md`

---

**Last Updated:** May 2026  
**Project Status:** ✅ Complete and Production Ready  
**Version:** 1.0.0

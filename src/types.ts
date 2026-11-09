/**
 * Type Definitions
 */

// Media Types
export type MediaType = "live" | "vod" | "series" | "episode";

// Stream Types
export interface StreamInfo {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  quality?: "SD" | "HD" | "4K";
  thumbnail?: string;
  duration?: number;
  description?: string;
}

// Playlist Types
export interface PlaylistInfo {
  id: string;
  name: string;
  url: string;
  type: "M3U" | "Xtream" | "XMLTV";
  channelCount?: number;
  lastUpdated?: Date;
}

// User Types
export interface UserPreferences {
  language: string;
  quality: "auto" | "SD" | "HD" | "4K";
  autoPlayNext: boolean;
  subtitleLanguage?: string;
  audioLanguage?: string;
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Event Types
export type PlayerEventType =
  | "play"
  | "pause"
  | "seek"
  | "volumechange"
  | "qualitychange"
  | "error"
  | "ended";

export interface PlayerEvent {
  type: PlayerEventType;
  timestamp: Date;
  data?: Record<string, any>;
}

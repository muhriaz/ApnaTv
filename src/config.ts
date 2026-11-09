/**
 * Application Configuration
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  features: {
    enableDVR: boolean;
    enableVPN: boolean;
    enableCasting: boolean;
    enable4K: boolean;
    maxProfiles: number;
    maxRecordings: number;
  };
  defaults: {
    quality: "auto" | "SD" | "HD" | "4K";
    volume: number;
    autoPlayNext: boolean;
    language: string;
  };
  limits: {
    maxPlaylistSize: number;
    maxFavorites: number;
    maxHistoryItems: number;
    recordingQualityLimits: Record<string, number>; // Storage limits in GB
  };
}

const appConfig: AppConfig = {
  app: {
    name: "AplaTV",
    version: "1.0.0",
    description: "Professional IPTV App for Samsung TV",
  },
  features: {
    enableDVR: true,
    enableVPN: true,
    enableCasting: true,
    enable4K: true,
    maxProfiles: 10,
    maxRecordings: 5,
  },
  defaults: {
    quality: "auto",
    volume: 75,
    autoPlayNext: true,
    language: "en",
  },
  limits: {
    maxPlaylistSize: 10000,
    maxFavorites: 1000,
    maxHistoryItems: 500,
    recordingQualityLimits: {
      SD: 50,
      HD: 200,
      "4K": 500,
    },
  },
};

export default appConfig;

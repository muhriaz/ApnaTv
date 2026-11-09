export interface PlayerState {
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0-100
  isMuted: boolean;
  quality: "auto" | "SD" | "HD" | "4K";
  audioTrack?: string;
  subtitle?: string;
  isPictureInPicture: boolean;
}

export interface AudioTrack {
  id: string;
  language: string;
  codec: string;
  bitrate?: number;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  format: "srt" | "vtt" | "ass" | "ssa";
  url?: string;
}

export interface ExternalPlayer {
  name: "vlc" | "mxplayer" | "mpv" | "custom";
  executable: string;
  parameters?: string[];
}

export class PlayerService {
  private state: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 75,
    isMuted: false,
    quality: "auto",
    isPictureInPicture: false,
  };

  private audioTracks: AudioTrack[] = [];
  private subtitleTracks: SubtitleTrack[] = [];
  private externalPlayers: Map<string, ExternalPlayer> = new Map();

  // Initialize common external players
  constructor() {
    this.registerExternalPlayer({
      name: "vlc",
      executable: "vlc",
      parameters: ["--fullscreen", "--play-and-exit"],
    });

    this.registerExternalPlayer({
      name: "mxplayer",
      executable: "mxplayer",
      parameters: ["--fullscreen"],
    });

    this.registerExternalPlayer({
      name: "mpv",
      executable: "mpv",
      parameters: ["--fullscreen"],
    });
  }

  /**
   * Get current player state
   */
  getPlayerState(): PlayerState {
    return { ...this.state };
  }

  /**
   * Play stream
   */
  play(): void {
    this.state.isPlaying = true;
  }

  /**
   * Pause stream
   */
  pause(): void {
    this.state.isPlaying = false;
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause(): void {
    this.state.isPlaying = !this.state.isPlaying;
  }

  /**
   * Seek to time
   */
  seek(seconds: number): void {
    this.state.currentTime = Math.max(
      0,
      Math.min(seconds, this.state.duration),
    );
  }

  /**
   * Skip forward
   */
  skipForward(seconds: number = 10): void {
    this.seek(this.state.currentTime + seconds);
  }

  /**
   * Skip backward
   */
  skipBackward(seconds: number = 10): void {
    this.seek(this.state.currentTime - seconds);
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(100, volume));
  }

  /**
   * Increase volume
   */
  increaseVolume(step: number = 5): void {
    this.setVolume(this.state.volume + step);
  }

  /**
   * Decrease volume
   */
  decreaseVolume(step: number = 5): void {
    this.setVolume(this.state.volume - step);
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
  }

  /**
   * Set quality
   */
  setQuality(quality: "auto" | "SD" | "HD" | "4K"): void {
    this.state.quality = quality;
  }

  /**
   * Select audio track
   */
  selectAudioTrack(trackId: string): void {
    if (this.audioTracks.find((t) => t.id === trackId)) {
      this.state.audioTrack = trackId;
    }
  }

  /**
   * Select subtitle track
   */
  selectSubtitle(trackId: string | null): void {
    if (trackId === null) {
      this.state.subtitle = undefined;
    } else if (this.subtitleTracks.find((t) => t.id === trackId)) {
      this.state.subtitle = trackId;
    }
  }

  /**
   * Get available audio tracks
   */
  getAudioTracks(): AudioTrack[] {
    return [...this.audioTracks];
  }

  /**
   * Set audio tracks
   */
  setAudioTracks(tracks: AudioTrack[]): void {
    this.audioTracks = [...tracks];
    if (tracks.length > 0 && !this.state.audioTrack) {
      this.state.audioTrack = tracks[0].id;
    }
  }

  /**
   * Get available subtitles
   */
  getSubtitles(): SubtitleTrack[] {
    return [...this.subtitleTracks];
  }

  /**
   * Set subtitles
   */
  setSubtitles(tracks: SubtitleTrack[]): void {
    this.subtitleTracks = [...tracks];
  }

  /**
   * Toggle Picture-in-Picture
   */
  togglePictureInPicture(): void {
    this.state.isPictureInPicture = !this.state.isPictureInPicture;
  }

  /**
   * Update duration
   */
  setDuration(duration: number): void {
    this.state.duration = Math.max(0, duration);
  }

  /**
   * Register external player
   */
  registerExternalPlayer(player: ExternalPlayer): void {
    this.externalPlayers.set(player.name, player);
  }

  /**
   * Get available external players
   */
  getAvailableExternalPlayers(): ExternalPlayer[] {
    return Array.from(this.externalPlayers.values());
  }

  /**
   * Get external player by name
   */
  getExternalPlayer(name: string): ExternalPlayer | null {
    return this.externalPlayers.get(name) || null;
  }

  /**
   * Generate streaming URL with quality parameter
   */
  generateStreamUrl(baseUrl: string, quality: string = "auto"): string {
    if (quality === "auto") {
      return baseUrl;
    }

    // Add quality parameter if supported by the URL format
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}quality=${quality}`;
  }

  /**
   * Check if stream supports 4K
   */
  supports4K(streamUrl: string): boolean {
    // Check URL or manifest for 4K support
    return streamUrl.includes("4k") || streamUrl.includes("2160");
  }

  /**
   * Reset player state
   */
  reset(): void {
    this.state = {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 75,
      isMuted: false,
      quality: "auto",
      isPictureInPicture: false,
    };
    this.audioTracks = [];
    this.subtitleTracks = [];
  }
}

export default new PlayerService();

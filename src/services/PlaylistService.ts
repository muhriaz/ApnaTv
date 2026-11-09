import axios, { AxiosInstance } from "axios";

export interface M3UPlaylist {
  id: string;
  name: string;
  url: string;
  channels: M3UChannel[];
  lastUpdated: Date;
}

export interface M3UChannel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
  duration: number;
  tvg_id?: string;
  tvg_name?: string;
  tvg_logo?: string;
}

export interface XtreamAccount {
  username: string;
  password: string;
  baseUrl: string;
}

export interface XtreamLiveTV {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  is_adult: number;
  category_id: string;
  category_name: string;
  tv_archive: number;
  direct_source: string;
  custom_sid?: string;
}

export class PlaylistService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
    });
  }

  /**
   * Parse M3U playlist file
   */
  async parseM3UPlaylist(url: string): Promise<M3UChannel[]> {
    try {
      const response = await this.client.get(url);
      return this.parseM3UContent(response.data);
    } catch (error) {
      console.error("Error parsing M3U playlist:", error);
      throw new Error("Failed to parse M3U playlist");
    }
  }

  /**
   * Parse M3U content string
   */
  private parseM3UContent(content: string): M3UChannel[] {
    const channels: M3UChannel[] = [];
    const lines = content.split("\n");
    let currentChannel: Partial<M3UChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("#EXTINF:")) {
        // Parse channel metadata
        currentChannel = this.parseExtinf(line);
      } else if (line && !line.startsWith("#")) {
        // This is the stream URL
        if (currentChannel) {
          currentChannel.url = line;
          currentChannel.id = `channel-${channels.length}`;
          channels.push(currentChannel as M3UChannel);
          currentChannel = {};
        }
      }
    }

    return channels;
  }

  /**
   * Parse EXTINF line from M3U
   */
  private parseExtinf(line: string): Partial<M3UChannel> {
    const channel: Partial<M3UChannel> = {
      group: "Uncategorized",
      duration: -1,
    };

    // Extract duration
    const durationMatch = line.match(/^#EXTINF:([-\d.]+)/);
    if (durationMatch) {
      channel.duration = parseInt(durationMatch[1], 10);
    }

    // Extract attributes
    const nameMatch = line.match(/,(.+)$/);
    if (nameMatch) {
      channel.name = nameMatch[1].trim();
    }

    // Extract tvg attributes
    const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
    if (tvgIdMatch) {
      channel.tvg_id = tvgIdMatch[1];
    }

    const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
    if (tvgNameMatch) {
      channel.tvg_name = tvgNameMatch[1];
    }

    const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
    if (tvgLogoMatch) {
      channel.tvg_logo = tvgLogoMatch[1];
      channel.logo = tvgLogoMatch[1];
    }

    const groupMatch = line.match(/group-title="([^"]+)"/);
    if (groupMatch) {
      channel.group = groupMatch[1];
    }

    return channel;
  }

  /**
   * Get live streams from Xtream API
   */
  async getXtreamLiveStreams(account: XtreamAccount): Promise<XtreamLiveTV[]> {
    try {
      const url = `${account.baseUrl}/player_api.php?username=${account.username}&password=${account.password}&action=get_live_streams`;
      const response = await this.client.get(url);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching Xtream live streams:", error);
      throw new Error("Failed to fetch Xtream live streams");
    }
  }

  /**
   * Get VOD from Xtream API
   */
  async getXtreamVOD(account: XtreamAccount): Promise<any[]> {
    try {
      const url = `${account.baseUrl}/player_api.php?username=${account.username}&password=${account.password}&action=get_vod`;
      const response = await this.client.get(url);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching Xtream VOD:", error);
      throw new Error("Failed to fetch Xtream VOD");
    }
  }

  /**
   * Get series from Xtream API
   */
  async getXtreamSeries(account: XtreamAccount): Promise<any[]> {
    try {
      const url = `${account.baseUrl}/player_api.php?username=${account.username}&password=${account.password}&action=get_series`;
      const response = await this.client.get(url);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching Xtream series:", error);
      throw new Error("Failed to fetch Xtream series");
    }
  }

  /**
   * Get stream URL from Xtream API
   */
  getXtreamStreamUrl(
    account: XtreamAccount,
    streamId: number,
    streamType: "live" | "vod" | "series" = "live",
  ): string {
    return `${account.baseUrl}/streaming/${streamType}/${account.username}/${account.password}/${streamId}.m3u8`;
  }

  /**
   * Validate Xtream credentials
   */
  async validateXtreamCredentials(account: XtreamAccount): Promise<boolean> {
    try {
      const url = `${account.baseUrl}/player_api.php?username=${account.username}&password=${account.password}&action=get_live_categories`;
      const response = await this.client.get(url, { timeout: 5000 });
      return Array.isArray(response.data);
    } catch (error) {
      return false;
    }
  }

  /**
   * Download M3U file from URL
   */
  async downloadM3UFile(url: string): Promise<string> {
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error("Error downloading M3U file:", error);
      throw new Error("Failed to download M3U file");
    }
  }
}

export default new PlaylistService();

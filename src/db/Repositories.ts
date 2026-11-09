import { Database } from "./Database";

export class PlaylistRepository {
  constructor(private db: Database) {}

  /**
   * Save playlist
   */
  async savePlaylist(playlistData: {
    id: string;
    name: string;
    url: string;
    type: string;
    userId?: string;
    data?: any;
  }): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO playlists (id, name, url, type, userId, data, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    await this.db.run(sql, [
      playlistData.id,
      playlistData.name,
      playlistData.url,
      playlistData.type,
      playlistData.userId,
      JSON.stringify(playlistData.data || {}),
    ]);
  }

  /**
   * Get playlist by ID
   */
  async getPlaylistById(playlistId: string): Promise<any> {
    return this.db.get("SELECT * FROM playlists WHERE id = ?", [playlistId]);
  }

  /**
   * Get all playlists
   */
  async getAllPlaylists(userId?: string): Promise<any[]> {
    if (userId) {
      return this.db.all(
        "SELECT * FROM playlists WHERE userId = ? ORDER BY lastUpdated DESC",
        [userId],
      );
    }
    return this.db.all("SELECT * FROM playlists ORDER BY lastUpdated DESC");
  }

  /**
   * Delete playlist
   */
  async deletePlaylist(playlistId: string): Promise<void> {
    // Delete related channels
    await this.db.run("DELETE FROM channels WHERE playlistId = ?", [
      playlistId,
    ]);
    // Delete playlist
    await this.db.run("DELETE FROM playlists WHERE id = ?", [playlistId]);
  }

  /**
   * Save channel
   */
  async saveChannel(channelData: {
    id: string;
    playlistId: string;
    name: string;
    logo?: string;
    group_name?: string;
    url: string;
    tvg_id?: string;
    tvg_name?: string;
  }): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO channels 
      (id, playlistId, name, logo, group_name, url, tvg_id, tvg_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await this.db.run(sql, [
      channelData.id,
      channelData.playlistId,
      channelData.name,
      channelData.logo,
      channelData.group_name,
      channelData.url,
      channelData.tvg_id,
      channelData.tvg_name,
    ]);
  }

  /**
   * Get channels by playlist
   */
  async getChannelsByPlaylist(playlistId: string): Promise<any[]> {
    return this.db.all(
      "SELECT * FROM channels WHERE playlistId = ? ORDER BY group_name, name",
      [playlistId],
    );
  }
}

export class FavoritesRepository {
  constructor(private db: Database) {}

  /**
   * Add to favorites
   */
  async addFavorite(
    userId: string,
    contentId: string,
    contentType: string,
  ): Promise<void> {
    const id = `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.run(
      "INSERT INTO favorites (id, userId, contentId, contentType) VALUES (?, ?, ?, ?)",
      [id, userId, contentId, contentType],
    );
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(userId: string, contentId: string): Promise<void> {
    await this.db.run(
      "DELETE FROM favorites WHERE userId = ? AND contentId = ?",
      [userId, contentId],
    );
  }

  /**
   * Get favorites
   */
  async getFavorites(userId: string): Promise<any[]> {
    return this.db.all(
      "SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt DESC",
      [userId],
    );
  }
}

export class HistoryRepository {
  constructor(private db: Database) {}

  /**
   * Add to history
   */
  async addToHistory(
    userId: string,
    contentId: string,
    contentType: string,
    currentTime?: number,
    duration?: number,
  ): Promise<void> {
    const id = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.run(
      `INSERT INTO watch_history (id, userId, contentId, contentType, currentTime, duration)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, contentId, contentType, currentTime, duration],
    );
  }

  /**
   * Get history
   */
  async getHistory(userId: string, limit: number = 50): Promise<any[]> {
    return this.db.all(
      "SELECT * FROM watch_history WHERE userId = ? ORDER BY watchedAt DESC LIMIT ?",
      [userId, limit],
    );
  }

  /**
   * Get resume point
   */
  async getResumePoint(userId: string, contentId: string): Promise<any> {
    return this.db.get(
      `SELECT currentTime, duration FROM watch_history 
       WHERE userId = ? AND contentId = ? 
       ORDER BY watchedAt DESC LIMIT 1`,
      [userId, contentId],
    );
  }
}

export class SettingsRepository {
  constructor(private db: Database) {}

  /**
   * Save user profile
   */
  async saveProfile(profileData: {
    id: string;
    name: string;
    age?: number;
    pin?: string;
    avatar?: string;
    settings?: any;
  }): Promise<void> {
    const sql = `
      INSERT OR REPLACE INTO user_profiles (id, name, age, pin, avatar, settings, lastAccessed)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    await this.db.run(sql, [
      profileData.id,
      profileData.name,
      profileData.age,
      profileData.pin,
      profileData.avatar,
      JSON.stringify(profileData.settings || {}),
    ]);
  }

  /**
   * Get profile
   */
  async getProfile(profileId: string): Promise<any> {
    return this.db.get("SELECT * FROM user_profiles WHERE id = ?", [profileId]);
  }

  /**
   * Get all profiles
   */
  async getAllProfiles(): Promise<any[]> {
    return this.db.all(
      "SELECT * FROM user_profiles ORDER BY lastAccessed DESC",
    );
  }
}

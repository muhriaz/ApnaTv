import sqlite3 from "sqlite3";
import path from "path";

export class Database {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string = "apnatv.db") {
    this.dbPath = dbPath;
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.createTables();
          resolve();
        }
      });
    });
  }

  /**
   * Create database tables
   */
  private createTables(): void {
    if (!this.db) return;

    // Playlists table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT NOT NULL,
        lastUpdated DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        userId TEXT,
        data JSON
      )
    `);

    // Channels table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS channels (
        id TEXT PRIMARY KEY,
        playlistId TEXT NOT NULL,
        name TEXT NOT NULL,
        logo TEXT,
        group_name TEXT,
        url TEXT NOT NULL,
        tvg_id TEXT,
        tvg_name TEXT,
        is_favorite BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (playlistId) REFERENCES playlists(id)
      )
    `);

    // Favorites table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        contentId TEXT NOT NULL,
        contentType TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Watch history table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        contentId TEXT NOT NULL,
        contentType TEXT NOT NULL,
        watchedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        duration INTEGER,
        currentTime INTEGER
      )
    `);

    // User profiles table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        pin TEXT,
        avatar TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastAccessed DATETIME,
        settings JSON
      )
    `);

    // Parental controls table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS parental_controls (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        enabled BOOLEAN DEFAULT 1,
        pin TEXT,
        restrictedAges JSON,
        lockedCategories JSON,
        contentRating TEXT,
        purchaseRestriction BOOLEAN DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES user_profiles(id)
      )
    `);

    // EPG table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS epg_programs (
        id TEXT PRIMARY KEY,
        channelId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        stop_time DATETIME NOT NULL,
        category TEXT,
        icon TEXT,
        rating REAL
      )
    `);

    // Recordings table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS recordings (
        id TEXT PRIMARY KEY,
        streamId TEXT NOT NULL,
        title TEXT NOT NULL,
        startTime DATETIME NOT NULL,
        endTime DATETIME,
        duration INTEGER,
        quality TEXT,
        format TEXT,
        filePath TEXT,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        completedAt DATETIME
      )
    `);

    // VPN connections table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS vpn_connections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        port INTEGER,
        protocol TEXT,
        username TEXT,
        certificatePath TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Run a query
   */
  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get single row
   */
  async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db?.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Get all rows
   */
  async all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db?.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default new Database();

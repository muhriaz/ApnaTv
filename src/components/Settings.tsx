import React, { useState } from "react";

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [tab, setTab] = useState<"general" | "playlists" | "vpn" | "about">(
    "general",
  );

  return (
    <div className="settings-panel">
      <header className="settings-header">
        <h2>Settings</h2>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </header>

      <div className="settings-tabs">
        <button
          className={`tab-btn ${tab === "general" ? "active" : ""}`}
          onClick={() => setTab("general")}
        >
          General
        </button>
        <button
          className={`tab-btn ${tab === "playlists" ? "active" : ""}`}
          onClick={() => setTab("playlists")}
        >
          Playlists
        </button>
        <button
          className={`tab-btn ${tab === "vpn" ? "active" : ""}`}
          onClick={() => setTab("vpn")}
        >
          VPN
        </button>
        <button
          className={`tab-btn ${tab === "about" ? "active" : ""}`}
          onClick={() => setTab("about")}
        >
          About
        </button>
      </div>

      <div className="settings-content">
        {tab === "general" && (
          <div className="settings-section">
            <h3>General Settings</h3>
            <label>
              <input type="checkbox" defaultChecked /> Auto-play next episode
            </label>
            <label>
              <input type="checkbox" /> Show 4K content only
            </label>
            <label>
              Language:
              <select>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>
          </div>
        )}

        {tab === "playlists" && (
          <div className="settings-section">
            <h3>Playlist Management</h3>
            <button className="btn btn-primary">Add M3U Playlist</button>
            <button className="btn btn-secondary">
              Add Xtream Credentials
            </button>
            <div className="playlist-list">
              {/* List will be populated here */}
            </div>
          </div>
        )}

        {tab === "vpn" && (
          <div className="settings-section">
            <h3>VPN Settings</h3>
            <label>
              VPN Provider:
              <select>
                <option>ExpressVPN</option>
                <option>NordVPN</option>
                <option>Custom</option>
              </select>
            </label>
            <button className="btn btn-primary">Connect VPN</button>
          </div>
        )}

        {tab === "about" && (
          <div className="settings-section">
            <h3>About AplaTV</h3>
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Application:</strong> Professional IPTV App for Samsung TV
            </p>
            <p>
              <strong>Features:</strong> M3U, Xtream API, EPG, DVR, VPN,
              Multi-user
            </p>
            <p className="copyright">© 2026 AplaTV. All rights reserved.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

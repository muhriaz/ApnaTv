import React, { useState, useEffect } from "react";
import PlayerService, { PlayerState } from "../services/PlayerService";

interface PlayerProps {
  channelId?: string;
}

const Player: React.FC<PlayerProps> = ({ channelId }) => {
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerService.getPlayerState(),
  );
  const [showControls, setShowControls] = useState(true);
  const [audioTracks, setAudioTracks] = useState(
    PlayerService.getAudioTracks(),
  );
  const [subtitles, setSubtitles] = useState(PlayerService.getSubtitles());

  useEffect(() => {
    if (channelId) {
      PlayerService.play();
      updatePlayerState();
    }

    const interval = setInterval(updatePlayerState, 500);
    return () => clearInterval(interval);
  }, [channelId]);

  const updatePlayerState = () => {
    setPlayerState(PlayerService.getPlayerState());
  };

  const handlePlay = () => {
    PlayerService.play();
    updatePlayerState();
  };

  const handlePause = () => {
    PlayerService.pause();
    updatePlayerState();
  };

  const handleVolumeChange = (value: number) => {
    PlayerService.setVolume(value);
    updatePlayerState();
  };

  const handleQualityChange = (quality: "auto" | "SD" | "HD" | "4K") => {
    PlayerService.setQuality(quality);
    updatePlayerState();
  };

  const handlePictureInPicture = () => {
    PlayerService.togglePictureInPicture();
    updatePlayerState();
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="player-container">
      <div
        className="video-element"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video player would be here */}
        <div className="video-placeholder">
          {channelId ? `Playing: ${channelId}` : "No channel selected"}
        </div>

        {showControls && (
          <div className="player-controls">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(playerState.currentTime / playerState.duration) * 100}%`,
                }}
              />
            </div>

            <div className="control-buttons">
              <div className="left-controls">
                <button
                  onClick={playerState.isPlaying ? handlePause : handlePlay}
                  className="control-btn"
                  title={playerState.isPlaying ? "Pause" : "Play"}
                >
                  {playerState.isPlaying ? "⏸️" : "▶️"}
                </button>

                <div className="volume-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={playerState.volume}
                    onChange={(e) =>
                      handleVolumeChange(parseInt(e.target.value))
                    }
                    className="volume-slider"
                  />
                  <span>{playerState.volume}%</span>
                </div>

                <span className="time-display">
                  {formatTime(playerState.currentTime)} /{" "}
                  {formatTime(playerState.duration)}
                </span>
              </div>

              <div className="right-controls">
                <select
                  value={playerState.quality}
                  onChange={(e) => handleQualityChange(e.target.value as any)}
                  className="quality-select"
                >
                  <option value="auto">Auto</option>
                  <option value="SD">SD</option>
                  <option value="HD">HD</option>
                  <option value="4K">4K</option>
                </select>

                <button
                  onClick={handlePictureInPicture}
                  className="control-btn"
                  title="Picture in Picture"
                >
                  📱
                </button>

                <button
                  className="control-btn fullscreen-btn"
                  title="Fullscreen"
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="player-sidebar">
        <div className="sidebar-section">
          <h3>Audio Tracks</h3>
          <select className="audio-select">
            {audioTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.language} ({track.codec})
              </option>
            ))}
          </select>
        </div>

        <div className="sidebar-section">
          <h3>Subtitles</h3>
          <select className="subtitle-select">
            <option value="">None</option>
            {subtitles.map((track) => (
              <option key={track.id} value={track.id}>
                {track.language}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Player;

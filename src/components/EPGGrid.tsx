import React from "react";

interface EPGGridProps {
  type: "live" | "vod" | "series";
  onChannelSelect: (channelId: string) => void;
}

const EPGGrid: React.FC<EPGGridProps> = ({ type, onChannelSelect }) => {
  // Mock data
  const mockChannels = [
    { id: "1", name: "Channel 1", logo: "", category: type },
    { id: "2", name: "Channel 2", logo: "", category: type },
    { id: "3", name: "Channel 3", logo: "", category: type },
    { id: "4", name: "Channel 4", logo: "", category: type },
  ];

  return (
    <div className="epg-grid">
      {mockChannels.map((channel) => (
        <div
          key={channel.id}
          className="channel-card"
          onClick={() => onChannelSelect(channel.id)}
        >
          <div className="channel-logo">
            {channel.logo ? (
              <img src={channel.logo} alt={channel.name} />
            ) : (
              <div className="placeholder-logo">{channel.name}</div>
            )}
          </div>
          <h3>{channel.name}</h3>
          <p>Category: {type}</p>
        </div>
      ))}
    </div>
  );
};

export default EPGGrid;

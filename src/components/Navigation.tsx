import React from "react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onSettingsOpen: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onSettingsOpen,
}) => {
  return (
    <nav className="main-navigation">
      <ul className="nav-menu">
        <li>
          <button
            className={`nav-item ${currentView === "home" ? "active" : ""}`}
            onClick={() => onViewChange("home")}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={`nav-item ${currentView === "live" ? "active" : ""}`}
            onClick={() => onViewChange("live")}
          >
            Live TV
          </button>
        </li>
        <li>
          <button
            className={`nav-item ${currentView === "vod" ? "active" : ""}`}
            onClick={() => onViewChange("vod")}
          >
            On Demand
          </button>
        </li>
        <li>
          <button
            className={`nav-item ${currentView === "series" ? "active" : ""}`}
            onClick={() => onViewChange("series")}
          >
            Series
          </button>
        </li>
        <li>
          <button
            className={`nav-item ${currentView === "parental" ? "active" : ""}`}
            onClick={() => onViewChange("parental")}
          >
            Parental Controls
          </button>
        </li>
        <li>
          <button
            className="nav-item settings-btn"
            onClick={onSettingsOpen}
            title="Settings"
          >
            ⚙️ Settings
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

import React, { useState, useEffect } from "react";
import "../styles/App.scss";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Apnatv</h1>
        <p>IPTV Streaming App</p>
      </header>

      <div className="app-main">
        <nav className="main-navigation">
          <ul className="nav-menu">
            <li>
              <button className="nav-item active">Home</button>
            </li>
            <li>
              <button className="nav-item">Live TV</button>
            </li>
            <li>
              <button className="nav-item">On Demand</button>
            </li>
            <li>
              <button className="nav-item">Series</button>
            </li>
          </ul>
        </nav>

        <main className="app-content">
          <div className="content-view">
            <h2>Welcome to Apnatv</h2>
            <p>Your premium IPTV streaming solution for Samsung TV</p>
            <p style={{ marginTop: "20px", color: "#aaa" }}>
              ✓ App is running successfully!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";

const ParentalControls: React.FC = () => {
  const [pin, setPin] = useState("");
  const [pinSet, setPinSet] = useState(false);
  const [lockedCategories, setLockedCategories] = useState<string[]>([]);

  const categories = [
    "Action",
    "Horror",
    "Adult Content",
    "Violence",
    "Sexual Content",
  ];

  const handleSetPin = () => {
    if (pin.length >= 4) {
      setPinSet(true);
    }
  };

  const handleCategoryLock = (category: string) => {
    setLockedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="parental-controls-panel">
      <h2>Parental Controls</h2>

      <section className="pin-section">
        <h3>PIN Protection</h3>
        {!pinSet ? (
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              className="pin-input"
            />
            <button onClick={handleSetPin} className="btn btn-primary">
              Set PIN
            </button>
          </div>
        ) : (
          <div>
            <p>✓ PIN is set</p>
            <button
              onClick={() => {
                setPinSet(false);
                setPin("");
              }}
              className="btn btn-secondary"
            >
              Change PIN
            </button>
          </div>
        )}
      </section>

      <section className="categories-section">
        <h3>Locked Categories</h3>
        <div className="category-list">
          {categories.map((category) => (
            <label key={category} className="category-item">
              <input
                type="checkbox"
                checked={lockedCategories.includes(category)}
                onChange={() => handleCategoryLock(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </section>

      <section className="rating-section">
        <h3>Content Rating</h3>
        <select className="rating-select">
          <option>All</option>
          <option>U</option>
          <option>PG</option>
          <option>12A</option>
          <option>15</option>
          <option>18</option>
        </select>
      </section>
    </div>
  );
};

export default ParentalControls;

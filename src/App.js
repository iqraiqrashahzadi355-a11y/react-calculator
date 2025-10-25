import React, { useState, useEffect } from "react";
import "./App.css";

const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+"
];

function App() {
  const [display, setDisplay] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [animating, setAnimating] = useState(false);

  const append = (val) => {
    if (justEvaluated && /[0-9.]/.test(val)) {
      setDisplay(val);
      setJustEvaluated(false);
      return;
    }

    if (/[+\-*/]/.test(val)) {
      if (display === "" && val !== "-") return;
      if (/[+\-*/]$/.test(display)) {
        setDisplay(display.slice(0, -1) + val);
        setJustEvaluated(false);
        return;
      }
    }

    const parts = display.split(/[+\-*/]/);
    const lastPart = parts[parts.length - 1];
    if (val === "." && lastPart.includes(".")) return;

    setDisplay(display + val);
    setJustEvaluated(false);
  };

  const clearAll = () => {
    setDisplay("");
    setJustEvaluated(false);
  };

  const delLast = () => {
    setDisplay(display.slice(0, -1));
  };

  const evaluate = () => {
    if (display === "") return;
    try {
      if (/[^0-9+\-*/().]/.test(display)) {
        setDisplay("Error");
        return;
      }
      const result = Function(`"use strict"; return (${display})`)();
      setDisplay(String(result));
      setJustEvaluated(true);
    } catch {
      setDisplay("Error");
      setTimeout(() => setDisplay(""), 800);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (/[0-9+\-*/.]/.test(key)) append(key);
      else if (key === "Enter") evaluate();
      else if (key === "Backspace") delLast();
      else if (key === "Escape") clearAll();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display]);

  const toggleTheme = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    setDarkMode(!darkMode);
  };

  return (
    <div className={`calculator-wrap ${darkMode ? "dark" : ""} ${animating ? "theme-animating" : ""}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="calculator glass neon">
        <h2>React Calculator</h2>
        <input className="display" value={display} readOnly />
        <div className="row">
          <button onClick={clearAll} className="span-two danger">Clear</button>
          <button onClick={delLast} className="warning">DEL</button>
        </div>

        <div className="grid">
          {buttons.map((b) =>
            b === "=" ? (
              <button key={b} className="equals" onClick={evaluate}>
                {b}
              </button>
            ) : (
              <button key={b} onClick={() => append(b)}>
                {b}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

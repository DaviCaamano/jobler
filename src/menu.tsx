import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main style={{ padding: 12, minWidth: 260 }}>
      <h1>Jobler</h1>
      <button onClick={() => console.log("Popup clicked")}>
        Click me
      </button>
    </main>
  );
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

createRoot(container).render(<App />);
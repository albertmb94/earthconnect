import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found!");
} else {
  try {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error("React render error:", err);
    root.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h2>Render Error</h2>
      <pre>${err instanceof Error ? err.message : String(err)}</pre>
    </div>`;
  }
}

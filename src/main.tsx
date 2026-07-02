import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// apply saved theme before first paint
const savedTheme = localStorage.getItem("nizamos-theme");
if (savedTheme && savedTheme !== "green") {
  document.documentElement.dataset.theme = savedTheme;
}

// PWA: register service worker (production only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function setVHProperty() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVHProperty);
window.addEventListener('orientationchange', setVHProperty);
setVHProperty();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

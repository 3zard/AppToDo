import { createRoot } from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
document.body.innerHTML = '<div id="root"></div>';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

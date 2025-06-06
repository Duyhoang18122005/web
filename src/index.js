import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App"; // chính là file App định tuyến
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // hoặc tailwind.css nếu dùng Tailwind

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

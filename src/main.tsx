
import React from "react";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = "pk_test_cHJpbWUtbW9uaXRvci0yMi5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { Buffer } from 'buffer';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.global = window;
window.Buffer = Buffer;
global.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);

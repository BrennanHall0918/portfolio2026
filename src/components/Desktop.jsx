import { useState } from "react";

import Navbar from "./Navbar";
import Window from "./Window";
import WindowManager from "./WindowManager";
import DesktopIcons from "./DesktopIcons";

import "../styles/Desktop.css";

export default function Desktop() {
  const [windows, setWindows] = useState([
    {
      id: "home",
      title: "My Computer",
      open: true,
      position: { x: 200, y: 100 },
      size: { width: 550, height: 400 }
    }
  ]);

  function openWindow(id, title) {
    const existing = windows.find(window => window.id === id);

    if (existing) {
      return;
    }

    setWindows([
      ...windows,
      {
        id,
        title,
        ope: true,
        position: {
          x: 250,
          y: 120
        },
        size: {
          width: 550,
          height: 400
        }
      }
    ]);
  }

  function closeWindow(id) {
    setWindows(
      windows.filter(window => window.id !== id)
    );
  }

  function updateWindow(id, updates) {
    setWindows(
      windows.map(window =>
        window.id === id ? {...window, ...updates } : window
      )
    );
  }

  return (
    <section className="desktop">
      <DesktopIcons openWindow={openWindow} />

      <WindowManager
        windows={windows}
        closeWindow={closeWindow}
        updateWindow={updateWindow}
      />

      <Navbar />
    </section>
  );
}
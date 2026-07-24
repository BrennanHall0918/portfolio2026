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
      title: "Home",
      open: true,
      minimized: false,
      position: { x: 200, y: 100 },
      size: { width: 550, height: 400 },
      zIndex: 1
    }
  ]);

  const [selectedIcon, setSelectedIcon] = useState(null);

  function openWindow(id, title) {
    const existing = windows.find(window => window.id === id);

    if (existing) {
      bringToFront(id);
      return;
    }

    const highestZ = Math.max(...windows.map(w => w.zIndex), 0);

    setWindows([
      ...windows,
      {
        id,
        title,
        open: true,
        minimized: false,
        position: {
          x: 250,
          y: 120
        },
        size: {
          width: 550,
          height: 400
        },
        zIndex: highestZ + 1
      }
    ]);
  }

  function handleTaskButtonClick(id) {
    const target = windows.find(window => window.id === id);

    if (target.minimized) {
      updateWindow(id, { minimized: false });
    }
    bringToFront(id);
  }

  function bringToFront(id) {
    setWindows(prevWindows => {
      const highestZ = Math.max(...prevWindows.map(w => w.zIndex), 0);
      return prevWindows.map(window =>
        window.id === id ? { ...window, zIndex: highestZ + 1 } : window
      );
    });
  }

  function closeWindow(id) {
    setWindows(
      windows.filter(window => window.id !== id)
    );
  }

  function updateWindow(id, updates) {
    setWindows(prevWindows =>
      prevWindows.map(window =>
        window.id === id ? {...window, ...updates } : window
      )
    );
  }

  return (
    <section 
      className="desktop" 
      onClick={()=> setSelectedIcon(null)}>
      <DesktopIcons 
        openWindow={openWindow}
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        windows={windows} />

      <WindowManager
        windows={windows}
        closeWindow={closeWindow}
        updateWindow={updateWindow}
        bringToFront={bringToFront}
      />

      <Navbar windows={windows} onTaskButtonClick={handleTaskButtonClick} />
    </section>
  );
}
import { useState, createContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import WindowManager from "./WindowManager";
import DesktopIcons from "./DesktopIcons";

import "../styles/Desktop.css";

export const DesktopSyncContext = createContext(null);

const ID_TO_PATH = {
  home: "/",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
};

function pathForWindow(id) {
  if (ID_TO_PATH[id]) return ID_TO_PATH[id];
  if (id.startsWith("project-")) return `/projects/${id.replace("project-", "")}`;
  return "/";
}

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // The ONLY place windows get added or focused based on the URL.
  // Called by RouteWatcher whenever a route match mounts or its params change.
  function syncWindowFromRoute(id, title, detailId) {
    const windowId = detailId ? `project-${detailId}` : id;
    const windowTitle = detailId ? `Project #${detailId}` : title;

    setWindows(prevWindows => {
      const existing = prevWindows.find(w => w.id === windowId);
      const highestZ = Math.max(...prevWindows.map(w => w.zIndex), 0);

      if (existing) {
        return prevWindows.map(w =>
          w.id === windowId ? { ...w, zIndex: highestZ + 1, minimized: false } : w
        );
      }

      return [
        ...prevWindows,
        {
          id: windowId,
          title: windowTitle,
          minimized: false,
          position: { x: 200 + prevWindows.length * 30, y: 100 + prevWindows.length * 30 },
          size: { width: 550, height: 400 },
          zIndex: highestZ + 1,
        },
      ];
    });
  }

  // User clicks a desktop icon or Start Menu item — just change the URL,
  // syncWindowFromRoute (via RouteWatcher) handles actually opening it.
  function openWindow(id) {
    navigate(pathForWindow(id));
  }

  // User clicks an already-open window or its taskbar button.
  function bringToFront(id) {
    setWindows(prevWindows => {
      const highestZ = Math.max(...prevWindows.map(w => w.zIndex), 0);
      return prevWindows.map(w =>
        w.id === id ? { ...w, zIndex: highestZ + 1 } : w
      );
    });

    const targetPath = pathForWindow(id);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }

  function handleTaskButtonClick(id) {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, minimized: false } : w))
    );
    bringToFront(id);
  }

  function closeWindow(id) {
    const remaining = windows.filter(window => window.id !== id);

    if (remaining.length > 0) {
      const next = remaining.reduce ((a, b)=> (a.zIndex > b.zIndex ? a : b));
      navigate(pathForWindow(next.id));
    } else {
      navigate("/");
    }

    setWindows(remaining);
  }

  function updateWindow(id, updates) {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, ...updates } : w))
    );
  }

  return (
    <DesktopSyncContext.Provider value={{ syncWindowFromRoute }}>
      <section className="desktop" onClick={() => setSelectedIcon(null)}>
        <DesktopIcons
          openWindow={openWindow}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          windows={windows}
        />

        <WindowManager
          windows={windows}
          closeWindow={closeWindow}
          updateWindow={updateWindow}
          bringToFront={bringToFront}
        />

        <Navbar
          windows={windows}
          onTaskButtonClick={handleTaskButtonClick}
          openWindow={openWindow}
        />

        {/* Invisible — exists only so a matched <Route> mounts its RouteWatcher,
            which reports the URL back to us via context. Nothing here is ever seen. */}
        <div style={{ display: "none" }}>
          <Outlet />
        </div>
      </section>
    </DesktopSyncContext.Provider>
  );
}
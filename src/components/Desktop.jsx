import { useState, createContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import useIsMobile from "../hooks/useIsMobile";
import MobileWindow from "./MobileWindow";
import getWindowContent from "../utils/getWindowContent";

import Navbar from "./Navbar";
import WindowManager from "./WindowManager";
import DesktopIcons from "./DesktopIcons";

import "../styles/Desktop.css";

// Context so RouteWatcher (mounted invisibly via <Outlet />, far down the tree)
// can call back up into Desktop's syncWindowFromRoute without prop
// drilling through App.jsx
export const DesktopSyncContext = createContext(null);

// Maps a window's id to the real URL path that represents it.
// Backbone of the whole routing/window-sync system: every
// window that can be open always corresponds to exactly one path.
const ID_TO_PATH = {
  home: "/",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
};

// Titles for the four "static" windows, used when opening
// them directly (e.g. from a desktop icon) rather than via a route match
// that already carries a title.
const ID_TO_TITLE = {
  home: "Home",
  projects: "Projects",
  experience: "Experience",
  contact: "Contact",
};

// Revers of ID_TO_PATH: given a window id, return its URL path.
// Handles the dynamic "project-<id>" window ids (from project detail
// windows) as a special case, since those aren't in the static map above.
function pathForWindow(id) {
  if (ID_TO_PATH[id]) return ID_TO_PATH[id];
  if (id.startsWith("project-")) return `/projects/${id.replace("project-", "")}`;
  return "/";
}

export default function Desktop() {
  // The source of truth for every open window: id, title, whether
  // it's minimized, its drag position/resize size, and its z-index (which
  // window is on top). Starts empty - nothing is open until a route match
  // (including the initial page load) adds something via syncWindowFromRoute.
  const [windows, setWindows] = useState([]);

  // Tracks which desktop icon is currently click-selected (not double-clicked
  // to open - just highlighted, like Windows icon selection).
  const [selectedIcon, setSelectedIcon] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // The ONLY place windows get added to state or refocused as a DIRECT
  // result of the URL matching a route. Called by RouteWatcher whenever a
  // <Route> it's mounted under matches (including a first load and on
  // browser back/forward). This keeps window state and the URL as close 
  // to one single source as possible: the URL decides, this function reacts.
  function syncWindowFromRoute(id, title, detailId) {
    // Project detail routes get a unique window id per project
    // ("project-123") so multiple detail windows could theoretically be
    // tracked separately, even though only one is ever open at a time
    // via routing.
    const windowId = detailId ? `project-${detailId}` : id;
    const windowTitle = detailId ? `Project #${detailId}` : title;

    setWindows(prevWindows => {
      const existing = prevWindows.find(w => w.id === windowId);
      const highestZ = Math.max(...prevWindows.map(w => w.zIndex), 0);

      // Window's already open - just bring it to the front and un-minimize it
      // (covers broswer back/forward landing on an already-open window).
      if (existing) {
        return prevWindows.map(w =>
          w.id === windowId ? { ...w, zIndex: highestZ + 1, minimized: false } : w
        );
      }

      // Brand new window - add it with a default size, and offset its
      // position slightly based on how many windows are already open so
      // new windows don't all stack in exactly the same spot.
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

  // Called when the user clicks a destop icon or taskbar Start Menu item
  // to open one of the four static windows. Just hands off to
  // navigateOrSync, since "open a window" and "go to its URL" are the
  // same action in this app.
  function openWindow(id) {
    navigateOrSync(id, ID_TO_TITLE[id] ?? id);
  }

  // Raises an already-open window to the top (highest z-index) and, if
  // the URL doesn't already reflec that window, navigates to it so the
  // address bar stays accurate. Used when clicking an existing taskbar
  // button or a visible-but-unfocused window.
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

  // Taskbar button click: unminimize the window (in case it was hidden)
  // and focus it - mirrors clicking a minimized app's icon in Windows
  function handleTaskButtonClick(id) {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, minimized: false } : w))
    );
    bringToFront(id);
  }

  // Removes a window from state.
  function closeWindow(id) {
    const remaining = windows.filter(window => window.id !== id);
    setWindows(remaining);
  }

  // Generic patch function for any window's mutable properties - used by
  // Window.jsx for position/size changes (via drag/resize) and minimize.
  function updateWindow(id, updates) {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, ...updates } : w))
    );
  }

  // The key piece that makes "open a window that might already match the
  // current URL" work correctly. navigate() only actually does anything
  // when the URL is changing - react-router won't re-trigger a route
  // match (and therefore won't re-run RouteWatcher's effect) if you
  // navigate to the path you're already on. So: if we're already on the
  // target path, skip navigate() entirely and call syncWindowFromRoute
  // directly instead, to open/focues the window ourselves.
  function navigateOrSync(windowId, title) {
    const targetPath = pathForWindow(windowId);
    const isDetail = windowId.startsWith("project-");
    const detailId = isDetail ? windowId.replace("project-", "") : null;

    if (location.pathname === targetPath) {
      syncWindowFromRoute(isDetail ? "projects" : windowId, title, detailId);
    } else {
      navigate(targetPath);
    }
  }

  const isMobile = useIsMobile();

  // Mobile layout: instead of draggable/resizeable overlapping windows
  // (unusable on a touchscreen), show either the desktop icons (nothing
  // open) or a single full-screen, non-draggable window for whichever
  // open window has the highest z-index. All the same open/close/focus
  // logic above is reused unchanged - only how it is rendered is different.
  if (isMobile) {
    const topWindow = windows
      .filter(w => !w.minimized)
      .reduce((a, b) => (!a || b.zIndex > a.zIndex ? b : a), null);

    return (
      <DesktopSyncContext.Provider value={{ syncWindowFromRoute }}>
        <section className="desktop mobile-desktop">
          {!topWindow && (
            <DesktopIcons
              openWindow={openWindow}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
              windows={windows}
            />
          )}

          {topWindow && (
            <MobileWindow
              title={topWindow.title}
              onClose={() => closeWindow(topWindow.id)}
            >
              {getWindowContent(topWindow.id)}
            </MobileWindow>
          )}

          <Navbar
            windows={windows}
            onTaskButtonClick={handleTaskButtonClick}
            openWindow={openWindow}
          />

          {/* Hidden - exists purely so a matched <Route> mounts its
              RouteWatcher (which calls syncWindowFromRoute via context).
              Nothing in here is ever shown visually, on mobile or desktop. */}
          <div style={{ display: "none" }}>
            <Outlet />
          </div>
        </section>
      </DesktopSyncContext.Provider>
    );
  }

  // Desktop layout: the normal window experience with icons, all open windows
  // rendered simultaneously via WindowManager, taskbar, and the same hidden
  // route-watcher Outlet.
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
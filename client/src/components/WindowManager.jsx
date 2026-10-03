import Window from "./Window";

import getWindowContent from "../utils/getWindowContent";

// Renders every open window from the 'windows' array (owned by
// Desktop.jsx) as an actual <Window> component. This is the desktop-only
// rendering path - MobileWindow.jsx handles the simplified mobile
// eqivalent separately, in Desktop.jsx itself.
export default function WindowManager({ windows, closeWindow, updateWindow, bringToFront }) {
  // The single highest z-index among all open windows - used below to
  // determine which window is "active" (the one on top gets the blue
  // title bar gradient and drop shadow instead of the grey inactive look).
  const highestZ = Math.max(...windows.map(w => w.zIndex), 0);
  
  return (
    <>
      {windows.map(window => (
        <Window
          key={window.id}
          title={window.title}
          // Clicking anywhere on this window (via Window.jsx's onMouseDown)
          // should bring it to the front - passed down as onFocus.
          onFocus={() => bringToFront(window.id)}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
          minimized={window.minimized}
          // A window is "active" only if it currently holds the highest
          // z-index - i.e. it's the one actually on top and in focus
          isActive={window.zIndex === highestZ}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => updateWindow(window.id, { minimized: true })}
          // Called by Window.jsx (via react-rund) whenever the user finishes
          // dragging or resizing - persists the new position/size back up
          // into Desktop's windows array so it's remembered across renders
          // and route changes.
          onPositionChange={(position) => updateWindow(window.id, { position })}
          onSizeChange={(size) => updateWindow(window.id, { size })}
        >
          {/* The actual page content shown inside this window - looked up
              by window id (handles both the four static pages and dynamic
              "project-<id>" detail windows). */}
          {getWindowContent(window.id)}
        </Window>
      ))}
    </>
  );
}
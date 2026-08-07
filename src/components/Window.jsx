import { useState } from "react";
import { Rnd } from "react-rnd";
import "../styles/Window.css";

// The actual draggable/resizable whindow design - title bar, minimize/
// maximize/close buttons, and content area. Built on react-rnd, which
// controlls this element's position/size via inline styles, which is why
// the CSS animation work below is split across two elements (see the
// className comment further down).
export default function Window({ title, position, size, zIndex, minimized, isActive, onFocus, onPositionChange, onSizeChange, onClose, onMinimize, children }) {
  // Whether this window is currently maximized (filling the desktop).
  const [isMaximized, setIsMaximized] = useState(false);

  // Remembers this windows position/size from right before it was
  // maximized so clicking maximize again can restore it exactly -
  // otherwise the user's manual drag/resize work would be lost every
  // time they maximized.
  const [preMaximizeState, setPreMaximizeState] = useState(null);

  // Briefly true only during a maximimize/restore click - turns on a CSS
  // transition for position/size specifically for that action. Kept off
  // the rest of the time so normal dragging.resizing stays instant and
  // doesn't fight a lagging transition on every mouse-move update.
  const [isAnimatingSize, setIsAnimatingize] = useState(false);

  function handleMaximize() {
    setIsAnimatingize(true);
    setTimeout(()=> setIsAnimatingize(false), 200);

    if (isMaximized) {
      // Restore: put position/size back to what they were before maximizing.
      onPositionChange(preMaximizeState.position);
      onSizeChange(preMaximizeState.size);
      setIsMaximized(false);
    } else {
      // Maximize: remember current position/size first, then measure the
      // .desktop container's actual renderd pixel size (rather than
      // using CSS percentages) and fill it exactly. Using real pixels
      // here avoids a mismatch between what the browser resolves a "100%"
      // CSS value to and what react-rnd's own internal bounds tracking
      // expects, which previously caused the maximized window to render
      // offset from the true top-left corner.
      setPreMaximizeState({ position, size });
      const desktopEl = document.querySelector(".desktop");
      const rect = desktopEl.getBoundingClientRect();
      onPositionChange({ x: 0, y: 0 });
      onSizeChange({ width: rect.width, height: rect.height });
      setIsMaximized(true);
    }
  }

  return (
    <Rnd
      // react-rnd controls this element's position/size/transform via
      // inline styles. That's why the minimize 
      // fade (opacity, safe here) lives on this outer element, while the
      // minimize shrink (transform: scale) lives on the inner
      // .window-inner div below instead - putting both on this element
      // would have the transfrom silently overridden by react-rnd.
      className={`window ${isActive ? "active" : ""} ${minimized ? "minimized" : ""} ${isAnimatingSize ? "resizing-animated" : ""}`}
      position={position}
      size={size}
      style={{ zIndex }}
      // Clicking anywhere on the window brings it to front.
      onMouseDown={onFocus}
      onDragStop={(e, data) => onPositionChange({ x: data.x, y: data.y })}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        onSizeChange({ width: ref.style.width, height: ref.style.height });
        // newPosition is included because resizing fromt he top or left
        // edge shifts the window's x/y too (the opposite corner stays
        // anchored) - updating both together avoids the window visually
        // jumping when resized from those edges.
        onPositionChange(newPosition);
      }}
      // Keeps the window from being dragged/resized outside the .desktop
      // container - important since .desktop has overflow: hidden, so
      // without this a window could get dragged somewhere unreachable.
      bounds="parent"
      minWidth={300}
      minHeight={200}
      // Prevent dragging/resizing a maximized window - doing so would
      // desync it from the saved preMaximizeState, breaking restore.
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
    >
      <div className={`window-inner ${minimized ? "minimized" : ""}`}>
        <section className={`window-titlebar ${isActive ? "active" : "inactive"}`}>
          <span>{title}</span>
          <div className="window-buttons">
            {/* All three buttons are drawn with pure CSS rather than
            icon images or text-characters - see Window.css for the shapes. */}
            <button className="minimize-btn" onClick={onMinimize}></button>
            <button className="maximize-btn" onClick={handleMaximize}></button>
            <button className="close-btn" onClick={onClose}></button>
          </div>
        </section>
        <section className="window-content">
          {children}
        </section>
      </div>
    </Rnd>
  );
}
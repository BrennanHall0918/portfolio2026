import { useState } from "react";
import { Rnd } from "react-rnd";
import "../styles/Window.css";

export default function Window({ title, position, size, zIndex, minimized, isActive, onFocus, onPositionChange, onSizeChange, onClose, onMinimize, children }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState(null);
  const [isAnimatingSize, setIsAnimatingize] = useState(false);

  function handleMaximize() {
    setIsAnimatingize(true);
    setTimeout(()=> setIsAnimatingize(false), 200);

    if (isMaximized) {
      onPositionChange(preMaximizeState.position);
      onSizeChange(preMaximizeState.size);
      setIsMaximized(false);
    } else {
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
      className={`window ${isActive ? "active" : ""} ${minimized ? "minimized" : ""} ${isAnimatingSize ? "resizing-animated" : ""}`}
      position={position}
      size={size}
      style={{ zIndex }}
      onMouseDown={onFocus}
      onDragStop={(e, data) => onPositionChange({ x: data.x, y: data.y })}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        onSizeChange({ width: ref.style.width, height: ref.style.height });
        onPositionChange(newPosition);
      }}
      bounds="parent"
      minWidth={300}
      minHeight={200}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
    >
      <div className={`window-inner ${minimized ? "minimized" : ""}`}>
        <section className={`window-titlebar ${isActive ? "active" : "inactive"}`}>
          <span>{title}</span>
          <div className="window-buttons">
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
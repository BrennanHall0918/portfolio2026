import { useState } from "react";
import { Rnd } from "react-rnd";
import "../styles/Window.css";

export default function Window({ title, position, size, zIndex, minimized, onFocus, onPositionChange, onSizeChange, onClose, onMinimize, children }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState(null);

  function handleMaximize() {
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
      className="window"
      position={position}
      size={size}
      style={{ zIndex, display: minimized ? "none" : "block" }}
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
      <section className="window-titlebar">
        <span>{title}</span>
        <div className="window-buttons">
          <button onClick={onMinimize}>_</button>
          <button onClick={handleMaximize}>[]</button>
          <button onClick={onClose}>X</button>
        </div>
      </section>
      <section className="window-content">
        {children}
      </section>
    </Rnd>
  );
}
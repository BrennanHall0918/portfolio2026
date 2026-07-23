import { Rnd } from "react-rnd";
import "../styles/Window.css";

export default function Window({ position, size, onPositionChange, onSizeChange, children }) {
  return (
    <Rnd
      className="window"
      position={position}
      size={size}
      onDragStop={(e, data) => {
        onPositionChange({ x: data.x, y: data.y });
      }}
      onResizeStop={(e, direction, ref, delta, newPosition) => {
        onSizeChange({
          width: ref.style.width,
          height: ref.style.height,
        });
        onPositionChange(newPosition);
      }}
      bounds="parent"
      minWidth={300}
      minHeight={200}
    >
      <section className="window-titlebar">
        <span>Window</span>
      </section>

      <section className="window-content">
        {children}
      </section>
    </Rnd>
  );
}
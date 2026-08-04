import Window from "./Window";
import ProjectDetail from "../windows/ProjectDetail";

import Home from "../windows/Home";
import Projects from "../windows/Projects";
import Experience from "../windows/Experience";
import Contact from "../windows/Contact";

import getWindowContent from "../utils/getWindowContent";

export default function WindowManager({ windows, closeWindow, updateWindow, bringToFront }) {
  const highestZ = Math.max(...windows.map(w => w.zIndex), 0);
  
  return (
    <>
      {windows.map(window => (
        <Window
          key={window.id}
          title={window.title}
          onFocus={() => bringToFront(window.id)}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
          minimized={window.minimized}
          isActive={window.zIndex === highestZ}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => updateWindow(window.id, { minimized: true })}
          onPositionChange={(position) => updateWindow(window.id, { position })}
          onSizeChange={(size) => updateWindow(window.id, { size })}
        >
          {getWindowContent(window.id)}
        </Window>
      ))}
    </>
  );
}
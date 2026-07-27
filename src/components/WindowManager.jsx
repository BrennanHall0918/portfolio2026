import Window from "./Window";

import Home from "../windows/Home";
import Projects from "../windows/Projects";
import Experience from "../windows/Experience";
import Contact from "../windows/Contact";

const windowComponents = {
    home: Home,
    projects: Projects,
    experience: Experience,
    contact: Contact
};

function getComponentForWindow(id) {
  if (windowComponents[id]) return windowComponents[id];
  if (id.startsWith("project-")) {
    const projectId = id.replace("project-", "");
    return () => <p>Project #{projectId} — detail view coming soon</p>;
  }
  return () => null;
}

export default function WindowManager({
    windows,
    closeWindow,
    updateWindow,
    bringToFront
}) {
    const highestZ = Math.max(...windows.map(window => window.zIndex), 0);
    return (
        <>
            {windows.map(window => {
                const Component = getComponentForWindow(window.id);

                return (
                    <Window
                        key={window.id}
                        title={window.title}
                        onFocus={()=> bringToFront(window.id)}

                        position={window.position}
                        size={window.size}
                        zIndex={window.zIndex}

                        minimized={window.minimized}
                        isActive={window.zIndex === highestZ}
                        onClose={()=> closeWindow(window.id)}
                        onMinimize={()=> updateWindow(window.id, {minimized: true })}

                        onPositionChange={(position)=>
                            updateWindow(window.id, {position})
                        }

                        onSizeChange={(size)=>
                            updateWindow(window.id, {size})
                        }
                    >
                        <Component />
                    </Window>
                );
            })}
        </>
    );
}
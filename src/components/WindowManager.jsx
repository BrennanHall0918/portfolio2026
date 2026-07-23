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

export default function WindowManager({
    windows,
    closeWindow,
    updateWindow
}) {
    return (
        <>
            {windows.map(window => {

                const Component = windowComponents[window.id];

                return (
                    <Window
                        key={window.id}
                        title={window.title}

                        position={window.position}
                        size={window.size}

                        onClose={()=> closeWindow(window.id)}

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
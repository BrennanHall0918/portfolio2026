import { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";

import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import detailsIcon from "../assets/icons/details.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

// Direct id-to-icon lookup for the four static windows and the generic
// "details" icon.
const windowIcons = {
  home: homeIcon,
  projects: projectsIcon,
  details: detailsIcon,
  experience: experienceIcon,
  contact: contactIcon,
};

// Start Menu only ever lists the four static windows - never a dynamic
// project detail window, so no "project-" handling needed here.
const startMenuItems = [
  { id: "home", title: "Home" },
  { id: "projects", title: "Projects" },
  { id: "experience", title: "Experience" },
  { id: "contact", title: "Contact" },
];

// Taskbar buttons do need to handle dynamic "project-<id>" window ids
// Falls back to the generic details icon for those, since
// windowIcons has no entry for a specific project's id.
function getIconForWindow(id) {
  if (windowIcons[id]) return windowIcons[id];
  if (id.startsWith("project-")) return detailsIcon;
  return null;
}

// The taskbar: Start button + dropdown menu, one button per currently
// open window, and a live clock.
export default function Navbar({ windows, onTaskButtonClick, openWindow }) {
  // Used below to determine which open window's taskbar button should
  // show as "pressed in".
  const highestZ = Math.max(...windows.map(w => w.zIndex), 0);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Ref on the whole <nav>, not just the dropdown panel.
  // If the ref only wrapped the panel, clicking the Start
  // button itself while the menu is open would register as an "outside"
  // click and toggle the button's own open/close state in the same event,
  // causing a flicker. Wrapping the entire taskbar means clicking
  // anywhere inside it never counts as "outside".
  const startMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target)) {
        setIsStartMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selecting a Start Menu item both opens/focuses the window and closes
  // the menu.
  function handleStartMenuClick(id) {
    openWindow(id);
    setIsStartMenuOpen(false);
  }

  // Live clock, updated every 60 seconds.
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }

    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="taskbar" ref={startMenuRef}>
      <div className="start-wrapper">
        <button
          className={isStartMenuOpen ? "start-button active" : "start-button"}
          onClick={() => setIsStartMenuOpen(prev => !prev)}
        >
          Start
        </button>

        {isStartMenuOpen && (
          <div className="start-menu">
            {startMenuItems.map(item => (
              <button
                key={item.id}
                className="start-menu-item"
                onClick={() => handleStartMenuClick(item.id)}
              >
                <img src={windowIcons[item.id]} alt={item.title} />
                {item.title}
              </button>
            ))}
          </div>
        )}
      </div>

        {/* One button per currently open window, driven directly by
            Desktop's windows array - so this list always matches what's
            actually open, with no separate state to keep in sync. */}
      <section className="task-links">
        {windows.map(window => {
          // "Active" here means: currently the topmost window and
          // visible (not minimized)
          const isFocused = window.zIndex === highestZ && !window.minimized;
          return (
            <button
              key={window.id}
              className={isFocused ? "task-button active" : "task-button"}
              onClick={() => onTaskButtonClick(window.id)}
            >
              <img src={getIconForWindow(window.id)} alt={window.title} />
              {window.title}
            </button>
          );
        })}
      </section>

      <section className="clock">{time}</section>
    </nav>
  );
}
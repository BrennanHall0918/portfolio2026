import { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";

import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import detailsIcon from "../assets/icons/details.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

const windowIcons = {
  home: homeIcon,
  projects: projectsIcon,
  details: detailsIcon,
  experience: experienceIcon,
  contact: contactIcon,
};

const startMenuItems = [
  { id: "home", title: "Home" },
  { id: "projects", title: "Projects" },
  { id: "experience", title: "Experience" },
  { id: "contact", title: "Contact" },
];

function getIconForWindow(id) {
  if (windowIcons[id]) return windowIcons[id];
  if (id.startsWith("project-")) return detailsIcon;
  return null;
}

export default function Navbar({ windows, onTaskButtonClick, openWindow }) {
  const highestZ = Math.max(...windows.map(w => w.zIndex), 0);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
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

  function handleStartMenuClick(id) {
    openWindow(id);
    setIsStartMenuOpen(false);
  }

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

      <section className="task-links">
        {windows.map(window => {
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
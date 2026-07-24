import "../styles/Navbar.css";

import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

const windowIcons = {
  home: homeIcon,
  projects: projectsIcon,
  experience: experienceIcon,
  contact: contactIcon,
};

export default function Navbar({ windows, onTaskButtonClick }) {
  const highestZ = Math.max(...windows.map(w => w.zIndex), 0);

  return (
    <nav className="taskbar">
      <button className="start-button">Start</button>

      <section className="task-links">
        {windows.map(window => {
          const isFocused = window.zIndex === highestZ && !window.minimized;
          return (
            <button
              key={window.id}
              className={isFocused ? "task-button active" : "task-button"}
              onClick={() => onTaskButtonClick(window.id)}
            >
              <img src={windowIcons[window.id]} alt={window.title} />
              {window.title}
            </button>
          );
        })}
      </section>

      <section className="clock">3:05 PM</section>
    </nav>
  );
}
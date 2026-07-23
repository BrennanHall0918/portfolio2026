import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Window from "./Window";

import "../styles/Layout.css";

// Icons
import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

export default function Layout() {
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 550, height: 400 });

  return (
    <section className="desktop">

      <section className="desktop-icons">
        <Link to="/" className="desktop-icon">
          <img src={homeIcon} alt="My Computer" />
          <span>My Computer</span>
        </Link>
        <Link to="/projects" className="desktop-icon">
          <img src={projectsIcon} alt="Projects" />
          <span>Projects</span>
        </Link>
        <Link to="/experience" className="desktop-icon">
          <img src={experienceIcon} alt="Experience" />
          <span>Experience</span>
        </Link>
        <Link to="/contact" className="desktop-icon">
          <img src={contactIcon} alt="Contact" />
          <span>Contact</span>
        </Link>
      </section>

      <Window
        position={windowPosition}
        size={windowSize}
        onPositionChange={setWindowPosition}
        onSizeChange={setWindowSize}
      >
        <Outlet />
      </Window>

      <Navbar />

    </section>
  );
}
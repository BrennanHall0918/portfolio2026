import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

// Navbar Icons
import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

export default function Navbar() {
    return (
        <nav className="taskbar">
            
            <button className="start-button">
                Start
            </button>
            
            <section className="task-links">
                <NavLink 
                    to="/" 
                    end 
                    className={({ isActive }) => isActive ? "task-button active" : "task-button"}
                >
                    <img src={homeIcon} alt="Home" />
                    Home
                </NavLink>
                <NavLink 
                    to="/projects" 
                    className={({ isActive }) => isActive ? "task-button active" : "task-button"}
                >
                    <img src={projectsIcon} alt="Projects" />
                    Projects
                </NavLink>
                <NavLink 
                    to="/experience" 
                    className={({ isActive }) => isActive ? "task-button active" : "task-button"}
                >
                    <img src={experienceIcon} alt="Experience" />
                    Experience
                </NavLink>
                <NavLink 
                    to="/contact" 
                    className={({ isActive }) => isActive ? "task-button active" : "task-button"}
                >
                    <img src={contactIcon} alt="Contact" />
                    Contact
                </NavLink>
            </section>

            <section className="clock">
                3:05 PM
            </section>

        </nav>
    );
}
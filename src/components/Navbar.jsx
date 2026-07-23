import { Link } from "react-router-dom";
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

                <Link to ="/" className="task-button">
                    <img src={homeIcon} alt="Home" />
                    Home
                </Link>

                <Link to="/projects" className="task-button">
                    <img src={projectsIcon} alt="Projects" />
                    Projects
                </Link>

                <Link to="/experience" className="task-button">
                    <img src={experienceIcon} alt="Experience" />
                    Experience
                </Link>
                <Link to ="/contact" className="task-button">
                    <img src={contactIcon} alt="Contact" />
                    Contact
                </Link>

            </section>

            <section className="clock">
                3:05 PM
            </section>

        </nav>
    );
}
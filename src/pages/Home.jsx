// Styling
import "../styles/Home.css";

// Icons
import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

export default function Home() {
    return (
        <section className="desktop">

            <section className="desktop-icons">

                <div className="desktop-icon">
                    <img src={homeIcon} alt="My Computer" />
                    <span>My Computer</span>
                </div>

                <div className="desktop-icon">
                    <img src={projectsIcon} alt="Projects" />
                    <span>Projects</span>
                </div>

                <div className="desktop-icon">
                    <img src={experienceIcon} alt="Experience" />
                    <span>Experience</span>
                </div>

                <div className="desktop-icon">
                    <img src={contactIcon} alt="Contact" />
                    <span>Contact</span>
                </div>

            </section>

            <section className="window">
                
                <section className="window-titlebar">
                    <span>My Computer</span>

                    <div className="window-buttons">
                        <button>_</button>
                        <button>[]</button>
                        <button>X</button>
                    </div>
                </section>

                <section className="window-content">
                    <h1>Brennan Hall</h1>

                    <h2>Software Developer</h2>

                    <p>Welcome to my portfolio.</p>

                    <p>I am trying to build responsive web applications using modern frontend technologies.</p>

                    <button className="welcome-button">
                        View Projects
                    </button>
                </section>
            </section>

        </section>
    )
}
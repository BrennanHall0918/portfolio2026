import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

// Landing page content - brief intro, external profile links, and quick
// navigation buttons into the two most relevant other windows.
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-content">
      <div className="home-header">
        <h1>Brennan Hall</h1>
        <h2>Software Developer</h2>
      </div>

      <p>
        Entry-level software developer with hands-on experience designing and
        building web applications using JavaScript, SQL, HTML, CSS, and C.
        Comfortable working with relational databases, version control, and
        collaborative development workflows — with a strong foundation in
        problem-solving and a quick ability to pick up new technologies.
      </p>

      {/* External profile links - noopener/noreferrer from the same
          security/privacy reasons as the GitHub link in ProjectDetail.jsx. */}
      <div className="home-quicklinks">
        <a
          href="https://github.com/BrennanHall0918"
          target="_blank"
          rel="noopener noreferrer"
          className="home-link"
        >
          GitHub
        </a>
        
        <a
          href="https://linkedin.com/in/brennan-hall-969071369/"
          target="_blank"
          rel="noopener noreferrer"
          className="home-link"
        >
          LinkedIn
        </a>
      </div>

      {/* These call navigate() directly, so clicking them goes through
          the exact same routing/window-sync system as every other
          navigation in the app */}
      <div className="home-buttons">
        <button className="welcome-button" onClick={() => navigate("/projects")}>
          View Projects
        </button>
        <button className="welcome-button" onClick={() => navigate("/experience")}>
          View Experience
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import "../styles/Experience.css";

const experienceEntries = [
  {
    id: "freelance",
    role: "Freelance Software Developer",
    period: "2025 – Present",
    points: [
      "Developed web applications using JavaScript, HTML, CSS, Node.js, Express.js, and SQL databases.",
      "Designed and implemented database-driven applications using relational database concepts and structured queries.",
      "Used Git and GitHub for source control, project organization, and collaborative development workflows.",
      "Debugged application issues, improved functionality, and maintained clean, maintainable code.",
      "Created responsive user interfaces and integrated frontend components with backend services.",
    ],
  },
  {
    id: "musician",
    role: "Professional Musician",
    period: "2023 – 2024",
    points: [
      "Worked collaboratively in high-pressure environments requiring communication, adaptability, and problem-solving.",
      "Coordinated schedules, rehearsals, and performances while managing multiple priorities.",
      "Developed strong teamwork and organizational skills through professional collaboration.",
    ],
  },
  {
    id: "groundskeeper",
    role: "Groundskeeper – Lakeview Apartments",
    period: "2022",
    points: [
      "Performed maintenance, repairs, and property improvements while maintaining safety and quality standards.",
      "Managed independent tasks and prioritized responsibilities in a fast-paced environment.",
    ],
  },
];

const skillCategories = [
  {
    category: "Programming Languages",
    skills: ["JavaScript", "C", "SQL", "HTML", "CSS"],
  },
  {
    category: "Software Development",
    skills: ["Git", "GitHub", "VS Code", "Visual Studio", "Debugging", "Version Control", "Technical Documentation"],
  },
  {
    category: "Web Technologies",
    skills: ["Node.js", "Express.js", "Bootstrap", "Responsive Design", "REST APIs"],
  },
  {
    category: "Databases",
    skills: ["MySQL", "Relational Design", "SQL Queries"],
  },
  {
    category: "Development Practices",
    skills: ["OOP Concepts", "Agile Concepts", "Software Testing", "Collaborative Development"],
  },
];

const projectEntries = [
  {
    name: "Music Store Database Application",
    points: [
      "Designed a relational MySQL database containing artists, albums, tracks, genres, labels, and related entities.",
      "Created SQL queries using joins, aggregation, and relational database concepts.",
      "Applied database organization and normalization principles.",
    ],
  },
  {
    name: "Digital Timekeeper Web Application",
    points: [
      "Built an interactive JavaScript application featuring dynamic UI updates, user settings, and responsive design.",
      "Implemented frontend logic using DOM manipulation and browser-based APIs.",
    ],
  },
  {
    name: "Virtual Soundboard Application",
    points: [
      "Developed an interactive audio application using JavaScript and Web Audio API.",
      "Implemented user interaction handling, audio controls, and dynamic application behavior.",
    ],
  },
];

const educationEntries = [
  { school: "Mississippi Coding Academies", detail: "Software Development Certification" },
  { school: "Brookhaven High School", detail: "High School Diploma (Honors), 2022" },
];

const tabs = ["Experience", "Skills", "Projects", "Education"];

export default function Experience() {
  const [activeTab, setActiveTab] = useState("Experience");
  const [expandedId, setExpandedId] = useState(null);

  function toggleExpanded(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="experience-window">
      <div className="properties-tabs">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={activeTab === tab ? "properties-tab active" : "properties-tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="experience-content">
        {activeTab === "Experience" && (
          <div className="timeline">
            {experienceEntries.map((entry) => (
              <div key={entry.id} className="timeline-entry">
                <div className="timeline-marker"></div>
                <div className="timeline-body">
                  <button
                    className="timeline-header"
                    onClick={() => toggleExpanded(entry.id)}
                  >
                    <span className="timeline-role">{entry.role}</span>
                    <span className="timeline-period">{entry.period}</span>
                  </button>
                  {expandedId === entry.id && (
                    <ul className="timeline-points">
                      {entry.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Skills" && (
          <div className="skills-grid">
            {skillCategories.map((group) => (
              <div key={group.category} className="skill-category">
                <h3>{group.category}</h3>
                <div className="skill-chips">
                  {group.skills.map((skill) => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Projects" && (
          <div className="timeline">
            {projectEntries.map((project) => (
              <div key={project.name} className="timeline-entry">
                <div className="timeline-marker"></div>
                <div className="timeline-body">
                  <button
                    className="timeline-header"
                    onClick={() => toggleExpanded(project.name)}
                  >
                    <span className="timeline-role">{project.name}</span>
                  </button>
                  {expandedId === project.name && (
                    <ul className="timeline-points">
                      {project.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Education" && (
          <div className="education-list">
            {educationEntries.map((edu) => (
              <div key={edu.school} className="education-entry">
                <span className="education-school">{edu.school}</span>
                <span className="education-detail">{edu.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import "../styles/Projects.css";
import folderIcon from "../assets/icons/folder.png";

// Placeholder data
const placeholderProjects = [
  { id: 1, name: "portfolio2026" },
  { id: 2, name: "weather-app" },
  { id: 3, name: "task-tracker" },
  { id: 4, name: "chat-client" },
];

export default function Projects() {
  return (
    <div className="explorer">
      <div className="explorer-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Favorites</span>
        <span>Help</span>
      </div>

      <div className="explorer-toolbar">
        <button className="toolbar-btn" disabled>◀ Back</button>
        <button className="toolbar-btn" disabled>Forward ▶</button>
        <button className="toolbar-btn" disabled>▲ Up</button>
      </div>

      <div className="explorer-addressbar">
        <span>Address</span>
        <div className="address-input">C:\My Computer\Projects</div>
      </div>

      <div className="explorer-content">
        {placeholderProjects.map((project) => (
          <div key={project.id} className="explorer-item">
            <img src={folderIcon} alt="" />
            <span>{project.name}</span>
          </div>
        ))}
      </div>

      <div className="explorer-statusbar">
        <span>{placeholderProjects.length} object(s)</span>
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import "../styles/Projects.css";
import folderIcon from "../assets/icons/folder.png";

export default function Projects() {
  const navigate = useNavigate();
  const { data: repos, isLoading, error } = useFetch(
    "https://api.github.com/users/BrennanHall0918/repos"
  );

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
        {isLoading && (
          <div className="explorer-status-message">
            <div className="loading-bar">
              <div className="loading-bar-fill"></div>
            </div>
            <span>Reading folder contents...</span>
          </div>
        )}

        {error && (
          <div className="explorer-error-dialog">
            <div className="explorer-error-titlebar">
              <span>Error</span>
            </div>
            <div className="explorer-error-body">
              <p>Could not read from C:\My Computer\Projects</p>
              <p className="error-detail">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && repos && repos.map((repo) => (
          <div
            key={repo.id}
            className="explorer-item"
            onDoubleClick={() => navigate(`/projects/${repo.id}`)}
          >
            <img src={folderIcon} alt="" />
            <span>{repo.name}</span>
          </div>
        ))}
      </div>

      <div className="explorer-statusbar">
        <span>
          {isLoading ? "Loading..." : error ? "Error" : `${repos?.length ?? 0} object(s)`}
        </span>
      </div>
    </div>
  );
}
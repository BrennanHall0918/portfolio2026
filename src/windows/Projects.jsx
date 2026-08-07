import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import "../styles/Projects.css";
import folderIcon from "../assets/icons/folder.png";

// Styled as a Windows 98 Explorer/file browser window. Fetches my
// public GitHub repo and displays each as a folder icon in
// the content grid - double-clicking navigates to a details page.
export default function Projects() {
  const navigate = useNavigate();

  // Live data fetch via the reusable useFetch hook
  const { data: repos, isLoading, error } = useFetch(
    "https://api.github.com/users/BrennanHall0918/repos"
  );

  return (
    <div className="explorer">
      {/* Decorative explorer bar menu. May add functionality later. */}
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

      {/* Also decorative and disabled on purpose */}
      <div className="explorer-addressbar">
        <span>Address</span>
        <div className="address-input">C:\My Computer\Projects</div>
      </div>

      <div className="explorer-content">
        {/* Loading state: fake indeterminate progress bar using CSS animation */}
        {isLoading && (
          <div className="explorer-status-message">
            <div className="loading-bar">
              <div className="loading-bar-fill"></div>
            </div>
            <span>Reading folder contents...</span>
          </div>
        )}

        {/* Error state: styled as a fake error dialog rather than a raw error message */}
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

        {/* Success state: one "folder" per repo. Double click naviages. */}
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
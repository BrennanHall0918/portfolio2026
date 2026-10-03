import useFetch from "../hooks/useFetch";
import "../styles/ProjectDetail.css";
import folderIcon from "../assets/icons/folder.png";

// The /projects/:id detail view - rendered in its own window.

// projectId comes from getWindowContent.jsx, which extracted it from the
// window's id ("project-<id>") - which itself traces back to useParams()
// reading the real :id from the URL via RouteWatcher.
export default function ProjectDetail({ projectId }) {
  // Independent fetch of a single repo by numberic id - a different GitHub
  // endpoint than Projects.jsx's repo list. This keeps the two windows
  // fully decoupled: this component doesn't depend on Projects.jsx having
  // already loading anything, so a deep-linking straight to a projects URL
  // works correctly on its onw.
  const { data: repo, isLoading, error } = useFetch(
    `https://api.github.com/repositories/${projectId}`
  );

  if (isLoading) {
    return (
      <div className="properties-loading">
        <div className="loading-bar">
          <div className="loading-bar-fill"></div>
        </div>
        <span>Loading properties...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="explorer-error-dialog">
        <div className="explorer-error-titlebar"><span>Error</span></div>
        <div className="explorer-error-body">
          <p>Could not load project properties.</p>
          <p className="error-detail">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-dialog">
      <div className="properties-header">
        <img src={folderIcon} alt="" />
        <h2>{repo.name}</h2>
      </div>

      {/* Only one tab exists right now ("General") */}
      <div className="properties-tabs">
        <span className="properties-tab active">General</span>
      </div>

      <div className="properties-fields">
        <div className="properties-row">
          <span className="field-label">Type:</span>
          <span>{repo.language || "Unknown"} repository</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Description:</span>
          <span>{repo.description || "No description provided."}</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Stars:</span>
          <span>{repo.stargazers_count}</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Created:</span>
          <span>{new Date(repo.created_at).toLocaleDateString()}</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Last updated:</span>
          <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* noopener: stops the new tab from getting a JS reference back to
          this window. noreferrer: additionally strips the referrer header. */}
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="properties-link-button"
      >
        View on GitHub
      </a>
    </div>
  );
}
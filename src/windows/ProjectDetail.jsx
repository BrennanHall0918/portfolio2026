import useFetch from "../hooks/useFetch";
import "../styles/ProjectDetail.css";
import folderIcon from "../assets/icons/folder.png";

export default function ProjectDetail({ projectId }) {
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
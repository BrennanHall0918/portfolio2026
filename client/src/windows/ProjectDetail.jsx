import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import { DesktopSyncContext } from "../components/Desktop";
import "../styles/ProjectDetail.css";
import folderIcon from "../assets/icons/folder.png";

export default function ProjectDetail({ projectId }) {
  const { user, authedRequest } = useAuth();
  const navigate = useNavigate();
  const { closeWindowById } = useContext(DesktopSyncContext);

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchProject() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiRequest(`/api/projects/${projectId}`);
        if (!isCancelled) {
          setProject(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProject();
    return () => { isCancelled = true; };
  }, [projectId]);

  async function handleLike() {
    try {
      const updated = await authedRequest(`/api/projects/${projectId}/like`, {
        method: "POST",
      });
      setProject(updated);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) {
      return;
    }
    try {
      await authedRequest(`/api/projects/${projectId}`, { method: "DELETE" });

      window.dispatchEvent(new Event("projects:changed"));

      closeWindowById(`project-${projectId}`);
      closeWindowById(`edit-project-${projectId}`);

      navigate("/projects");
    } catch (err) {
      alert(err.message);
    }
  }

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
        <h2>{project.title}</h2>
      </div>

      <div className="properties-tabs">
        <span className="properties-tab active">General</span>
      </div>

      <div className="properties-fields">
        <div className="properties-row">
          <span className="field-label">Category:</span>
          <span>{project.category}</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Description:</span>
          <span>{project.description}</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Tech Stack:</span>
          <span>{project.techStack?.join(", ") || "Not specified"}</span>
        </div>

        <div className="properties-row">
          <span className="field-label">Likes:</span>
          <span>{project.likes}</span>
        </div>
      </div>

      <div className="properties-actions">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="properties-link-button"
          >
            View on GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="properties-link-button"
          >
            View Live
          </a>
        )}
        {user && (
          <button className="properties-link-button" onClick={handleLike}>
            ♥ Like ({project.likes})
          </button>
        )}
        {user?.role === "admin" && (
          <Link to={`/projects/${projectId}/edit`} className="properties-link-button">
            Edit
          </Link>
        )}
        {user?.role === "admin" && (
          <button className="properties-link-button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
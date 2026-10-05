import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import "../styles/Projects.css";
import folderIcon from "../assets/icons/folder.png";

export default function Projects() {
  const navigate = useNavigate();
  const { user, authedRequest } = useAuth();

  const [projects, setProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const data = await apiRequest(`/api/projects${query}`);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    let isCancelled = false;

    async function run() {
      if (!isCancelled) {
        await fetchProjects();
      }
    }
    run();

    return () => { isCancelled = true; };
  }, [fetchProjects]);

  useEffect(() => {
    function handleProjectsChanged() {
      fetchProjects();
    }
    window.addEventListener("projects:changed", handleProjectsChanged);
    return () => window.removeEventListener("projects:changed", handleProjectsChanged);
  }, [fetchProjects]);

  async function handleLike(e, projectId) {
    e.stopPropagation();
    try {
      const updated = await authedRequest(`/api/projects/${projectId}/like`, {
        method: "POST",
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
    } catch (err) {
      alert(err.message);
    }
  }

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

      <div className="explorer-searchbar">
        <label htmlFor="project-search" className="visually-hidden">
          Search projects
        </label>
        <input
          id="project-search"
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {user?.role === "admin" && (
        <div className="explorer-admin-bar">
          <a href="/projects/new" className="toolbar-btn" onClick={(e) => { e.preventDefault(); navigate("/projects/new"); }}>
            + Add Project
          </a>
        </div>
      )}

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
            <div className="explorer-error-titlebar"><span>Error</span></div>
            <div className="explorer-error-body">
              <p>Could not read from C:\My Computer\Projects</p>
              <p className="error-detail">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && projects && projects.length === 0 && (
          <div className="explorer-status-message">
            <span>No projects found.</span>
          </div>
        )}

        {!isLoading && !error && projects && projects.length > 0 && projects.map((project) => (
          <div
            key={project.id}
            className="explorer-item"
            role="button"
            tabIndex={0}
            onDoubleClick={() => navigate(`/projects/${project.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/projects/${project.id}`);
              }
            }}
          >
            <img src={folderIcon} alt="" />
            <span>{project.title}</span>
            <div className="explorer-item-likes">
              {user ? (
                <button
                  className="like-button"
                  onClick={(e) => handleLike(e, project.id)}
                  aria-label={`Like ${project.title}`}
                >
                  ♥ {project.likes}
                </button>
              ) : (
                <span className="like-count">♥ {project.likes}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="explorer-statusbar">
        <span>
          {isLoading ? "Loading..." : error ? "Error" : `${projects?.length ?? 0} object(s)`}
        </span>
      </div>
    </div>
  );
}
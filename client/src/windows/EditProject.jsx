import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import "../styles/CreateProject.css";

const categories = ["web", "design", "mobile", "tool", "game"];

export default function EditProject({ projectId }) {
  const { user, authedRequest } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchProject() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await apiRequest(`/api/projects/${projectId}`);
        if (!isCancelled) {
          setFormValues({
            title: data.title,
            description: data.description,
            category: data.category,
            techStack: (data.techStack || []).join(", "),
            repoUrl: data.repoUrl || "",
            liveUrl: data.liveUrl || "",
            imageUrl: data.imageUrl || "",
            featured: data.featured || false,
          });
        }
      } catch (err) {
        if (!isCancelled) {
          setLoadError(err.message);
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const body = {
        ...formValues,
        techStack: formValues.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await authedRequest(`/api/projects/${projectId}`, {
        method: "PATCH",
        body,
      });

      window.dispatchEvent(new Event("projects:changed"));

      navigate(`/projects/${projectId}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="create-project-window">
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="properties-loading">
        <div className="loading-bar">
          <div className="loading-bar-fill"></div>
        </div>
        <span>Loading project...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="explorer-error-dialog">
        <div className="explorer-error-titlebar"><span>Error</span></div>
        <div className="explorer-error-body">
          <p>Could not load this project.</p>
          <p className="error-detail">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-window">
      <h2>Edit Project</h2>

      <form className="create-project-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="edit-title">Title:</label>
          <input
            id="edit-title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-description">Description:</label>
          <textarea
            id="edit-description"
            name="description"
            rows={4}
            value={formValues.description}
            onChange={handleChange}
            required
            maxLength={1000}
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-category">Category:</label>
          <select id="edit-category" name="category" value={formValues.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="edit-techStack">Tech Stack (comma-separated):</label>
          <input
            id="edit-techStack"
            name="techStack"
            type="text"
            value={formValues.techStack}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-repoUrl">Repo URL:</label>
          <input id="edit-repoUrl" name="repoUrl" type="text" value={formValues.repoUrl} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="edit-liveUrl">Live URL:</label>
          <input id="edit-liveUrl" name="liveUrl" type="text" value={formValues.liveUrl} onChange={handleChange} />
        </div>

        <div className="form-field-checkbox">
          <label htmlFor="edit-featured">
            <input
              id="edit-featured"
              name="featured"
              type="checkbox"
              checked={formValues.featured}
              onChange={handleChange}
            />
            Featured
          </label>
        </div>

        {submitError && <p className="field-error" aria-live="polite">{submitError}</p>}

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
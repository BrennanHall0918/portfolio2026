import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/CreateProject.css";

const categories = ["web", "design", "mobile", "tool", "game"];

export default function CreateProject() {
  const { user, authedRequest } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "web",
    techStack: "",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const body = {
        ...formValues,
        techStack: formValues.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const created = await authedRequest("/api/projects", {
        method: "POST",
        body,
      });

      window.dispatchEvent(new Event("projects:changed"));

      navigate(`/projects/${created.id}`);
    } catch (err) {
      setError(err.message);
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

  return (
    <div className="create-project-window">
      <h2>Add New Project</h2>

      <form className="create-project-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formValues.description}
            onChange={handleChange}
            required
            maxLength={1000}
          />
        </div>

        <div className="form-field">
          <label htmlFor="category">Category:</label>
          <select id="category" name="category" value={formValues.category} onChange={handleChange}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="techStack">Tech Stack (comma-separated):</label>
          <input
            id="techStack"
            name="techStack"
            type="text"
            value={formValues.techStack}
            onChange={handleChange}
            placeholder="React, Express, MongoDB"
          />
        </div>

        <div className="form-field">
          <label htmlFor="repoUrl">Repo URL:</label>
          <input id="repoUrl" name="repoUrl" type="text" value={formValues.repoUrl} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="liveUrl">Live URL:</label>
          <input id="liveUrl" name="liveUrl" type="text" value={formValues.liveUrl} onChange={handleChange} />
        </div>

        <div className="form-field-checkbox">
          <label htmlFor="featured">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={formValues.featured}
              onChange={handleChange}
            />
            Featured
          </label>
        </div>

        {error && <p className="field-error" aria-live="polite">{error}</p>}

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
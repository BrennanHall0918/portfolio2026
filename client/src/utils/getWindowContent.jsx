import Home from "../windows/Home";
import Projects from "../windows/Projects";
import Experience from "../windows/Experience";
import Contact from "../windows/Contact";
import ProjectDetail from "../windows/ProjectDetail";
import Login from "../windows/Login";
import CreateProject from "../windows/CreateProject";
import EditProject from "../windows/EditProject";

const windowComponents = {
  home: Home,
  projects: Projects,
  experience: Experience,
  contact: Contact,
  login: Login,
  "create-project": CreateProject,
};

export default function getWindowContent(id) {
  if (windowComponents[id]) {
    const Component = windowComponents[id];
    return <Component />;
  }

  if (id.startsWith("edit-project-")) {
    const projectId = id.replace("edit-project-", "");
    return <EditProject projectId={projectId} />;
  }

  if (id.startsWith("project-")) {
    const projectId = id.replace("project-", "");
    return <ProjectDetail projectId={projectId} />;
  }

  return null;
}
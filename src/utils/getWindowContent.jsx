import Home from "../windows/Home";
import Projects from "../windows/Projects";
import Experience from "../windows/Experience";
import Contact from "../windows/Contact";
import ProjectDetail from "../windows/ProjectDetail";

const windowComponents = {
  home: Home,
  projects: Projects,
  experience: Experience,
  contact: Contact,
};

export default function getWindowContent(id) {
  if (windowComponents[id]) {
    const Component = windowComponents[id];
    return <Component />;
  }
  if (id.startsWith("project-")) {
    const projectId = id.replace("project-", "");
    return <ProjectDetail projectId={projectId} />;
  }
  return null;
}
import Home from "../windows/Home";
import Projects from "../windows/Projects";
import Experience from "../windows/Experience";
import Contact from "../windows/Contact";
import ProjectDetail from "../windows/ProjectDetail";

// Static id-to-component map for the four fixed windows (desktop icons,
// taskbar, and Start Menu all reference these same four ids). Project
// detail windows are not in this map - they're handled dynamically below,
// since there's one possible component per project id, not per a fixed set.
const windowComponents = {
  home: Home,
  projects: Projects,
  experience: Experience,
  contact: Contact,
};

// Single source for "given a window id, what should render 
// inside it?" - used by both WindowManager (desktop) and Desktop.jsx's
// mobile branch, so the two rendering patchs can never disagree about
// what a given window id actually shows. 
export default function getWindowContent(id) {
  // One of the four static pages - look it up directly.
  if (windowComponents[id]) {
    const Component = windowComponents[id];
    return <Component />;
  }

  // A project detail window - these have generated ids like
  // "project-123456" (see Desktop.jsx's syncWindowFromRoute), so extract
  // the read GitHub repo id back out of the window id and pass it down
  // as a prop for ProjectDetail to fetch with.
  if (id.startsWith("project-")) {
    const projectId = id.replace("project-", "");
    return <ProjectDetail projectId={projectId} />;
  }

  // Unrecognized window id - render nothing rather than crash. Shouldn't
  // normally happen given how window ids are created somewhere else.
  return null;
}
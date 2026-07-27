import { Routes, Route } from "react-router-dom";
import Desktop from "./components/Desktop";
import RouteWatcher from "./components/RouteWatcher";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Desktop />}>
        <Route index element={<RouteWatcher windowId="home" title="Home" />} />
        <Route path="projects" element={<RouteWatcher windowId="projects" title="Projects" />} />
        <Route path="projects/:id" element={<RouteWatcher windowId="projects" title="Projects" isDetail />} />
        <Route path="experience" element={<RouteWatcher windowId="experience" title="Experience" />} />
        <Route path="contact" element={<RouteWatcher windowId="contact" title="Contact" />} />
      </Route>
    </Routes>
  );
}

export default App;
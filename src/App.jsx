import { Routes, Route } from "react-router-dom";
import Layout from "./components/Desktop";

// Routes
import Home from "./windows/Home";
import Projects from "./windows/Projects";
import Experience from "./windows/Experience";
import Contact from "./windows/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="experience" element={<Experience />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
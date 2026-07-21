import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Routes
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/Contact" element={<Contact />} />
            </Routes>
        </>
    );
}

export default App;
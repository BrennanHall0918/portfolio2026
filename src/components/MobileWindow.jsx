import "../styles/MobileWindow.css";

// Simplified mobile equivalent of Window.jsx - no dragging, no resizing,
// no minimize/maximize. Rendered by Desktop.jsx's mobile branch instead
// of the full react-rnd based Window.jsx, since free-form window
// manipulation doesn't translate well to touch. Fills the screen (minus
// the taskbar) with a single "Back" button in place of the desktop
// window's three title bar buttons.

// onClose here maps to Desktop.jsx's closeWindow - on mobile, "Back"
// fully closes the window rather than minimizing it, since only one
// window is ever visible at a time in this layout, so there's no
// taskbar-restore concept to preserve by minimizing instead.
export default function MobileWindow({ title, onClose, children }) {
    return (
        <section className="mobile-window">
            <div className="mobile-window-titlebar">
                <button className="mobile-back-btn" onClick={onClose}>Back</button>
                <span>{title}</span>
            </div>

            <div className="mobile-window-content">
                {children}
            </div>
        </section>
    );
}
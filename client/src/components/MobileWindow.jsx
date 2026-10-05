import "../styles/MobileWindow.css";

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
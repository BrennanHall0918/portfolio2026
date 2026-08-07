import "../styles/DesktopIcons.css";

// Icons
import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

// Static list of desktop shortcuts - same four ids used everywhere else
// in the app, just with their own display titles/icons for this specific context.
const desktopIcons = [
    {
        id: "home",
        title: "My Computer",
        icon: homeIcon
    },
    {
        id: "projects",
        title: "Projects",
        icon: projectsIcon
    },
    {
        id: "experience",
        title: "Experience",
        icon: experienceIcon
    },
    {
        id: "contact",
        title: "Contact",
        icon: contactIcon
    }
];

// Renders the clickable desktop icon shortcuts. Single click just
// highlights/selects an icon; double click opens its window via
// openWindow (which routes through Desktop.jsx's navigate()/syncWindowFromRoute
// logic).
export default function DesktopIcons({ openWindow, selectedIcon, setSelectedIcon, windows }) {
  return (
    <section className="desktop-icons">
      {desktopIcons.map((icon) => {
        // Whether this icon's window currently exists in the open
        // windows array -  drives the sunken viual highlight.
        const isOpen = windows.some(w => w.id === icon.id);

        return (
          <div 
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? "selected" : ""} ${isOpen ? "open" : ""}`}
            onClick={(e) => {
              // Stops this click from going up to Desktop.jsx;s
              // section onClick, which clears selectedIcon on any click
              // to the empty desktop. Without this, clicking an icon
              // would select it and immediately deselect it in the same
              // event.
              e.stopPropagation();
              setSelectedIcon(icon.id);
            }}
            onDoubleClick={() => openWindow(icon.id)}
          >
            <img src={icon.icon} alt={icon.title} />
            <span>{icon.title}</span>
          </div>
        );
      })}
    </section>
  );
}
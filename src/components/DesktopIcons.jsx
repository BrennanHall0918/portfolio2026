import "../styles/DesktopIcons.css";

// Icons
import homeIcon from "../assets/icons/home.png";
import projectsIcon from "../assets/icons/projects.png";
import experienceIcon from "../assets/icons/experience.png";
import contactIcon from "../assets/icons/contact.png";

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

export default function DesktopIcons({ openWindow, selectedIcon, setSelectedIcon, windows }) {
  return (
    <section className="desktop-icons">
      {desktopIcons.map((icon) => {
        const isOpen = windows.some(w => w.id === icon.id);

        return (
          <div 
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? "selected" : ""} ${isOpen ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIcon(icon.id);
            }}
            onDoubleClick={() => openWindow(icon.id, icon.title)}
          >
            <img src={icon.icon} alt={icon.title} />
            <span>{icon.title}</span>
          </div>
        );
      })}
    </section>
  );
}
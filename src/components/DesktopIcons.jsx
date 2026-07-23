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

export default function DesktopIcons({ openWindow }) {
    return (
        <section className="desktop-icons">
            {desktopIcons.map((icon)=> (
                <div 
                    key={icon.id}
                    className="desktop-icon"
                    onDoubleClick={()=> openWindow(icon.id, icon.title)}>
                        <img src={icon.icon} alt={icon.title} />
                        <span>{icon.title}</span>
                </div>
            ))}
        </section>
    );
}
import { useState, useEffect } from "react";

// Below this viewport width, Desktop.jsx switches from the full
// draggable/resizable multi-window experience to a simplified full-screnn
// mobile layout (see Desktop.jsx and MobileWindow.jsx).
const MOBILE_BREAKPOINT = 700;

// Small reusable hook that tracks whether the current viewport counts as
// "mobile" - initializes from the actual window width on first render,
// then stays in sync as the window is resized (covers rotating a device,
// or a desktop browser begin resized).
export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState (
        window.innerWidth <= MOBILE_BREAKPOINT
    );

    useEffect(()=> {
        function handleResize() {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
}
import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { DesktopSyncContext } from "./Desktop";

// Invisible bridge between React Router's real route-matching and the
// window system in Desktop.jsx. Each <Route> in App.jsx renders one of
// these instead of an actual visible page component - its only job is
// to notice "my route just matched" and report that up to Destop.

// windowId: the static window id this route represents ("home",
//           "projects", "experience", "contact") - ignored in favor or
//           a generated "projected-<id>" id when isDeatail is true.
// title:    display title to use if this is a new window.
// isDetail: true only for the "/projects/:id" route - tells this
//           component to read the :id param and pass it along.
export default function RouteWatcher({ windowId, title, isDetail }) {
  // Only works because this component is rendered through a matched
  // <Route> (via Desktop's hidden <Outlet />) - useParams() has no route
  // context to read from otherwise. This is the actual mechanism that
  // satisfies the assignment's "useParams() from the URL" requirement.
  const params = useParams();
  const { syncWindowFromRoute } = useContext(DesktopSyncContext);

  // Runs whenever this route match "changes" - first mount (including
  // page load/refresh), or the :id param changing (e.g. navidating from
  // one project detail to another). Reports the match up to Desktop,
  // which decides whether to open a new window or just refocus an
  // existing one.
  useEffect(() => {
    syncWindowFromRoute(windowId, title, isDetail ? params.id : null);
  }, [windowId, title, isDetail, params.id]);

  // Renders nothing - this component exists purely for its useEffect's
  // side effect (reporting the route match), not to display anything.
  // It lives inside Desktop's 'display: none' wrapper, so even if it
  // did render something, it would never be visible.
  return null;
}
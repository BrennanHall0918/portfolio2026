import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { DesktopSyncContext } from "./Desktop";

export default function RouteWatcher({ windowId, title, isDetail }) {
  const params = useParams();
  const { syncWindowFromRoute } = useContext(DesktopSyncContext);

  useEffect(() => {
    syncWindowFromRoute(windowId, title, isDetail ? params.id : null);
  }, [windowId, title, isDetail, params.id]);

  return null;
}
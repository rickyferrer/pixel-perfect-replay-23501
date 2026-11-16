import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { assetOrigin } from "@/data/asset-urls";

// When the guide is pasted into another site (for example a WordPress article), that page's
// address is not a guide route, so the router keeps its own in-memory address at "/".
function embeddedHistory() {
  if (typeof window === "undefined") return undefined;
  const { hostname, origin } = window.location;
  const ownHost = origin === assetOrigin || hostname === "localhost" || hostname.endsWith(".lovable.app");
  return ownHost ? undefined : createMemoryHistory({ initialEntries: ["/"] });
}

export const getRouter = () => {
  // One client per request: a module-level QueryClient leaks cached data between SSR requests.
  const queryClient = new QueryClient();

  const history = embeddedHistory();
  const router = createRouter({
    routeTree,
    ...(history ? { history } : {}),
    context: { queryClient },
    scrollRestoration: true,
    // Lets Query own freshness; set caching defaults on the QueryClient, not the router.
    defaultPreloadStaleTime: 0,
  });

  return router;
};

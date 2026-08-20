import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultStaleTime: 1000 * 60 * 10, // 10 minutes client-side staleTime
    defaultGcTime: 1000 * 60 * 60, // 1 hour garbage collection
  });
}

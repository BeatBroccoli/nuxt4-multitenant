import type { RouterOptions } from "@nuxt/schema";
import type { RouteRecordRaw } from "vue-router";

const tenantDynamicRoute = "tenant";

const rewritePrefixRoute = (route: RouteRecordRaw) => {
  if (route.path.startsWith(`/:${tenantDynamicRoute}()`)) {
    return {
      ...route,
      path: route.path.replace(`/:${tenantDynamicRoute}()`, ""),
    };
  }

  return route;
};

const filterForTenantRoutes = (route: RouteRecordRaw, inverse = false) => {
  return inverse
    ? !route.path.startsWith(`/:${tenantDynamicRoute}()`)
    : route.path.startsWith(`/:${tenantDynamicRoute}()`);
};

export default <RouterOptions>{
  routes: async routes => {
    if (process.env.NODE_ENV === "development") {
      return routes;
    }

    let tenant;
    if (import.meta.server) {
      const event = useRequestEvent();
      tenant = event?.context?.tenant;
    } else {
      tenant = useNuxtApp().payload.tenant;
    }

    let newRoutes;
    if (!tenant) {
      // no custom domain / tenant at all
      newRoutes = routes.filter(route => filterForTenantRoutes(route, true));
    } else {
      newRoutes = routes
        .filter(route => filterForTenantRoutes(route, false))
        .map(rewritePrefixRoute);
    }
    return newRoutes;

  },
};
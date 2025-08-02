import type { RouterOptions } from "@nuxt/schema";
import type { RouteRecordRaw } from "vue-router";
import { getTenant } from "../utils/tenant";

const tenantDynamicRoute = "tenant";
const routeFilterCache = new WeakMap<RouteRecordRaw, boolean>();

const rewritePrefixRoute = (route: RouteRecordRaw) => {
  if (route.path.startsWith(`/:${tenantDynamicRoute}()`)) {
    const newPath = route.path.replace(`/:${tenantDynamicRoute}()`, "");
    return { ...route, path: newPath || "/" };
  }
  return route;
};

const filterForTenantRoutes = (route: RouteRecordRaw, inverse = false) => {
  if (routeFilterCache.has(route)) return routeFilterCache.get(route)! !== inverse;
  const isTenantRoute = route.path.startsWith(`/:${tenantDynamicRoute}()`);
  routeFilterCache.set(route, isTenantRoute);
  return inverse ? !isTenantRoute : isTenantRoute;
};

export default <RouterOptions>{
  routes: async routes => {
    const currentTenant = getTenant();

    // Only log in development
    if (process.dev) {
      console.log('[router.options] Tenant detection:', {
        tenant: currentTenant,
        isServer: import.meta.server
      });
    }

    let newRoutes;
    if (!currentTenant) {
      // no custom domain / tenant at all
      if (process.dev) {
        console.log('[router.options] Using main routes (no tenant)');
      }
      newRoutes = routes.filter(route => filterForTenantRoutes(route, true));
    } else {
      if (process.dev) {
        console.log('[router.options] Using tenant routes for tenant:', currentTenant);
      }
      newRoutes = routes
        .filter(route => filterForTenantRoutes(route, false))
        .map(rewritePrefixRoute);
    }

    console.log('[router.options] Routes changed', { routes, newRoutes });
    console.log('[router.options] Final routes count:', newRoutes.length);

    return newRoutes;
  },
};
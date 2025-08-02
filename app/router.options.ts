import type { RouterOptions } from "@nuxt/schema";
import type { RouteRecordRaw } from "vue-router";
import { useTenant } from "../utils/tenant";

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

    const { tenant: currentTenant } = useTenant();
    
    console.log('[router.options] Tenant detection:', {
      tenant: currentTenant.value,
      isServer: import.meta.server
    });

    let newRoutes;
    if (!currentTenant.value) {
      // no custom domain / tenant at all
      console.log('[router.options] Using main routes (no tenant)');
      newRoutes = routes.filter(route => filterForTenantRoutes(route, true));
    } else {
      console.log('[router.options] Using tenant routes for tenant:', currentTenant.value);
      newRoutes = routes
        .filter(route => filterForTenantRoutes(route, false))
        .map(rewritePrefixRoute);
    }
    console.log('[router.options] Final routes count:', newRoutes.length);
    return newRoutes;

  },
};
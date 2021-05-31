/**
 * check Permission
 * @param roles current role
 * @param route current route
 * */
export function hasPermission(roles: string, route: any) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.some((role: string) => role.indexOf(roles) >= 0);
  } else {
    return true;
  }
}
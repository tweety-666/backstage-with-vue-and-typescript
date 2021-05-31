import { ActionTree } from 'vuex';
import jwt_decode from 'jwt-decode';
import { asyncRouterMap } from '../router';
import { hasPermission } from '@/utils/common'

const actions: ActionTree<any, any> = {
  async setUser({ state, commit }, user: any) {
    const decoded: any = jwt_decode(user);
    commit('SET_USER', decoded);
    const { key } = decoded;
    let accessedRouters = filterAsyncRouter(asyncRouterMap, key);
    commit('SET_ROUTERS', accessedRouters);
  }
};

function filterAsyncRouter(asyncRouterMap: Array<any>, roles: string) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });

  return accessedRouters;
}

export default actions;

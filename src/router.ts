import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/Layout/Index.vue';
import jwt_decode from 'jwt-decode';
import { hasPermission } from '@/utils/common'
Vue.use(Router);

export const asyncRouterMap = [
  {
    path: '/',
    name: 'dashboard',
    component: Layout,
    hidden: true,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: 'Home', icon: 'fa fa-home' },
        component: () => import('@/views/Home.vue')
      }
    ]
  },
  {
    path: '/dataManage',
    name: 'dataManage',
    hidden: true,
    meta: { title: 'Data Manage', icon: 'fa fa-database' },
    component: Layout,
    redirect: '/tableData',
    children: [
      {
        path: '/tableData',
        name: 'tableData',
        meta: { title: 'Table Data', icon: 'fa fa-table' },
        component: () => import('@/views/DataManage/TableData.vue')
      },
      {
        path: '/chartsData',
        name: 'chartsData',
        meta: { title: 'Charts Data', icon: 'fa fa-bar-chart' },
        component: () => import('@/views/DataManage/ChartsData.vue')
      },
      {
        path: '/formData',
        name: 'formData',
        meta: {
          title: 'Form Data',
          icon: 'fa fa-file-text-o',
          roles: ['admin', 'editor']
        },
        component: () => import('@/views/DataManage/FormData.vue')
      }
    ]
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: Layout,
    hidden: true,
    redirect: '/accountData',
    children: [
      {
        path: '/accountData',
        name: 'accountData',
        meta: { title: 'Account Data', icon: 'fa fa-user-plus', roles: ['admin'] },
        component: () => import('@/views/UserManage/AccountData.vue')
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/userInfo',
    hidden: false,
    children: [
      {
        path: '/userInfo',
        name: 'userInfo',
        meta: { title: 'User Info' },
        component: () => import('@/views/UserManage/UserInfo.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    hidden: false,
    meta: { title: '404' },
    component: () => import('@/views/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/login',
    name: 'login',
    hidden: false,
    meta: { title: 'Login' },
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/password',
    name: 'password',
    hidden: false,
    meta: { title: 'Password' },
    component: () => import('@/views/Login/Password.vue')
  }
];

const router: any = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: asyncRouterMap
});

router.beforeEach((to: any, from: any, next: any) => {
  const isLogin = localStorage.tsToken ? true : false;
  if (to.path == '/login' || to.path == '/password') {
    next();
  } else {
    if (isLogin) {
      const decoded: any = jwt_decode(localStorage.tsToken);
      const { key } = decoded;
      // check Permission
      if (hasPermission(key, to)) {
        next();
      } else {
        next('/404'); // no permission
      }
    } else {
      next('/login');
    }
  }
});

export default router;

import { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/ConstructingPage.vue'),
      },
      {
        path: 'buildings',
        name: 'building-list',
        component: () => import('pages/building/BuildingListPage.vue'),
      },
      {
        path: 'buildings/new',
        name: 'new-building',
        component: () => import('pages/building/BuildingCreatePage.vue'),
      },
      {
        path: 'buildings/:id',
        name: 'building-detail',
        component: () => import('pages/building/BuildingDetailPage.vue'),
      },
      {
        path: 'buildings/:id/edit',
        name: 'building-edit',
        component: () => import('pages/building/BuildingEditPage.vue'),
      },
      {
        path: 'buildings/:buildingId/room/new',
        name: 'room-create',
        component: () => import('pages/room/RoomCreatePage.vue'),
      },
      {
        path: 'room/:id',
        name: 'room-detail',
        component: () => import('pages/room/RoomDetailPage.vue'),
      },
      {
        path: 'room/:id/edit',
        name: 'room-edit',
        component: () => import('pages/room/RoomEditPage.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('pages/ResetPasswordPage.vue'),
    meta: {
      requiresAuth: false,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFoundPage.vue'),
  },
];

export default routes;

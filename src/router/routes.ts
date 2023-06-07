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
        name: 'building-create',
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
      {
        path: 'contracts',
        name: 'contract-list',
        component: () => import('pages/contract/ContractListPage.vue'),
      },
      {
        path: 'departments',
        name: 'department-list',
        component: () => import('pages/department/DepartmentListPage.vue'),
      },
      {
        path: 'departments/new',
        name: 'department-create',
        component: () => import('pages/department/DepartmentCreatePage.vue'),
      },
      {
        path: 'departments/:id',
        name: 'department-detail',
        component: () => import('pages/department/DepartmentDetailPage.vue'),
      },
      {
        path: 'departments/:id/edit',
        name: 'department-edit',
        component: () => import('pages/department/DepartmentEditPage.vue'),
      },
      {
        path: 'employees',
        name: 'employee-list',
        component: () => import('pages/employee/EmployeeListPage.vue'),
      },
      {
        path: 'employees/new',
        name: 'employee-create',
        component: () => import('pages/employee/EmployeeCreatePage.vue'),
      },
      {
        path: 'employees/:id',
        name: 'employee-detail',
        component: () => import('pages/employee/EmployeeDetailPage.vue'),
      },
      {
        path: 'employees/:id/edit',
        name: 'employee-edit',
        component: () => import('pages/employee/EmployeeEditPage.vue'),
      },
      {
        path: 'tenants',
        name: 'tenant-list',
        component: () => import('pages/tenant/TenantListPage.vue'),
      },
      {
        path: 'tenants/new',
        name: 'tenant-create',
        component: () => import('pages/tenant/TenantCreatePage.vue'),
      },
      {
        path: 'tenants/:id',
        name: 'tenant-detail',
        component: () => import('pages/tenant/TenantDetailPage.vue'),
      },
      {
        path: 'tenants/:id/edit',
        name: 'tenant-edit',
        component: () => import('pages/tenant/TenantEditPage.vue'),
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

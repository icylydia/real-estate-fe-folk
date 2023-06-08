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
      // 物件
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
      // 契約
      {
        path: 'contracts',
        name: 'contract-list',
        component: () => import('pages/contract/ContractListPage.vue'),
      },
      // 部署
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
      // 社員
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
      // 入居者
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
      // 収支
      {
        path: 'incomes',
        name: 'income-list',
        component: () => import('pages/income/IncomeListPage.vue'),
      },
      {
        path: 'incomes/new',
        name: 'income-create',
        component: () => import('pages/income/IncomeCreatePage.vue'),
      },
      {
        path: 'incomes/:id',
        name: 'income-detail',
        component: () => import('pages/income/IncomeDetailPage.vue'),
      },
      {
        path: 'incomes/:id/edit',
        name: 'income-edit',
        component: () => import('pages/income/IncomeEditPage.vue'),
      },
      // 支出
      {
        path: 'expenses',
        name: 'expense-list',
        component: () => import('pages/expense/ExpenseListPage.vue'),
      },
      {
        path: 'expenses/new',
        name: 'expense-create',
        component: () => import('pages/expense/ExpenseCreatePage.vue'),
      },
      {
        path: 'expenses/:id',
        name: 'expense-detail',
        component: () => import('pages/expense/ExpenseDetailPage.vue'),
      },
      {
        path: 'expenses/:id/edit',
        name: 'expense-edit',
        component: () => import('pages/expense/ExpenseEditPage.vue'),
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

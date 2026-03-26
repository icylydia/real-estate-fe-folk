<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ appName }}
        </q-toolbar-title>

        <div>v{{ appVersion }}</div>
        <div>
          <q-btn
            flat
            dense
            round
            icon="sym_r_logout"
            aria-label="Logout"
            class="q-mx-sm"
            @click="logout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <essential-link
          v-for="(link, index) in essentialLinks"
          :key="index"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import EssentialLink from 'components/EssentialLink.vue';
import useApp from 'components/app/useApp';
import { logout as authLogout } from 'src/auth';
import { storeToRefs } from 'pinia';
import { useAppStore } from 'stores/app-store';
import { useRouter } from 'vue-router';
const router = useRouter();

const { isSidebarOpen: leftDrawerOpen } = storeToRefs(useAppStore());
const { appName, appVersion } = useApp()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = async () => {
  authLogout()
  try {
    await router.push({ name: 'login' })
  } catch (err) {
    console.error(err)
  }
}

const essentialLinks = [
  {
    title: '物件管理',
    icon: 'sym_r_home_work',
    link: router.resolve({ name: 'building-list' }).href,
  },
  {
    title: 'オーナー管理',
    icon: 'sym_r_productivity',
    link: router.resolve({ name: 'owner-list' }).href,
  },
  {
    title: '入居者管理',
    icon: 'sym_r_family_restroom',
    link: router.resolve({ name: 'tenant-list' }).href,
  },
  {
    title: '契約管理',
    icon: 'sym_r_edit_document',
    subMenu: [
      {
        title: '賃貸借契約一覧',
        icon: 'sym_r_contract',
        link: router.resolve({ name: 'rental-contract-list' }).href,
      },
      {
        title: '管理委託契約一覧',
        icon: 'sym_r_real_estate_agent',
        link: router.resolve({ name: 'entrust-contract-list' }).href,
      },
    ],
  },
  {
    title: '収支管理',
    icon: 'sym_r_currency_exchange',
    subMenu: [
      {
        title: '収入一覧',
        icon: 'sym_r_trending_up',
        link: router.resolve({ name: 'income-list' }).href,
      },
      {
        title: '支出一覧',
        icon: 'sym_r_trending_down',
        link: router.resolve({ name: 'expense-list' }).href,
      },
      {
        title: 'CSV取込',
        icon: 'sym_r_upload_file',
        link: router.resolve({ name: 'itandi-csv-import' }).href,
      },
      {
        title: '月度資料',
        icon: 'sym_r_folder_managed',
        link: router.resolve({ name: 'monthly-archive-list' }).href,
      },
      {
        title: '月次収支報告（履歴）',
        icon: 'sym_r_summarize',
        link: router.resolve({ name: 'monthly-income-expense-report-list' }).href,
      },
    ],
  },
  {
    title: '部署管理',
    icon: 'sym_r_tenancy',
    link: router.resolve({ name: 'department-list' }).href,
  },
  {
    title: '社員管理',
    icon: 'sym_r_group',
    link: router.resolve({ name: 'employee-list' }).href,
  },
]
</script>

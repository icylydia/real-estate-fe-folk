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

<script lang="ts">
import { defineComponent } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import useApp from 'components/app/useApp';
import { logout } from 'src/auth';
import { storeToRefs } from 'pinia';
import { useAppStore } from 'stores/app-store';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const { isSidebarOpen: leftDrawerOpen } = storeToRefs(useAppStore());
    const {appName, appVersion} = useApp()

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      appName,
      appVersion,
    }
  },

  data () {
    return {
      essentialLinks: [
        {
          title: '物件管理',
          icon: 'sym_r_home_work',
          link: this.$router.resolve({ name: 'building-list' }).href,
        },
        {
          title: 'オーナー管理',
          icon: 'sym_r_productivity',
          link: this.$router.resolve({ name: 'owner-list' }).href,
        },
        {
          title: '入居者管理',
          icon: 'sym_r_family_restroom',
          link: this.$router.resolve({ name: 'tenant-list' }).href,
        },
        {
          title: '契約管理',
          icon: 'sym_r_edit_document',
          subMenu: [
            {
              title: '賃貸借契約',
              icon: 'sym_r_event',
              subMenu: [
                {
                  title: '契約一覧',
                  link: this.$router.resolve({ name: 'rental-contract-list' }).href,
                },
              ],
            },
            {
              title: '管理委託契約',
              icon: 'sym_r_event',
              subMenu: [
                {
                  title: '契約一覧',
                  link: this.$router.resolve({ name: 'entrust-contract-list' }).href,
                },
              ],
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
              link: this.$router.resolve({ name: 'income-list' }).href,
            },
            {
              title: '支出一覧',
              icon: 'sym_r_trending_down',
              link: this.$router.resolve({ name: 'expense-list' }).href,
            },
          ],
        },
        {
          title: '部署管理',
          icon: 'sym_r_tenancy',
          link: this.$router.resolve({ name: 'department-list' }).href,
        },
        {
          title: '社員管理',
          icon: 'sym_r_group',
          link: this.$router.resolve({ name: 'employee-list' }).href,
        },
      ]
    }
  },

  methods: {
    async logout () {
      logout()
      try {
        await this.$router.push({ name: 'login' })
      } catch (err) {
        console.error(err)
      }
    }
  }
});
</script>

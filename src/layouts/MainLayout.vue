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
      show-if-above
      bordered
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
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
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import useApp from 'components/app/useApp';
import { logout } from 'src/auth';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
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
          title: 'ダッシュボード',
          caption: '稼働状況一覧',
          icon: 'sym_r_monitoring',
          link: this.$router.resolve({ name: 'home' }).href
        },
        {
          title: '物件管理',
          icon: 'sym_r_home_work',
          link: this.$router.resolve({ name: 'building-list' }).href
        },
        {
          title: '部署管理',
          icon: 'sym_r_tenancy',
          link: this.$router.resolve({ name: 'department-list' }).href
        },
        {
          title: '社員管理',
          icon: 'sym_r_group',
          link: this.$router.resolve({ name: 'employee-list' }).href
        },
      ]
    }
  },

  methods: {
    logout () {
      logout()
      this.$router.push({ name: 'login' })
    }
  }
});
</script>

import { computed } from 'vue';

export default () => {
  const appVersion = computed(() => import.meta.env.VITE_APP_VERSION)

  return {
    appVersion
  }
}

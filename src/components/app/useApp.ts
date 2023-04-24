import { computed } from 'vue';

export default () => {
  const appName = computed(() => import.meta.env.VITE_APP_NAME)
  const appVersion = computed(() => import.meta.env.VITE_APP_VERSION)

  return {
    appName,
    appVersion,
  }
}

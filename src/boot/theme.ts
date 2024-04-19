import { boot } from 'quasar/wrappers'
import { setCssVar } from 'quasar';

export default boot(() => {
  setCssVar('primary', import.meta.env.VITE_APP_PRIMARY_COLOR);
  setCssVar('secondary', import.meta.env.VITE_APP_SECONDARY_COLOR);
  setCssVar('accent', import.meta.env.VITE_APP_ACCENT_COLOR);
  setCssVar('dark', import.meta.env.VITE_APP_DARK_COLOR);
  setCssVar('dark-page', import.meta.env.VITE_APP_DARK_PAGE_COLOR)
  setCssVar('positive', import.meta.env.VITE_APP_POSITIVE_COLOR);
  setCssVar('negative', import.meta.env.VITE_APP_NEGATIVE_COLOR);
  setCssVar('info', import.meta.env.VITE_APP_INFO_COLOR);
  setCssVar('warning', import.meta.env.VITE_APP_WARNING_COLOR);
})

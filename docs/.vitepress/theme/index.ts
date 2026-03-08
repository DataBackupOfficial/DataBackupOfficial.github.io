import DefaultTheme from 'vitepress/theme'
import RedirectPage from './RedirectPage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RedirectPage', RedirectPage)
  }
}

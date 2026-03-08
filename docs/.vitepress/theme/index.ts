import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import RedirectPage from './RedirectPage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('RedirectPage', RedirectPage)
  },
} satisfies Theme

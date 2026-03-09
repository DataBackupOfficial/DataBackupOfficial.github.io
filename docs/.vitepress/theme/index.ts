import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './custom.css'
import RedirectPage from './RedirectPage.vue'
import TranslateLink from './TranslateLink.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-content-after': () => h(TranslateLink),
  }),
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('RedirectPage', RedirectPage)
  },
} satisfies Theme

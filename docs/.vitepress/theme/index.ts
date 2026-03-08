import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'

function getLocale(): string {
  const lang = (navigator.language || '').toLowerCase()
  if (lang.startsWith('zh')) return '/zh/'
  return '/en/'
}

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (inBrowser) {
      const path = window.location.pathname
      if (path === '/' || path === '/index.html') {
        window.location.replace(getLocale())
      }
    }
  },
}

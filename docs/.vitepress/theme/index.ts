import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import { resolveLocalePath } from '../locale-runtime'

function getLocale(): string {
  return resolveLocalePath(navigator.languages.length > 0 ? navigator.languages : [navigator.language || ''])
}

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (inBrowser) {
      const path = window.location.pathname
      if (path === '/' || path === '/index.html') {
        window.location.replace(getLocale())
      }
    }
  },
}

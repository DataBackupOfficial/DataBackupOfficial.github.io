import { defineConfig } from 'vitepress'
import { siteLocales } from './locales'

const localeRedirects = Object.entries(siteLocales).map(([key, locale]) => ({
  path: `/${key}/`,
  lang: locale.lang
}))

export default defineConfig({
  title: 'DataBackup',
  description: 'Free and open-source data backup application',
  base: '/',
  head: [['link', { rel: 'icon', href: '/images/logo.png' }]],
  themeConfig: {
    logo: '/images/logo.png',
    localeRedirects,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XayahSuSuSu/Android-DataBackup' }
    ]
  },
  locales: Object.fromEntries(
    Object.entries(siteLocales).map(([key, locale]) => [
      key,
      {
        label: locale.label,
        lang: locale.lang,
        themeConfig: {
          nav: locale.nav,
          sidebar: locale.sidebar
        }
      }
    ])
  )
})

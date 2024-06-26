import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { navbarEn, navbarZh } from './configs/navbar/index.ts'

export default defineUserConfig({
  lang: 'en-US',

  theme: defaultTheme({
    logo: '/images/logo.png',

    navbar: ['/'],

    repo: 'XayahSuSuSu/Android-DataBackup',

    locales: {
      '/': {
        navbar: navbarEn,
        selectLanguageName: 'English',
        selectLanguageText: 'Language',
      },
      '/zh/': {
        navbar: navbarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
      },
    },
  }),

  bundler: viteBundler(),

  locales: {
    '/': {
      lang: 'en-US',
      title: 'DataBackup',
      description: 'Free and open-source data backup application',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: '数据备份',
      description: '免费开源的数据备份应用',
    },
  },
})

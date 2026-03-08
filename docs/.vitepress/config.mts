import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "DataBackup",
  description: "Free and open-source data backup application",
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }]
  ],
  themeConfig: {
    logo: '/images/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XayahSuSuSu/Android-DataBackup' }
    ]
  },
  locales: {
    en: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/get-started' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Get Started', link: '/en/get-started' },
            ]
          },
          {
            text: 'Usage',
            items: [
              { text: 'Setup', link: '/en/setup' }
            ]
          }
        ]
      }
    },
    hr: {
      label: 'Hrvatski',
      lang: 'hr',
      themeConfig: {
        nav: [
          { text: 'Početna', link: '/hr/' },
          { text: 'Vodič', link: '/hr/get-started' }
        ],
        sidebar: [
          {
            text: 'Vodič',
            items: [
              { text: 'Započni', link: '/hr/get-started' },
            ]
          },
          {
            text: 'Usage',
            items: [
              { text: 'Postavljanje', link: '/hr/setup' }
            ]
          }
        ]
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      themeConfig: {
        nav: [
          { text: '主页', link: '/zh/' },
          { text: '指南', link: '/zh/get-started' }
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '开始', link: '/zh/get-started' },
            ]
          },
          {
            text: '使用',
            items: [
              { text: '引导', link: '/zh/setup' }
            ]
          }
        ]
      }
    }
  }
})

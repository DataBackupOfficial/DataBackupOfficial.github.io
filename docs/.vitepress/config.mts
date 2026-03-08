import { defineConfig } from 'vitepress'
import { siteLocales } from './locales'

const localeRedirects = Object.entries(siteLocales).map(([key, locale]) => ({
  path: `/${key}/`,
  lang: locale.lang
}))

function createLocaleRedirectScript() {
  return `(() => {
    const redirects = ${JSON.stringify(localeRedirects)};
    const pathname = window.location.pathname;

    if (pathname !== '/' && pathname !== '/index.html') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const delayValue = Number(params.get('redirectDelay') ?? '0');
    const redirectDelay = Number.isFinite(delayValue) && delayValue >= 0
      ? delayValue
      : 0;

    const preferred = [];
    const seen = new Set();
    const push = (language) => {
      if (typeof language !== 'string') {
        return;
      }

      const normalized = language.trim().toLowerCase().replace(/_/g, '-');

      if (!normalized || seen.has(normalized)) {
        return;
      }

      seen.add(normalized);
      preferred.push(normalized);
    };

    try {
      push(Intl.DateTimeFormat().resolvedOptions().locale);
    } catch {}

    push(navigator.language);

    for (const language of navigator.languages ?? []) {
      push(language);
    }

    push(navigator.userLanguage);
    push(navigator.browserLanguage);
    push(navigator.systemLanguage);

    const resolve = () => {
      const normalized = preferred.flatMap((language) => [language, language.split('-')[0]]);

      for (const candidate of normalized) {
        const matched = redirects.find(({ lang }) => {
          const normalizedLang = lang.toLowerCase();
          return candidate === normalizedLang || candidate === normalizedLang.split('-')[0];
        });

        if (matched) {
          return matched.path;
        }
      }

      return redirects.find(({ lang }) => lang.toLowerCase().startsWith('en'))?.path
        ?? redirects[0]?.path
        ?? '/en/';
    };

    const target = resolve();

    if (target && target !== pathname) {
      window.setTimeout(() => {
        window.location.replace(target);
      }, redirectDelay);
    }
  })();`
}

export default defineConfig({
  title: 'DataBackup',
  description: 'Free and open-source data backup application',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }],
    ['script', {}, createLocaleRedirectScript()]
  ],
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

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

type LocaleStrings = {
  sidebarMenuLabel: string
  darkModeSwitchLabel: string
  outlineTitle: string
  returnToTopLabel: string
  translateMenuLabel: string
  docFooter: {
    prev: string
    next: string
  }
  nav: {
    home: string
    guide: string
  }
  sidebar: {
    guide: string
    getStarted: string
    usage: string
    setup: string
  }
}

export type SiteLocale = {
  label: string
  lang: string
  sidebarMenuLabel: string
  darkModeSwitchLabel: string
  outlineTitle: string
  returnToTopLabel: string
  translateMenuLabel: string
  docFooter: {
    prev: string
    next: string
  }
  nav: Array<{ text: string; link: string }>
  sidebar: Array<{
    text: string
    items: Array<{ text: string; link: string }>
  }>
}

const vitepressRoot = dirname(fileURLToPath(import.meta.url))
const docsRoot = dirname(vitepressRoot)
function capitalizeLanguageName(value: string, locale: string): string {
  const [first = '', ...rest] = Array.from(value)
  return first.toLocaleUpperCase(locale) + rest.join('')
}

function createLocaleMetadata(localeKey: string): { label: string; lang: string } {
  const candidate = localeKey.replaceAll('_', '-')
  let lang: string

  try {
    lang = Intl.getCanonicalLocales(candidate)[0]
  } catch {
    throw new TypeError(`Invalid locale directory name: ${localeKey}`)
  }

  const generatedLabel = new Intl.DisplayNames([lang], { type: 'language' }).of(lang)
  const label = generatedLabel

  if (!label) {
    throw new TypeError(`Could not generate a language label for ${localeKey}`)
  }

  return {
    label: capitalizeLanguageName(label, lang),
    lang
  }
}

function requireRecord(value: unknown, location: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${location} must be an object`)
  }

  return value as Record<string, unknown>
}

function requireKeys(value: Record<string, unknown>, expected: string[], location: string) {
  const actual = Object.keys(value).sort()
  const wanted = [...expected].sort()

  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    throw new TypeError(`${location} must contain exactly: ${wanted.join(', ')}`)
  }
}

function requireString(value: unknown, location: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${location} must be a non-empty string`)
  }

  return value
}

function readLocaleStrings(localePath: string): LocaleStrings {
  const root = requireRecord(JSON.parse(readFileSync(localePath, 'utf8')), localePath)
  requireKeys(root, [
    'darkModeSwitchLabel',
    'docFooter',
    'nav',
    'outlineTitle',
    'returnToTopLabel',
    'sidebar',
    'sidebarMenuLabel',
    'translateMenuLabel'
  ], localePath)

  const docFooter = requireRecord(root.docFooter, `${localePath}.docFooter`)
  requireKeys(docFooter, ['next', 'prev'], `${localePath}.docFooter`)

  const nav = requireRecord(root.nav, `${localePath}.nav`)
  requireKeys(nav, ['guide', 'home'], `${localePath}.nav`)

  const sidebar = requireRecord(root.sidebar, `${localePath}.sidebar`)
  requireKeys(sidebar, ['getStarted', 'guide', 'setup', 'usage'], `${localePath}.sidebar`)

  return {
    sidebarMenuLabel: requireString(root.sidebarMenuLabel, `${localePath}.sidebarMenuLabel`),
    darkModeSwitchLabel: requireString(root.darkModeSwitchLabel, `${localePath}.darkModeSwitchLabel`),
    outlineTitle: requireString(root.outlineTitle, `${localePath}.outlineTitle`),
    returnToTopLabel: requireString(root.returnToTopLabel, `${localePath}.returnToTopLabel`),
    translateMenuLabel: requireString(root.translateMenuLabel, `${localePath}.translateMenuLabel`),
    docFooter: {
      prev: requireString(docFooter.prev, `${localePath}.docFooter.prev`),
      next: requireString(docFooter.next, `${localePath}.docFooter.next`)
    },
    nav: {
      home: requireString(nav.home, `${localePath}.nav.home`),
      guide: requireString(nav.guide, `${localePath}.nav.guide`)
    },
    sidebar: {
      guide: requireString(sidebar.guide, `${localePath}.sidebar.guide`),
      getStarted: requireString(sidebar.getStarted, `${localePath}.sidebar.getStarted`),
      usage: requireString(sidebar.usage, `${localePath}.sidebar.usage`),
      setup: requireString(sidebar.setup, `${localePath}.sidebar.setup`)
    }
  }
}

function createSiteLocale(localeKey: string, strings: LocaleStrings): SiteLocale {
  const metadata = createLocaleMetadata(localeKey)
  const localeRoot = `/${localeKey}`

  return {
    label: metadata.label,
    lang: metadata.lang,
    sidebarMenuLabel: strings.sidebarMenuLabel,
    darkModeSwitchLabel: strings.darkModeSwitchLabel,
    outlineTitle: strings.outlineTitle,
    returnToTopLabel: strings.returnToTopLabel,
    translateMenuLabel: strings.translateMenuLabel,
    docFooter: strings.docFooter,
    nav: [
      { text: strings.nav.home, link: `${localeRoot}/` },
      { text: strings.nav.guide, link: `${localeRoot}/get-started` }
    ],
    sidebar: [
      {
        text: strings.sidebar.guide,
        items: [{ text: strings.sidebar.getStarted, link: `${localeRoot}/get-started` }]
      },
      {
        text: strings.sidebar.usage,
        items: [{ text: strings.sidebar.setup, link: `${localeRoot}/setup` }]
      }
    ]
  }
}

function loadSiteLocales(): Record<string, SiteLocale> {
  const localeEntries = readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const localePath = join(docsRoot, entry.name, 'locale.json')

      if (!existsSync(localePath)) {
        return null
      }

      return [entry.name, createSiteLocale(entry.name, readLocaleStrings(localePath))] as const
    })
    .filter((entry): entry is readonly [string, SiteLocale] => entry !== null)

  return Object.fromEntries(localeEntries)
}

export const siteLocales = loadSiteLocales()

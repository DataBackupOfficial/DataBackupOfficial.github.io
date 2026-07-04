import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type SiteLocale = {
  label: string
  lang: string
  sidebarMenuLabel?: string
  darkModeSwitchLabel?: string
  outlineTitle?: string
  returnToTopLabel?: string
  translateMenuLabel?: string
  docFooter?: {
    prev?: string
    next?: string
  }
  nav: Array<{ text: string; link: string }>
  sidebar: Array<{
    text: string
    items: Array<{ text: string; link: string }>
  }>
}

const vitepressRoot = dirname(fileURLToPath(import.meta.url))
const docsRoot = dirname(vitepressRoot)

function readLocaleFile(localePath: string): SiteLocale {
  return JSON.parse(readFileSync(localePath, 'utf8')) as SiteLocale
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function readNav(value: unknown): SiteLocale['nav'] | undefined {
  if (Array.isArray(value)) {
    const nav = value
      .filter(isRecord)
      .map((item) => ({
        text: readString(item.text),
        link: readString(item.link)
      }))
      .filter((item): item is { text: string; link: string } => !!item.text && !!item.link)

    if (nav.length > 0) {
      return nav
    }
  }

  return undefined
}

function readSidebar(value: unknown): SiteLocale['sidebar'] | undefined {
  if (Array.isArray(value)) {
    const sidebar = value
      .filter(isRecord)
      .map((section) => ({
        text: readString(section.text),
        items: Array.isArray(section.items)
          ? section.items
            .filter(isRecord)
            .map((item) => ({
              text: readString(item.text),
              link: readString(item.link)
            }))
            .filter((item): item is { text: string; link: string } => !!item.text && !!item.link)
          : []
      }))
      .filter((section): section is SiteLocale['sidebar'][number] =>
        !!section.text && section.items.length > 0
      )

    if (sidebar.length > 0) {
      return sidebar
    }
  }

  return undefined
}

function readDocFooter(value: unknown): SiteLocale['docFooter'] | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const prev = readString(value.prev)
  const next = readString(value.next)

  return prev || next ? { prev, next } : undefined
}

function langMatchesLocaleKey(localeKey: string, lang: string): boolean {
  const normalizedKey = localeKey.trim().toLowerCase()
  const normalizedLang = lang.trim().toLowerCase().replace(/_/g, '-')

  return normalizedLang === normalizedKey || normalizedLang.startsWith(`${normalizedKey}-`)
}

function validateLocale(localeKey: string, locale: unknown): SiteLocale | null {
  if (!isRecord(locale)) {
    return null
  }

  const label = readString(locale.label)
  const lang = readString(locale.lang)
  const nav = readNav(locale.nav)
  const sidebar = readSidebar(locale.sidebar)

  if (!label || !lang || !langMatchesLocaleKey(localeKey, lang) || !nav || !sidebar) {
    return null
  }

  return {
    label,
    lang,
    sidebarMenuLabel: readString(locale.sidebarMenuLabel),
    darkModeSwitchLabel: readString(locale.darkModeSwitchLabel),
    outlineTitle: readString(locale.outlineTitle),
    returnToTopLabel: readString(locale.returnToTopLabel),
    translateMenuLabel: readString(locale.translateMenuLabel),
    docFooter: readDocFooter(locale.docFooter),
    nav,
    sidebar
  }
}

function loadSiteLocales(): Record<string, SiteLocale> {
  const localeEntries = readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const localeFile = join(docsRoot, entry.name, 'locale.json')
      if (!existsSync(localeFile)) {
        return null
      }

      const locale = validateLocale(entry.name, readLocaleFile(localeFile))

      return locale ? [entry.name, locale] as const : null
    })
    .filter((entry): entry is readonly [string, SiteLocale] => entry !== null)

  return Object.fromEntries(localeEntries)
}

export const siteLocales = loadSiteLocales()

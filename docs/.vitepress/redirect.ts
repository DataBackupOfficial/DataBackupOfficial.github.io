export type LocaleRedirect = {
  path: string
  lang?: string
}

function normalizeLanguage(language: unknown): string {
  if (typeof language !== 'string') {
    return ''
  }

  return language.trim().toLowerCase().replace(/_/g, '-')
}

function pushLanguage(
  target: string[],
  seen: Set<string>,
  language: unknown
) {
  const normalized = normalizeLanguage(language)

  if (!normalized || seen.has(normalized)) {
    return
  }

  seen.add(normalized)
  target.push(normalized)
}

export function getPreferredLanguages(
  navigatorLike: Navigator = navigator
): string[] {
  const preferred: string[] = []
  const seen = new Set<string>()
  const legacyNavigator = navigatorLike as Navigator & {
    userLanguage?: string
    browserLanguage?: string
    systemLanguage?: string
  }

  try {
    pushLanguage(
      preferred,
      seen,
      Intl.DateTimeFormat().resolvedOptions().locale
    )
  } catch {
    // Ignore locale detection failures and fall back to navigator hints.
  }

  pushLanguage(preferred, seen, navigatorLike.language)

  for (const language of navigatorLike.languages ?? []) {
    pushLanguage(preferred, seen, language)
  }

  pushLanguage(preferred, seen, legacyNavigator.userLanguage)
  pushLanguage(preferred, seen, legacyNavigator.browserLanguage)
  pushLanguage(preferred, seen, legacyNavigator.systemLanguage)

  return preferred
}

export function resolveRedirectPath(
  redirects: readonly LocaleRedirect[],
  preferredLanguages: readonly string[]
): string {
  const safeRedirects = redirects
    .map((redirect) => {
      const lang = normalizeLanguage(redirect.lang)

      return typeof redirect.path === 'string' && redirect.path && lang
        ? { path: redirect.path, lang }
        : null
    })
    .filter((redirect): redirect is { path: string; lang: string } => redirect !== null)

  const normalized = preferredLanguages
    .map((language) => normalizeLanguage(language))
    .filter(Boolean)
    .flatMap((language) => [language, language.split('-')[0]])

  for (const preferred of normalized) {
    const matched = safeRedirects.find(({ lang }) =>
      preferred === lang || preferred === lang.split('-')[0]
    )

    if (matched) {
      return matched.path
    }
  }

  return safeRedirects.find(({ lang }) => lang.startsWith('en'))?.path
    ?? safeRedirects[0]?.path
    ?? '/en/'
}

export function getRedirectDelay(search: string): number {
  const params = new URLSearchParams(search)
  const value = Number(params.get('redirectDelay') ?? '0')

  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  return value
}

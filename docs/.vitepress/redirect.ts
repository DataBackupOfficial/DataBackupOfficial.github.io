export type LocaleRedirect = {
  path: string
  lang: string
}

function normalizeLanguage(language: string): string {
  return language.trim().toLowerCase().replace(/_/g, '-')
}

function pushLanguage(
  target: string[],
  seen: Set<string>,
  language: string | undefined
) {
  if (!language) {
    return
  }

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
  redirects: LocaleRedirect[],
  preferredLanguages: readonly string[]
): string {
  const normalized = preferredLanguages
    .map((language) => normalizeLanguage(language))
    .flatMap((language) => [language, language.split('-')[0]])

  for (const preferred of normalized) {
    const matched = redirects.find(({ lang }) => {
      const normalizedLang = lang.toLowerCase()
      return preferred === normalizedLang || preferred === normalizedLang.split('-')[0]
    })

    if (matched) {
      return matched.path
    }
  }

  return redirects.find(({ lang }) => lang.toLowerCase().startsWith('en'))?.path
    ?? redirects[0]?.path
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

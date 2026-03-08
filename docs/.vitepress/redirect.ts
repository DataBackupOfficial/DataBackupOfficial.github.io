export type LocaleRedirect = {
  path: string
  lang: string
}

export function resolveRedirectPath(
  redirects: LocaleRedirect[],
  preferredLanguages: readonly string[]
): string {
  const normalized = preferredLanguages
    .map((language) => language.toLowerCase())
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

  return '/en/'
}

export function getRedirectDelay(search: string): number {
  const params = new URLSearchParams(search)
  const value = Number(params.get('redirectDelay') ?? '0')

  if (!Number.isFinite(value) || value < 0) {
    return 0
  }

  return value
}

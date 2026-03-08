type RuntimeLocale = {
  lang: string
}

const localeModules = import.meta.glob('../../*/locale.json', {
  eager: true,
  import: 'default'
}) as Record<string, RuntimeLocale>

const runtimeLocales = Object.entries(localeModules).map(([filePath, locale]) => {
  const match = filePath.match(/\.\.\/\.\.\/([^/]+)\/locale\.json$/)

  return match
    ? {
        localePath: `/${match[1]}/`,
        lang: locale.lang.toLowerCase(),
        baseLang: locale.lang.toLowerCase().split('-')[0]
      }
    : null
}).filter((locale): locale is { localePath: string; lang: string; baseLang: string } => locale !== null)

export function resolveLocalePath(preferredLanguages: readonly string[]): string {
  const normalized = preferredLanguages
    .map((language) => language.toLowerCase())
    .flatMap((language) => [language, language.split('-')[0]])

  for (const preferred of normalized) {
    const matchedLocale = runtimeLocales.find(
      (locale) => preferred === locale.lang || preferred === locale.baseLang
    )

    if (matchedLocale) {
      return matchedLocale.localePath
    }
  }

  return '/en/'
}

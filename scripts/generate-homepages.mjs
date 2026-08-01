import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const docsRoot = join(repositoryRoot, 'docs')
const localePattern = /^[a-z]{2,3}(?:-[a-z0-9]+)*$/i

function assertObject(value, location) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${location} must be an object`)
  }

  return value
}

function assertKeys(value, expected, location) {
  const actual = Object.keys(value).sort()
  const wanted = [...expected].sort()

  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    throw new TypeError(`${location} must contain exactly: ${wanted.join(', ')}`)
  }
}

function readString(value, location) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${location} must be a non-empty string`)
  }

  return value
}

function readFeature(features, key, location) {
  const feature = assertObject(features[key], `${location}.${key}`)
  assertKeys(feature, ['details', 'title'], `${location}.${key}`)

  return {
    title: readString(feature.title, `${location}.${key}.title`),
    details: readString(feature.details, `${location}.${key}.details`)
  }
}

function validateHome(value, filename) {
  const home = assertObject(value, filename)
  assertKeys(home, ['features', 'hero'], filename)

  const hero = assertObject(home.hero, `${filename}.hero`)
  assertKeys(hero, ['getStarted', 'imageAlt', 'name', 'tagline', 'viewOnGitHub'], `${filename}.hero`)

  const features = assertObject(home.features, `${filename}.features`)
  assertKeys(features, ['cloud', 'multiUser', 'root'], `${filename}.features`)

  return {
    hero: {
      name: readString(hero.name, `${filename}.hero.name`),
      tagline: readString(hero.tagline, `${filename}.hero.tagline`),
      imageAlt: readString(hero.imageAlt, `${filename}.hero.imageAlt`),
      getStarted: readString(hero.getStarted, `${filename}.hero.getStarted`),
      viewOnGitHub: readString(hero.viewOnGitHub, `${filename}.hero.viewOnGitHub`)
    },
    features: {
      root: readFeature(features, 'root', `${filename}.features`),
      multiUser: readFeature(features, 'multiUser', `${filename}.features`),
      cloud: readFeature(features, 'cloud', `${filename}.features`)
    }
  }
}

function yamlString(value) {
  return JSON.stringify(value)
}

function renderHomepage(locale, home) {
  const { hero, features } = home

  return `---
# Generated from home.json by scripts/generate-homepages.mjs. Do not edit.
layout: home

hero:
  name: ${yamlString(hero.name)}
  tagline: ${yamlString(hero.tagline)}
  image:
    src: /images/logo.png
    alt: ${yamlString(hero.imageAlt)}
  actions:
    - theme: brand
      text: ${yamlString(hero.getStarted)}
      link: /${locale}/get-started
    - theme: alt
      text: ${yamlString(hero.viewOnGitHub)}
      link: https://github.com/XayahSuSuSu/Android-DataBackup

features:
  - icon: 🍑
    title: ${yamlString(features.root.title)}
    details: ${yamlString(features.root.details)}
  - icon: ✨
    title: ${yamlString(features.multiUser.title)}
    details: ${yamlString(features.multiUser.details)}
  - icon: 🔥
    title: ${yamlString(features.cloud.title)}
    details: ${yamlString(features.cloud.details)}
---
`
}

const entries = await readdir(docsRoot, { withFileTypes: true })
let generated = 0

for (const entry of entries) {
  if (!entry.isDirectory() || !localePattern.test(entry.name)) {
    continue
  }

  const locale = entry.name
  const homePath = join(docsRoot, locale, 'home.json')
  let source

  try {
    source = await readFile(homePath, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') {
      continue
    }
    throw error
  }

  let parsed
  try {
    parsed = JSON.parse(source)
  } catch (error) {
    throw new SyntaxError(`${homePath}: invalid JSON: ${error.message}`)
  }

  const home = validateHome(parsed, homePath)
  await writeFile(join(docsRoot, locale, 'index.md'), renderHomepage(locale, home), 'utf8')
  generated += 1
}

if (generated === 0) {
  throw new Error('No docs/*/home.json files were found')
}

console.log(`Generated ${generated} localized homepages.`)

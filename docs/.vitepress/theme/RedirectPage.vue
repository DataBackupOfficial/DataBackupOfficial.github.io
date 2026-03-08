<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { getRedirectDelay, resolveRedirectPath, type LocaleRedirect } from '../redirect'

const { site } = useData()

const redirects = computed(
  () => (site.value.themeConfig.localeRedirects ?? []) as LocaleRedirect[]
)
const preferredLanguages = ref<string[]>([])
const targetPath = ref('/en/')

onMounted(() => {
  preferredLanguages.value = navigator.languages.length > 0
    ? [...navigator.languages]
    : [navigator.language || 'en']

  targetPath.value = resolveRedirectPath(redirects.value, preferredLanguages.value)

  const delay = getRedirectDelay(window.location.search)
  window.setTimeout(() => {
    window.location.replace(targetPath.value)
  }, delay)
})
</script>

<template>
  <div class="redirect-shell">
    <div class="redirect-orb redirect-orb-left"></div>
    <div class="redirect-orb redirect-orb-right"></div>

    <main class="redirect-card">
      <div class="redirect-badge">DataBackup</div>

      <div class="redirect-pulse" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <h1 class="redirect-title">Preparing your docs</h1>

      <div class="redirect-progress" aria-hidden="true">
        <div class="redirect-progress-track">
          <div class="redirect-progress-bar"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
:global(:root) {
  color-scheme: light;
}

:global(body) {
  margin: 0;
}

.redirect-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(22, 163, 74, 0.2), transparent 28%),
    radial-gradient(circle at bottom right, rgba(14, 116, 144, 0.22), transparent 30%),
    linear-gradient(135deg, #f5f7f2 0%, #edf7f4 48%, #eef5fb 100%);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #102218;
}

.redirect-card {
  position: relative;
  width: min(520px, 100%);
  padding: 40px 32px 36px;
  border: 1px solid rgba(16, 34, 24, 0.08);
  border-radius: 28px;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(30, 41, 59, 0.12);
}

.redirect-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.redirect-title {
  margin: 18px 0 0;
  font-size: clamp(24px, 4.2vw, 38px);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.redirect-progress {
  margin-top: 30px;
}

.redirect-progress-track {
  position: relative;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
}

.redirect-progress-bar {
  position: absolute;
  inset: 0 auto 0 0;
  width: 38%;
  background: linear-gradient(90deg, #0f766e 0%, #22c55e 55%, #38bdf8 100%);
  border-radius: 999px;
  animation: loading-slide 1.4s ease-in-out infinite;
}

.redirect-pulse {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 84px;
  height: 84px;
}

.redirect-pulse span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(15, 118, 110, 0.2);
  animation: ripple 2.4s ease-out infinite;
}

.redirect-pulse span:nth-child(2) {
  animation-delay: 0.8s;
}

.redirect-pulse span:nth-child(3) {
  animation-delay: 1.6s;
}

.redirect-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(10px);
  opacity: 0.55;
}

.redirect-orb-left {
  width: 240px;
  height: 240px;
  top: 8%;
  left: -60px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.24), transparent 70%);
  animation: drift 11s ease-in-out infinite;
}

.redirect-orb-right {
  width: 320px;
  height: 320px;
  right: -100px;
  bottom: -20px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%);
  animation: drift 14s ease-in-out infinite reverse;
}

@keyframes ripple {
  0% {
    transform: scale(0.35);
    opacity: 0;
  }

  35% {
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes loading-slide {
  0% {
    transform: translateX(-115%);
  }

  100% {
    transform: translateX(365%);
  }
}

@keyframes drift {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(18px, -22px, 0);
  }
}

@media (max-width: 720px) {
  .redirect-card {
    width: min(440px, 100%);
    padding: 28px 20px 28px;
    border-radius: 24px;
  }

  .redirect-pulse {
    width: 64px;
    height: 64px;
  }
}
</style>

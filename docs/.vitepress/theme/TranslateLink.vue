<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const desktopReady = ref(false)
const mobileReady = ref(false)

let observer: MutationObserver | null = null

function checkTargets() {
  desktopReady.value = !!document.querySelector('.VPNavBarTranslations .VPMenu')
  mobileReady.value = !!document.querySelector('.VPNavScreenTranslations .list')
}

onMounted(() => {
  checkTargets()
  if (!mobileReady.value) {
    observer = new MutationObserver(() => {
      checkTargets()
      if (mobileReady.value) {
        observer?.disconnect()
        observer = null
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <Teleport v-if="desktopReady" to=".VPNavBarTranslations .VPMenu">
    <div class="vp-translate-desktop">
      <a
        href="https://hosted.weblate.org/engage/databackup/"
        target="_blank"
        rel="noopener noreferrer"
        class="vp-translate-link"
      >
        {{ theme.translateMenuLabel ?? 'Translate' }}
        <svg class="vp-translate-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 3h6v6"/>
          <path d="M10 14 21 3"/>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        </svg>
      </a>
    </div>
  </Teleport>

  <Teleport v-if="mobileReady" to=".VPNavScreenTranslations .list">
    <li class="item vp-translate-item-mobile">
      <a
        href="https://hosted.weblate.org/engage/databackup/"
        target="_blank"
        rel="noopener noreferrer"
        class="vp-translate-link-mobile"
      >
        {{ theme.translateMenuLabel ?? 'Translate' }}
        <svg class="vp-translate-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 3h6v6"/>
          <path d="M10 14 21 3"/>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        </svg>
      </a>
    </li>
  </Teleport>
</template>

<style>
.vp-translate-desktop {
  margin: 12px -12px 0;
  border-top: 1px solid var(--vp-c-divider);
  padding: 12px 12px 0;
}

.vp-translate-link {
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  transition: background-color 0.25s, color 0.25s;
}

.vp-translate-link:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.vp-translate-item-mobile {
  margin-top: 4px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 4px;
}

.vp-translate-link-mobile {
  display: flex;
  align-items: center;
  line-height: 32px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.vp-translate-link-mobile:hover {
  color: var(--vp-c-brand-1);
}

.vp-translate-icon {
  flex-shrink: 0;
  width: 11px;
  height: 11px;
  margin-left: 6px;
  opacity: 0.6;
}
</style>

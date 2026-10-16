<script setup>
import { ref, onMounted } from 'vue'
import Onboarding from './components/Onboarding.vue'
import MainView from './components/MainView.vue'

const STORAGE_ONBOARDING = 'isabi_onboarding_done'
const STORAGE_HISTORY = 'isabi_history'

const showOnboarding = ref(true)
const history = ref([])

onMounted(() => {
  try {
    const done = localStorage.getItem(STORAGE_ONBOARDING)
    showOnboarding.value = done !== 'true'
    const raw = localStorage.getItem(STORAGE_HISTORY)
    if (raw) {
      history.value = JSON.parse(raw)
    }
  } catch (e) {
    showOnboarding.value = true
    history.value = []
  }
})

function completeOnboarding() {
  showOnboarding.value = false
  try {
    localStorage.setItem(STORAGE_ONBOARDING, 'true')
  } catch (e) {
    // ignore
  }
}

function addToHistory(entry) {
  history.value.unshift({
    id: Date.now() + Math.random().toString(36).slice(2),
    ...entry,
    timestamp: new Date().toISOString()
  })
  if (history.value.length > 50) {
    history.value = history.value.slice(0, 50)
  }
  saveHistory()
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history.value))
  } catch (e) {
    // ignore
  }
}

function clearHistory() {
  history.value = []
  saveHistory()
}
</script>

<template>
  <Onboarding v-if="showOnboarding" @complete="completeOnboarding" />
  <MainView
    v-else
    :history="history"
    @add-history="addToHistory"
    @clear-history="clearHistory"
  />
</template>

<script setup>
import { ref } from 'vue'
import CoinFlip from './CoinFlip.vue'
import CastLots from './CastLots.vue'
import HistoryPanel from './HistoryPanel.vue'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-history', 'clear-history'])

const mode = ref(null) // null | 'coin' | 'lots' | 'history'

function openCoin() {
  mode.value = 'coin'
}

function openLots() {
  mode.value = 'lots'
}

function openHistory() {
  mode.value = 'history'
}

function backToHome() {
  mode.value = null
}

function onResult(entry) {
  emit('add-history', entry)
}
</script>

<template>
  <div class="main">
    <header class="header">
      <div class="container header-inner">
        <div class="brand" @click="backToHome" role="button" tabindex="0" @keydown.enter="backToHome">
          <span class="logo" aria-hidden="true">✦</span>
          <h1 class="title">IsabiCasta</h1>
        </div>
        <button
          v-if="mode !== null"
          class="btn btn-ghost back-btn"
          type="button"
          @click="backToHome"
          aria-label="Back to home"
        >
          ← Home
        </button>
      </div>
    </header>

    <main class="content container">
      <!-- Home -->
      <div v-if="mode === null" class="home">
        <p class="tagline">
          A simple way to decide when you are stuck. Inspired by the biblical practice of casting lots.
        </p>

        <div class="options">
          <button class="option-card" type="button" @click="openCoin">
            <span class="option-icon" aria-hidden="true">🪙</span>
            <span class="option-label">Flip a Coin</span>
            <span class="option-desc">Heads or Tails</span>
          </button>

          <button class="option-card" type="button" @click="openLots">
            <span class="option-icon" aria-hidden="true">📜</span>
            <span class="option-label">Cast Lots</span>
            <span class="option-desc">Choose from your options</span>
          </button>
        </div>

        <button
          v-if="history.length > 0"
          class="btn btn-ghost history-link"
          type="button"
          @click="openHistory"
        >
          View recent activity ({{ history.length }})
        </button>
      </div>

      <!-- Coin Flip -->
      <CoinFlip
        v-else-if="mode === 'coin'"
        @result="onResult"
        @back="backToHome"
      />

      <!-- Cast Lots -->
      <CastLots
        v-else-if="mode === 'lots'"
        @result="onResult"
        @back="backToHome"
      />

      <!-- History -->
      <HistoryPanel
        v-else-if="mode === 'history'"
        :history="history"
        @clear="emit('clear-history')"
        @back="backToHome"
      />
    </main>

    <footer class="footer">
      <div class="container">
        <p>Open source · Works entirely in your browser · No data leaves your device</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0.85rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo {
  font-size: 1.35rem;
  color: var(--color-accent);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.content {
  flex: 1;
  padding-top: 1.75rem;
  padding-bottom: 2rem;
}

.home {
  animation: fadeIn 0.35s ease;
}

.tagline {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  font-size: 1.05rem;
  max-width: 36ch;
  margin-left: auto;
  margin-right: auto;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 1.35rem 1.5rem;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  width: 100%;
}

.option-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.option-icon {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.option-label {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-primary);
}

.option-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.history-link {
  display: block;
  width: 100%;
  margin-top: 1.75rem;
  text-align: center;
  font-size: 0.95rem;
}

.footer {
  padding: 1rem 0 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

@media (min-width: 480px) {
  .options {
    gap: 1.15rem;
  }
}
</style>

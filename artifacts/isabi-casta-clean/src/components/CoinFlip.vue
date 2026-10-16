<script setup>
import { ref } from 'vue'

const emit = defineEmits(['result', 'back'])

const isFlipping = ref(false)
const result = ref(null) // 'Heads' | 'Tails' | null
const showResult = ref(false)

function secureRandom() {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] / (0xffffffff + 1)
}

function flip() {
  if (isFlipping.value) return
  isFlipping.value = true
  showResult.value = false
  result.value = null

  // Animation duration ~1.4s
  setTimeout(() => {
    const outcome = secureRandom() < 0.5 ? 'Heads' : 'Tails'
    result.value = outcome
    isFlipping.value = false
    showResult.value = true
    emit('result', {
      type: 'coin',
      result: outcome,
      options: ['Heads', 'Tails']
    })
  }, 1400)
}
</script>

<template>
  <div class="coin-view">
    <h2 class="section-title">Flip a Coin</h2>
    <p class="section-desc">A fair, random heads or tails.</p>

    <div class="coin-stage">
      <div
        class="coin"
        :class="{ flipping: isFlipping, 'show-result': showResult }"
        :data-side="result"
        aria-live="polite"
      >
        <div class="coin-face heads">H</div>
        <div class="coin-face tails">T</div>
      </div>
    </div>

    <div v-if="showResult && result" class="result-banner" key="result">
      <p class="result-label">The lot has fallen on</p>
      <p class="result-value">{{ result }}</p>
    </div>

    <div class="actions">
      <button
        class="btn btn-primary"
        type="button"
        :disabled="isFlipping"
        @click="flip"
      >
        {{ isFlipping ? 'Flipping…' : (showResult ? 'Flip Again' : 'Flip Coin') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.coin-view {
  animation: fadeIn 0.3s ease;
  text-align: center;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.35rem;
}

.section-desc {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.coin-stage {
  perspective: 800px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.coin {
  width: 110px;
  height: 110px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s;
}

.coin.flipping {
  animation: flip 1.4s ease-in-out;
}

.coin-face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  backface-visibility: hidden;
  border: 4px solid var(--color-accent);
  box-shadow: var(--shadow-md);
}

.heads {
  background: linear-gradient(145deg, #f0e6c8, #d4b978);
  color: var(--color-primary-dark);
}

.tails {
  background: linear-gradient(145deg, #e8e0d0, #c9b99a);
  color: var(--color-primary);
  transform: rotateY(180deg);
}

.coin.show-result[data-side="Heads"] {
  transform: rotateY(0deg);
}

.coin.show-result[data-side="Tails"] {
  transform: rotateY(180deg);
}

.result-banner {
  animation: scaleIn 0.4s ease;
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.result-label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.result-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
}

.actions {
  display: flex;
  justify-content: center;
}

@keyframes flip {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(1800deg); }
}
</style>

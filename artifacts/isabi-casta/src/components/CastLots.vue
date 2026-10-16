<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['result', 'back'])

const optionsText = ref('')
const selected = ref(null)
const isCasting = ref(false)
const hasResult = ref(false)
const error = ref('')

const validOptions = computed(() => {
  return optionsText.value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)
})

const canCast = computed(() => validOptions.value.length >= 2 && !isCasting.value)

function secureRandomIndex(length) {
  if (length <= 0) return 0
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % length
}

function cast() {
  error.value = ''
  const opts = validOptions.value
  if (opts.length < 2) {
    error.value = 'Please enter at least two options (one per line).'
    return
  }

  isCasting.value = true
  hasResult.value = false
  selected.value = null

  setTimeout(() => {
    const idx = secureRandomIndex(opts.length)
    selected.value = opts[idx]
    isCasting.value = false
    hasResult.value = true
    emit('result', {
      type: 'lots',
      result: selected.value,
      options: [...opts]
    })
  }, 700)
}

function editOptions() {
  hasResult.value = false
  selected.value = null
}
</script>

<template>
  <div class="lots-view">
    <h2 class="section-title">Cast Lots</h2>
    <p class="section-desc">Enter your options, one per line. The lot will choose one.</p>

    <div v-if="!hasResult" class="input-area">
      <label for="options" class="sr-only">Options (one per line)</label>
      <textarea
        id="options"
        v-model="optionsText"
        class="options-input"
        rows="6"
        placeholder="Option A&#10;Option B&#10;Option C"
        :disabled="isCasting"
        aria-describedby="options-help"
      />
      <p id="options-help" class="help-text">
        {{ validOptions.length }} valid option{{ validOptions.length === 1 ? '' : 's' }}
        <span v-if="validOptions.length > 0 && validOptions.length < 2" class="warn"> — need at least 2</span>
      </p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <button
        class="btn btn-primary cast-btn"
        type="button"
        :disabled="!canCast"
        @click="cast"
      >
        {{ isCasting ? 'Casting…' : 'Cast Lots' }}
      </button>
    </div>

    <div v-else class="result-area">
      <div class="result-banner" key="lots-result">
        <p class="result-label">The lot has fallen on</p>
        <p class="result-value">{{ selected }}</p>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" type="button" @click="cast">
          Cast Again
        </button>
        <button class="btn btn-secondary" type="button" @click="editOptions">
          Edit Options
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lots-view {
  animation: fadeIn 0.3s ease;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.35rem;
  text-align: center;
}

.section-desc {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  text-align: center;
}

.options-input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s ease;
}

.options-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(61, 90, 64, 0.15);
}

.options-input:disabled {
  opacity: 0.7;
}

.help-text {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0.5rem 0 1rem;
}

.help-text .warn {
  color: #b45309;
}

.error {
  color: #b91c1c;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.cast-btn {
  width: 100%;
}

.result-area {
  text-align: center;
}

.result-banner {
  animation: scaleIn 0.4s ease;
  margin-bottom: 1.75rem;
  padding: 1.5rem 1.25rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.result-label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  word-break: break-word;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 400px) {
  .result-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>

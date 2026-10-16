<script setup>
const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['clear', 'back'])

function formatTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}

function typeLabel(type) {
  return type === 'coin' ? 'Coin Flip' : 'Cast Lots'
}
</script>

<template>
  <div class="history-view">
    <div class="history-header">
      <h2 class="section-title">Recent Activity</h2>
      <button
        v-if="history.length > 0"
        class="btn btn-ghost clear-btn"
        type="button"
        @click="emit('clear')"
      >
        Clear all
      </button>
    </div>

    <p v-if="history.length === 0" class="empty">
      No activity yet. Flip a coin or cast lots to get started.
    </p>

    <ul v-else class="history-list" role="list">
      <li
        v-for="item in history"
        :key="item.id"
        class="history-item card"
      >
        <div class="item-top">
          <span class="item-type">{{ typeLabel(item.type) }}</span>
          <time class="item-time" :datetime="item.timestamp">
            {{ formatTime(item.timestamp) }}
          </time>
        </div>
        <p class="item-result">
          The lot fell on <strong>{{ item.result }}</strong>
        </p>
        <p v-if="item.type === 'lots' && item.options?.length" class="item-options">
          from {{ item.options.length }} options
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.history-view {
  animation: fadeIn 0.3s ease;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  gap: 0.75rem;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-primary);
}

.clear-btn {
  font-size: 0.9rem;
  color: #b91c1c;
}

.clear-btn:hover {
  background: rgba(185, 28, 28, 0.08);
  color: #991b1b;
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem 1rem;
}

.history-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  padding: 1rem 1.15rem;
}

.item-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.35rem;
  gap: 0.5rem;
}

.item-type {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-accent);
}

.item-time {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.item-result {
  font-size: 1rem;
  color: var(--color-text);
}

.item-result strong {
  color: var(--color-primary);
}

.item-options {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 0.2rem;
}
</style>

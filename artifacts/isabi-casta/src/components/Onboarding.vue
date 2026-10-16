<script setup>
import { ref } from 'vue'

const emit = defineEmits(['complete'])

const currentSlide = ref(0)

const slides = [
  {
    title: 'Welcome to IsabiCasta',
    body: 'A simple tool to help when you are indecisive. Inspired by the ancient biblical practice of casting lots — a way people used to make decisions and discern direction.',
    verse: null
  },
  {
    title: 'Jonah and the Sailors',
    body: 'When a great storm threatened the ship, the sailors cast lots to discover who was responsible. The lot fell on Jonah.',
    verse: 'Jonah 1:7 — “And they said to one another, ‘Come, let us cast lots, that we may know on whose account this evil has come upon us.’ So they cast lots, and the lot fell on Jonah.”'
  },
  {
    title: 'The Lord and the Lot',
    body: 'Scripture affirms that the outcome of the lot is under God’s sovereignty. Lots were used for decisions ranging from dividing land to selecting people for sacred duty.',
    verse: 'Proverbs 16:33 — “The lot is cast into the lap, but its every decision is from the Lord.”'
  },
  {
    title: 'The Day of Atonement',
    body: 'On the Day of Atonement, two goats were presented. Lots determined which goat would be offered to the Lord and which would be the scapegoat.',
    verse: 'Leviticus 16:8 — “And Aaron shall cast lots over the two goats, one lot for the Lord and the other lot for Azazel.”'
  },
  {
    title: 'Choosing Matthias',
    body: 'After Judas’ betrayal, the apostles sought a replacement. They prayed and cast lots; the lot fell on Matthias, who was numbered with the eleven.',
    verse: 'Acts 1:26 — “And they cast lots for them, and the lot fell on Matthias, and he was numbered with the eleven apostles.”'
  },
  {
    title: 'A Tool, Not a Prophecy',
    body: 'IsabiCasta uses fair randomness to help you choose when you are stuck. It does not claim that any particular result reveals God’s specific will for your life. Use it thoughtfully, alongside prayer, counsel, and wisdom.',
    verse: null
  }
]

function next() {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  } else {
    emit('complete')
  }
}

function prev() {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

function skip() {
  emit('complete')
}

function getStarted() {
  emit('complete')
}
</script>

<template>
  <div class="onboarding">
    <div class="onboarding-inner container">
      <div class="progress" role="progressbar" :aria-valuenow="currentSlide + 1" :aria-valuemin="1" :aria-valuemax="slides.length">
        <div
          v-for="(_, i) in slides"
          :key="i"
          class="dot"
          :class="{ active: i === currentSlide, past: i < currentSlide }"
        />
      </div>

      <Transition name="slide" mode="out-in">
        <div :key="currentSlide" class="slide card">
          <h1 class="slide-title">{{ slides[currentSlide].title }}</h1>
          <p class="slide-body">{{ slides[currentSlide].body }}</p>
          <blockquote v-if="slides[currentSlide].verse" class="verse">
            {{ slides[currentSlide].verse }}
          </blockquote>
        </div>
      </Transition>

      <div class="actions">
        <button
          v-if="currentSlide > 0"
          class="btn btn-ghost"
          type="button"
          @click="prev"
        >
          Previous
        </button>
        <div class="spacer" />
        <button
          class="btn btn-ghost"
          type="button"
          @click="skip"
        >
          Skip
        </button>
        <button
          v-if="currentSlide < slides.length - 1"
          class="btn btn-primary"
          type="button"
          @click="next"
        >
          Next
        </button>
        <button
          v-else
          class="btn btn-accent"
          type="button"
          @click="getStarted"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  background: linear-gradient(160deg, #f7f4ef 0%, #ebe4d8 100%);
}

.onboarding-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background 0.25s ease, transform 0.25s ease;
}

.dot.active {
  background: var(--color-primary);
  transform: scale(1.25);
}

.dot.past {
  background: var(--color-accent);
}

.slide {
  min-height: 280px;
  animation: fadeIn 0.35s ease;
}

.slide-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.slide-body {
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 1.05rem;
}

.verse {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  border-left: 3px solid var(--color-accent);
  padding-left: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
  line-height: 1.5;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.spacer {
  flex: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

@media (min-width: 480px) {
  .slide-title {
    font-size: 1.75rem;
  }
}
</style>

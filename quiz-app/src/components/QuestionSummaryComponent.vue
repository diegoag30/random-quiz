<template>
  <div class="summary-card">
    <p class="summary-question">{{ question }}</p>
    <ul class="summary-options">
      <li
        v-for="(option, index) in options"
        :key="index"
        class="summary-option"
        :class="{
          'summary-option--correct': option === answer,
          'summary-option--wrong': option === userAnswer && option !== answer,
          'summary-option--neutral': option !== answer && option !== userAnswer,
        }"
      >
        <span class="summary-option__badge">{{ String.fromCharCode(65 + index) }}</span>
        <span class="summary-option__text">{{ option }}</span>
        <span class="summary-option__icon" v-if="option === answer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="summary-option__icon" v-else-if="option === userAnswer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round"/>
          </svg>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    question: String,
    options: Array,
    answer: String,
    userAnswer: String,
  },
};
</script>

<style>
.summary-card {
  background-color: #242424;
  border: 1px solid #313538;
  border-radius: 16px;
  padding: 24px 24px 18px;
  margin-bottom: 12px;
  text-align: left;
}

.summary-question {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  color: #f0f0f0;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

.summary-options {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.summary-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
}

.summary-option--correct {
  background-color: rgba(40, 167, 69, 0.12);
  border-color: rgba(40, 167, 69, 0.35);
  color: #5dd879;
}

.summary-option--correct .summary-option__badge {
  background-color: rgba(40, 167, 69, 0.3);
  color: #5dd879;
}

.summary-option--wrong {
  background-color: rgba(220, 53, 69, 0.12);
  border-color: rgba(220, 53, 69, 0.35);
  color: #f07070;
  font-style: italic;
}

.summary-option--wrong .summary-option__badge {
  background-color: rgba(220, 53, 69, 0.3);
  color: #f07070;
}

.summary-option--neutral {
  background-color: transparent;
  color: #666;
}

.summary-option--neutral .summary-option__badge {
  background-color: #2e2e2e;
  color: #555;
}

.summary-option__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  font-style: normal;
}

.summary-option__text {
  flex: 1;
}

.summary-option__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
}

.summary-option__icon svg {
  width: 16px;
  height: 16px;
}
</style>

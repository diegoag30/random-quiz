<template>
  <div class="question-card">
    <h2 class="question-text">{{ question }}</h2>
    <div class="options-wrapper">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="option-button"
        :class="{ 'option-selected': selectedOption === option }"
        :disabled="!!selectedOption"
        @click="selectOption(option)"
      >
        <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: String,
    options: Array,
    answer: String,
  },
  data() {
    return {
      selectedOption: null,
    };
  },
  methods: {
    selectOption(option) {
      this.selectedOption = option;
      setTimeout(() => {
        this.selectedOption = null;
        this.$emit("option-selected", option);
      }, 300);
    },
  },
};
</script>

<style>
.question-card {
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 16px;
  padding: 32px 28px 24px;
  margin-bottom: 16px;
}

.question-text {
  font-family: 'Sora', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1.45;
  letter-spacing: -0.01em;
  margin-bottom: 28px;
}

.options-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #4a4a4a;
  border-radius: 12px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.15s ease, transform 0.12s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.option-button:not(:disabled):hover {
  background-color: #3d3d3d;
  border-color: #666;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.04);
}

.option-button:not(:disabled):active {
  transform: scale(0.97);
}

.option-button:disabled {
  cursor: default;
}

.option-button.option-selected {
  background-color: #2c4a6e;
  border-color: #4a90d9;
  transform: scale(0.97);
}

.option-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background-color: #4a4a4a;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: background-color 0.15s ease;
}

.option-selected .option-label {
  background-color: #4a90d9;
}
</style>

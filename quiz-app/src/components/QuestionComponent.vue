<template>
  <div class="question-card">
    <h2 class="question-text">{{ question }}</h2>
    <div class="options-wrapper">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="option-button"
        @click="selectOption(option)"
      >
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
  methods: {
    selectOption(option) {
      this.$emit("option-selected", option);
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
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 28px;
}

.options-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-button {
  padding: 12px 20px;
  border: 1px solid #4a4a4a;
  border-radius: 12px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
  transition: background-color 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
}

.option-button:hover {
  background-color: #444;
  border-color: #666;
}

.option-button:active {
  transform: scale(0.985);
  background-color: #3d3d3d;
}
</style>

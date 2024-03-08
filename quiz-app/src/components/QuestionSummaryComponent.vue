<template>
  <div class="question-summary">
    <h4>{{ question }}</h4>
    <ul class="options-list">
      <li
        v-for="(option, index) in options"
        :key="index"
        :class="{ correct: option === answer, wrong: option === userAnswer }"
      >
        {{ option }}
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
.question-summary {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 10px; /* Add some bottom margin to create space between cards */
  border-bottom: 2px solid #2c3e50; /* Add a bottom border between cards */
}

.options-list {
  padding: 0;
  list-style-type: none;
}

.options-list li {
  padding: 10px 0;
}

.options-list li:last-child {
  border-bottom: none; /* Remove bottom border for the last list item */
}

.correct {
  color: green;
  font-weight: bold;
}

.wrong {
  color: red;
  font-weight: bold;
}
</style>

<template>
  <div id="app">
    <h1>Quiz Game</h1>
    <div v-if="!quizStarted">
      <CsvReaderComponent @questions-loaded="setQuestions" />
      <input
        type="number"
        v-model.number="selectedQuestions"
        :min="1"
        :max="questions.length"
      />
      <button
        @click="startQuiz"
        :disabled="
          !questionsLoaded ||
          selectedQuestions < 1 ||
          selectedQuestions > questions.length
        "
      >
        Start Quiz
      </button>
    </div>
    <div v-else>
      <div v-if="currentQuestionIndex < selectedQuestions">
        <h3>{{ counterStore.count }} / {{ selectedQuestions }}</h3>
        <QuestionComponent
          :question="currentQuestion.question"
          :options="currentQuestion.options"
          :answer="currentQuestion.answer"
          @option-selected="checkAnswer"
        />
      </div>
      <div v-else>
        <h2>Quiz ended!</h2>
        <p>Your score: {{ score }} / {{ selectedQuestions }}</p>
        {{ counterStore.reset() }}
      </div>
    </div>
  </div>
</template>

<script>
import CsvReaderComponent from "./components/CsvReaderComponent.vue";
import QuestionComponent from "./components/QuestionComponent.vue";
import { useCounterStore } from "./counterStore";

export default {
  name: "App",
  setup() {
    const counterStore = useCounterStore();
    return { counterStore };
  },
  data() {
    return {
      questionsLoaded: false,
      quizStarted: false,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      selectedQuestions: 1, // Default to 1 question
    };
  },
  components: {
    QuestionComponent,
    CsvReaderComponent,
  },
  methods: {
    setQuestions(questions) {
      this.questions = questions;
      this.questionsLoaded = true;
    },
    shuffleQuestions() {
      // Shuffle questions array
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [
          this.questions[j],
          this.questions[i],
        ];
      }
    },
    startQuiz() {
      this.quizStarted = true;
      this.shuffleQuestions();
    },
    checkAnswer(selectedOption) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (selectedOption === currentQuestion.answer) {
        this.score++;
      }
      this.currentQuestionIndex++;
      this.counterStore.increment();
    },
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

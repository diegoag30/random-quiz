<template>
  <div id="app">
    <h1>Quiz Game</h1>
    <div v-if="!quizStarted">
      <input type="file" @change="loadQuestions" />
      <button @click="startQuiz" :disabled="!questionsLoaded">
        Start Quiz
      </button>
    </div>
    <div v-else>
      <div v-if="currentQuestionIndex < questions.length">
        <h2>{{ currentQuestion.question }}</h2>
        <div v-for="(option, index) in currentQuestion.options" :key="index">
          <button class="option-button" @click="checkAnswer(option)">
            {{ option }}
          </button>
        </div>
      </div>
      <div v-else>
        <h2>Quiz ended!</h2>
        <p>Your score: {{ score }} / {{ questions.length }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "App",
  data() {
    return {
      questionsLoaded: false,
      quizStarted: false,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
    };
  },
  methods: {
    loadQuestions(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const csvContent = reader.result;
          Papa.parse(csvContent, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
              this.questions = results.data.map((row) => ({
                question: row[0],
                answer: row[1],
                options: row.slice(2),
              }));
              this.questionsLoaded = true;
            },
          });
        };
        reader.readAsText(file);
      }
    },
    startQuiz() {
      this.quizStarted = true;
    },
    checkAnswer(selectedOption) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (selectedOption === currentQuestion.answer) {
        this.score++;
      }
      this.currentQuestionIndex++;
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

.option-button {
  display: block;
  margin-bottom: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #555;
  color: #fff;
  cursor: pointer;
  width: 100%;
}

.option-button:hover {
  background-color: #777;
}
</style>

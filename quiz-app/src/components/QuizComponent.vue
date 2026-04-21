<template>
  <div class="container text-center">
    <div class="row">
      <div class="col align-self-center">
        <h1 class="--bs-tertiary-color">Quiz Game</h1>
      </div>
    </div>
    <div class="setup-card" v-if="!quizStarted">
      <div class="row py-1 my-1">
        <CsvReaderComponent @questions-loaded="setQuestions" />
      </div>
      <div class="row align-items-center py-1 my-1">
        <div class="col">
          <label>Indique la cantidad de preguntas:</label>
        </div>
        <div class="col-md-auto">
          <input
            class="quiz-number-input"
            type="number"
            v-model.number="selectedQuestions"
            :min="1"
            :max="questions.length"
          />
        </div>
      </div>
      <div class="row justify-content-center mt-2">
        <button
          class="btn btn-success rounded-pill px-4"
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
    </div>
    <div v-else>
      <div v-if="currentQuestionIndex < selectedQuestions">
        <div class="progress-header">
          <span class="progress-label">{{ counterStore.count + 1 }} / {{ selectedQuestions }}</span>
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>
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
        <QuestionSummaryComponent
          v-for="(question, index) in wrongAnswerStore.wrongQuestions"
          :key="index"
          :question="question.question"
          :options="question.options"
          :answer="question.answer"
          :userAnswer="question.userAnswer"
        />
        <button class="btn btn-success rounded-pill mb-2" @click="resetQuiz">
          Reset
        </button>
        {{ counterStore.reset() }}
      </div>
    </div>
  </div>
</template>

<script>
import { useCounterStore } from "../counterStore";
import { useWrongAnswerStore } from "../wrongAnswerStore";
import CsvReaderComponent from "./CsvReaderComponent.vue";
import QuestionComponent from "./QuestionComponent.vue";
import QuestionSummaryComponent from "./QuestionSummaryComponent.vue";

export default {
  name: "QuizComponent",
  components: {
    CsvReaderComponent,
    QuestionComponent,
    QuestionSummaryComponent,
  },
  setup() {
    const counterStore = useCounterStore();
    const wrongAnswerStore = useWrongAnswerStore();

    return { counterStore, wrongAnswerStore };
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
  methods: {
    setQuestions(questions) {
      this.questions = questions;
      this.questionsLoaded = true;
      this.selectedQuestions = this.questions.length;
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
      } else {
        const wrongAnswerQuestion = currentQuestion;
        wrongAnswerQuestion.userAnswer = selectedOption;
        this.wrongAnswerStore.addWrongQuestion(wrongAnswerQuestion);
      }
      this.currentQuestionIndex++;
      this.counterStore.increment();
    },
    resetQuiz() {
      this.questionsLoaded = false;
      this.quizStarted = false;
      this.questions = [];
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.selectedQuestions = 1;
      this.counterStore.reset();
      this.wrongAnswerStore.resetWrongQuestions();
    },
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    progressPercent() {
      return Math.round((this.currentQuestionIndex / this.selectedQuestions) * 100);
    },
  },
};
</script>

<style>
.setup-card {
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 16px;
  padding: 32px 28px;
  text-align: left;
}

.quiz-number-input {
  background-color: #333;
  color: #fff;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  padding: 6px 10px;
  width: 80px;
  text-align: center;
}

.quiz-number-input:focus {
  outline: none;
  border-color: #28a745;
}

.progress-header {
  margin-bottom: 16px;
}

.progress-label {
  display: block;
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 6px;
}

.progress-bar-track {
  width: 100%;
  height: 6px;
  background-color: #333;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #28a745;
  border-radius: 999px;
  transition: width 0.3s ease;
}
</style>

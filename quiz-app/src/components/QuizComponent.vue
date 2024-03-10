<template>
  <div class="container text-center">
    <div class="row">
      <div class="col align-self-center">
        <h1>Quiz Game</h1>
      </div>
    </div>
    <div class="row justify-content-center upload-section" v-if="!quizStarted">
      <div class="column">
        <div class="row py-1 my-1">
          <CsvReaderComponent @questions-loaded="setQuestions" />
        </div>
        <div class="row align-items-center py-1 my-1">
          <div class="col">
            <label>Indique la cantidad de preguntas:</label>
          </div>
          <div class="col-md-auto">
            <input
              type="number"
              v-model.number="selectedQuestions"
              :min="1"
              :max="questions.length"
            />
          </div>
        </div>
        <div class="row justify-content-center">
          <button
            class="btn btn-success rounded-pill"
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
        <QuestionSummaryComponent
          v-for="(question, index) in wrongAnswerStore.wrongQuestions"
          :key="index"
          :question="question.question"
          :options="question.options"
          :answer="question.answer"
          :userAnswer="question.userAnswer"
        />
        <button class="btn btn-success rounded-pill" @click="resetQuiz">
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
  },
};
</script>

<style>
/* Add your styles here */
</style>

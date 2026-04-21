<template>
  <div class="container text-center">
    <div class="row">
      <div class="col align-self-center">
        <h1 class="--bs-tertiary-color">Quiz Game</h1>
      </div>
    </div>
    <div class="setup-card" v-if="!quizStarted">
      <CsvReaderComponent @questions-loaded="setQuestions" />
      <div class="setup-row">
        <label>Indique la cantidad de preguntas:</label>
        <input
          class="quiz-number-input"
          type="number"
          v-model.number="selectedQuestions"
          :min="1"
          :max="questions.length"
        />
      </div>
      <div class="setup-row setup-row--center">
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
        <div class="score-card" :class="scoreClass">
          <div class="score-ring">
            <span class="score-value">{{ score }}</span>
            <span class="score-divider">/</span>
            <span class="score-total">{{ selectedQuestions }}</span>
          </div>
          <p class="score-message">{{ scoreMessage }}</p>
        </div>
        <div v-if="wrongAnswerStore.wrongQuestions.length > 0" class="wrong-answers-section">
          <h5 class="wrong-answers-title">Review wrong answers</h5>
          <QuestionSummaryComponent
            v-for="(question, index) in wrongAnswerStore.wrongQuestions"
            :key="index"
            :question="question.question"
            :options="question.options"
            :answer="question.answer"
            :userAnswer="question.userAnswer"
          />
        </div>
        <button class="btn btn-success rounded-pill px-4 mb-4" @click="resetQuiz">
          Play again
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
    scoreClass() {
      const pct = this.score / this.selectedQuestions;
      if (pct >= 0.8) return "score-great";
      if (pct >= 0.5) return "score-ok";
      return "score-poor";
    },
    scoreMessage() {
      const pct = this.score / this.selectedQuestions;
      if (pct === 1) return "Perfect score!";
      if (pct >= 0.8) return "Great job!";
      if (pct >= 0.5) return "Not bad, keep practicing.";
      return "Keep going, you'll get there!";
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

.setup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.setup-row--center {
  justify-content: center;
  margin-top: 20px;
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

.score-card {
  border-radius: 20px;
  padding: 36px 28px 28px;
  margin-bottom: 24px;
  border: 2px solid transparent;
}

.score-great {
  background-color: #1a2e1a;
  border-color: #28a745;
}

.score-ok {
  background-color: #2e2a10;
  border-color: #d4a017;
}

.score-poor {
  background-color: #2e1a1a;
  border-color: #dc3545;
}

.score-ring {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.score-value {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
}

.score-great .score-value { color: #28a745; }
.score-ok .score-value { color: #d4a017; }
.score-poor .score-value { color: #dc3545; }

.score-divider {
  font-size: 2rem;
  color: #888;
}

.score-total {
  font-size: 2rem;
  color: #aaa;
}

.score-message {
  font-size: 1.1rem;
  color: #ccc;
  margin: 0;
}

.wrong-answers-section {
  margin-bottom: 20px;
}

.wrong-answers-title {
  text-align: left;
  color: #aaa;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}
</style>

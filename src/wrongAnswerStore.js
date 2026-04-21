import { defineStore } from "pinia";

export const useWrongAnswerStore = defineStore("questions", {
  state: () => ({
    wrongQuestions: [],
  }),
  actions: {
    addWrongQuestion(question) {
      this.wrongQuestions.push(question);
    },
    resetWrongQuestions() {
      this.wrongQuestions = [];
    },
  },
});

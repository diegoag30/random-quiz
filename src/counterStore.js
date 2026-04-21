// counterStore.js
import { defineStore } from "pinia";

export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
    reset() {
      this.count = 0;
    },
  },
});

<template>
  <div>
    <h2>{{ question }}</h2>
    <div v-for="(option, index) in options" :key="index">
      <button class="option-button" @click="selectOption(option)">
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

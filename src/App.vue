<template>
  <div id="app" class="d-flex flex-column justify-content-center">
    <QuizComponent />
  </div>
</template>

<script>
import QuizComponent from "./components/QuizComponent.vue";

export default {
  name: "App",
  components: {
    QuizComponent,
  },
};
</script>

<style>
body {
  height: 100%;
  background-color: #1e1e1e;
}
#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #1e1e1e;
  color: #fff;
  padding: 40px 16px 60px;
  max-width: 780px;
  margin: 0 auto;
}
html,
.fill-height {
  min-height: 100%;
  height: auto !important;
  height: 100%;
}
</style>

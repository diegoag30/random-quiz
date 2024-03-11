<template>
  <head>
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <div id="app d-flex flex-column justify-content-center">
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html,
body {
  height: 100%;
}
.fill-height {
  min-height: 100%;
  height: auto !important; /* cross-browser */
  height: 100%; /* cross-browser */
}
</style>

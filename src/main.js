import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";

const app = createApp(App);

// Use Pinia in your app
app.use(pinia);

app.mount("#app");

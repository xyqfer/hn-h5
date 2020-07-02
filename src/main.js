import "framework7/css/framework7.bundle.css";
import "./css/app.css";
import Vue from "vue";
import Framework7 from "framework7/framework7.esm.bundle";
import Framework7Vue from "framework7-vue";
import App from "./App.vue";

Framework7.use(Framework7Vue);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

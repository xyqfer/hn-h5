import Home from "./pages/Home.vue";
import Item from "./pages/Item.vue";

export default [
  {
    path: "/",
    component: Home
  },
  {
    path: "/item/:id",
    component: Item
  }
];

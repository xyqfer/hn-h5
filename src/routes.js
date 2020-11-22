import Home from "./pages/Home.vue";
import Story from "./pages/Story.vue";
import Random from "./pages/Random.vue";
import AskRandom from "./pages/AskRandom.vue";
import Item from "./pages/Item.vue";

export default [
  {
    path: "/",
    component: Home
  },
  {
    path: "/story",
    component: Story
  },
  {
    path: "/random",
    component: Random
  },
  {
    path: "/ask-random",
    component: AskRandom
  },
  {
    path: "/item/:id",
    component: Item
  }
];

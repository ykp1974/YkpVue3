import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import List from "@/views/ListComp.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/list",
    name: "ListComp",
    component: List,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Playlist from '../views/Playlist.vue'
import Searchlist from '../views/Searchlist.vue'
import Sharelist from '../views/Sharelist.vue'
// import Login from '../views/Login.vue'
import Mylist from '../views/Mylist.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Playlist',
    name: 'Playlist',
    component: Playlist
  },
  {
    path: '/Searchlist',
    name: 'Searchlist',
    component: Searchlist
  },
  {
    path: '/Sharelist',
    name: 'Sharelist',
    component: Sharelist
  },
  // {
  //   path: '/Login',
  //   name: 'Login',
  //   component: Login
  // },
  {
    path: '/Mylist',
    name: 'Mylist',
    component: Mylist
  }
]

const router = new VueRouter({
  routes
})

export default router

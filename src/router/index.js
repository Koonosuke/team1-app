import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue'
import User from '../views/User.vue'
import Menu from '../views/templates/Menu.vue'
import First from '../views/First.vue'
import Register from '../views/Register.vue'
import ElderRegister from '../views/ElderRegister.vue'
import GardianRegister from '../views/GardianRegister.vue'
import FamilyCodePage from '../views/FamilyCodePage.vue'
import HomeElder from '../views/HomeElder.vue'
import ElderLogin from '../views/ElderLogin.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
      {
      path: '/',
      name: 'First',
      component: First,
      meta: {
        title: 'First'
      }
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/GardianRegister',
      name: 'GardianRegister',
      component: GardianRegister,
      meta: {
        title: 'GardianRegister'
      }
    },
    {
      path: '/FamilyCodePage',
      name: 'FamilyCodePage',
      component: FamilyCodePage,
      meta: {
        title: 'Family Code'
      }
    },
     {
      path: '/ElderRegister',
      name: 'ElderRegister',
      component: ElderRegister,
      meta: {
        title: 'ElderRegister'
      }
    },
     {
      path: '/Register',
      name: 'Register',
      component: Register,
      meta: {
        title: 'Register'
      }
    },
    {
      path:'/login',
      name:'Login',
      component: Login,
      meta:{
        title: 'Login'
      }
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile,
      meta:{
        title: 'Profile'
      }
      
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {
        title: 'User'
      }
    },
    {
      path: '/homeElder',
      name: 'HomeElder',
      component: HomeElder,
      meta: {
        title: 'HomeElder'
      }
    },
    {
      path: '/ElderLogin',
      name: 'ElderLogin',
      component: ElderLogin,
      meta: {
        title: 'ElderLogin'
      }
    },
    
    
    
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router

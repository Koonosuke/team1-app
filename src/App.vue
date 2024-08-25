<template>
  <div id="app">

   <Menu v-if="$route.name !== 'First' && $route.name !== 'Register' && $route.name !== 'ElderRegister' && $route.name !== 'GardianRegister' && $route.name !== 'Login' && $route.name !== 'FamilyCodePage' && $route.name !== 'HomeElder'&& $route.name !== 'ElderLogin'"/>


    
    <router-view/>
  </div>
</template>

<script>
  import {RouterView} from 'vue-router'
  import Menu from '@/views/templates/Menu.vue';
  
  export default{
  name: 'App',
  components:{
  Menu
  },
  
  
  
  }
  
</script>

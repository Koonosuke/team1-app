<template>
  <div id="app">
    <Menu v-if="$route.name !== 'First'"/>
    
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

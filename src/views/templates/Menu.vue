<template>
  <div class="ui secondary pointing green inverted massive menu">
    <!-- 基本的なコンテンツはここに記載する -->
    <router-link active-class="active" class="item" exact to="/Home">リマインダー設定</router-link>
    <router-link class="item" to="/user">状況確認</router-link>
    <router-link class="item" to="/profile">リマインダー一覧</router-link>
    <div class="right menu">
      <a @click="logout" class="item">Logout</a>
    </div>
  </div>
</template>


<!--リマインダー設定=Home
    状況確認=User
    リマインダー一覧=Profile-->

<script>
    
    
    export default{
    name: 'Menu',
    computed:{
    },
    methods: {
    logout(){
    window.localStorage.clear();
    this.$router.push({name: "Login"});
    }
    },
    };
    
    
    
</script>
<style scoped>
    
</style>
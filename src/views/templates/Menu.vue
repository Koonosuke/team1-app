<template>
  <div class="ui secondary pointing green inverted massive menu">
    <!-- 基本的なコンテンツはここに記載する -->
    <router-link active-class="active" class="item" exact to="/Home">
      <i class="bell icon"></i>
      リマインダー設定
    </router-link>
    <router-link active-class="active" class="item" to="/user">
      <i class="comments icon"></i>
      状況確認
    </router-link>
    <router-link active-class="active" class="item" to="/profile">
      <i class="file icon"></i>
      リマインダー一覧
    </router-link>
    <div active-class="active" class="right menu">
      <a @click="logout" class="item">
        <i class="sign-out icon"></i>
        Logout
      </a>
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
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("familycode");
        this.$router.push({name: "Login"});
      }
    },
  };
    
    
    
</script>
<style scoped>
    
</style>
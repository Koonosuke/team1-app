<template>
  <div>
    <div class="ui main container">
     <h1 class="ui header">見守り人ログイン</h1>
      <div class="ui segment">
        <h1>見守り人ログイン</h1>
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <i class="user icon"></i>
            <input type="text" placeholder="ID" v-model="user.userId">
          </div>
          
          <div class="field">
            <i class="lock icon"></i>
            <input type="password" placeholder="Password" v-model="user.password">
          </div>
           <button class="ui huge green fluid button" type="submit">
        ログイン
        </button>
        </form>
      </div>
     
    </div>
    <button @click="redirectToElderLogin()" class="ui huge gray fluid button" type="submit">

    高齢者ログインはこちら

    </button>
    <button @click="redirectToRegister()" class="ui huge gray fluid button" type="submit">
    新規登録
    </button>
  </div>
</template>

<script>
// 必要なものはここでインポートします
import { baseUrl } from "@/assets/config.js";
// @は/srcの同じ意味です
// import something from '@/components/something.vue';

export default {
  name: 'Login',
 
  components: {
    // 読み込んだコンポーネント名をここに記述する
  },
 
  data() {
    // Vue.jsで使う変数はここに記述する
    return {
    user: {
        userId: null,
        password: null,
      },
    };
  },
 
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },
 
  methods: {
    // Vue.jsで使う関数はここで記述する
   redirectToRegister() {
      this.$router.push({ path: "/Register" }); // 新規登録ページにリダイレクト
    },
    

   redirectToElderLogin(){
     this.$router.push({ path: "/ElderLogin" });
    },
    
   
   async submit() {

    redirectToElderLogin(){
     this.$router.push({ path: "/ElderLogin" });
    },
    
 async submit() {
    const reqBody = {
        userId: this.user.userId,
        password: this.user.password
    };

    try {
      const res = await fetch(baseUrl + "/user/gardian/login", {
        method: "POST",
        body: JSON.stringify(reqBody),
      });

      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {};


      try {
        const res = await fetch(baseUrl + `/user/gardian/login?userId=${this.user.userId}&password=${this.user.password}`, {
          method: "GET",
        });
  
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
  
        if (!res.ok) {
          const errorMessage = "userIdもしくはpasswordが正しくありません"?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
  
        // トークンとユーザーIDを保存
          window.localStorage.setItem("userId", jsonData.userId);
          window.localStorage.setItem("familycode", jsonData.familycode);
  
        // 成功時の処理
        this.$router.push({ path: "/Home" }); // ホームページにリダイレクト
      } catch (e) {
        console.error(e);
        // エラー時の処理
        alert(`ログインエラー: ${e.message}`);
      }


      // トークンとユーザーIDを保存

      // 成功時の処理
      this.$router.push({ path: "/Home" }); // ホームページにリダイレクト
      
    } catch (e) {
      console.error(e);
      // エラー時の処理
      alert(`ログインエラー: ${e.message}`);
    }
  }
}

}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述します */
.ui.header{
text-align: center;
maegin-botton: 20px;
}
</style>
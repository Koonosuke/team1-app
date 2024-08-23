<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <i class="user icon"></i>
            <input v-model="user.userId" type="text" placeholder="ID"  required disabled>
          </div>
          
          <div class="field">
            <i class="lock icon"></i>
            <input v-model="user.password" type="password" placeholder="Password" >
          </div>
          
          <div class="field" >
            <i class="tag icon"></i>
            <input v-model="user.nickname" type="text" placeholder="Nickname" >
          </div>
          
          <div class="field">
            <i class="calendar icon"></i>
            <input  v-model.number="user.age" type="text" placeholder="Age">
          </div>
           <button class="ui huge green fluid button" type="submit">
       更新
        </button>
        </form>
      </div>
     
    </div>
    <button @click="deleteUser" class="ui huge gray fluid button" type="submit">
   退会
    </button>
  </div>
</template>

<script>
// 必要なものはここでインポートする
import {baseUrl} from '@/assets/config.js';
// @は/srcの同じ意味です
// import something from '@/components/something.vue';



 
export default {
  name: 'Profile',
 
  components: {
    // 読み込んだコンポーネント名をここに記述する
  },
 
  data() {
    return {
    user: {
        userId: window.localStorage.getItem("userId"),
        password: null,
        nickname: null,
        age: null,
      },
    };
  },
 
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },
 
  methods: {
    async deleteUser() {
      const headers = {"Authorization": "mtiToken"};
      try{
        const res = await fetch(`${baseUrl}/user?userId=${this.user.userID}`, {
          method: "DELETE",
          headers
        })  
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
        this.$router.push({name: "Login"})
      } catch(e){
      }
    },
    async submit() {
      const headers = {"Authorization": "mtiToken"};
      const { userId, password, nickname, age } = this.user;
      const reqBody = {
        userId,
        password,
        nickname,
        age
      };
      try {
        const res = await fetch(baseUrl + `/user`, {
          method: "PUT",
          body: JSON.stringify(reqBody),
          headers
        });
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
        console.log(jsonData);
      } catch(e) {
        console.error("エラーが発生しました:", e);
      }
    }
  },
 
  
  created: async function() {
    const headers = {"Authorization" : "mtiToken"}
    try {
     const res = await fetch(baseUrl + `/user?userId=${this.user.userId}`, {
        method: 'GET',
        headers
      });
      const text = await res.text()
      const jsonData = text ? JSON.parse(text) : {}
      if (!res.ok) {
        const errorMessage = jsonData.message ?? "エラーメッセージがありません"
        throw new Error(errorMessage)
      }
      this.user.nickname = jsonData.nickname
      this.user.age = jsonData.age
    } catch(e){
 
    }
  }
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>

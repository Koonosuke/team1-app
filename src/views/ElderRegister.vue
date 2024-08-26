<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <!-- ここにセグメントの中身を記述する -->
        <h1>高齢者登録</h1>
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="elder.userId" />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="nickname" v-model="elder.nickname" />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="familycode" v-model="elder.familycode" />
            </div>
          </div>
          <button class="ui green button" type="submit">
            <i class="user circle icon"></i>
            登録
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'ElderRegister',

  data() {
    return {
      elder: {
        userId: null,
        nickname: null,
        familycode: this.$route.query.familycode
      },
    };
  },

  methods: {
    async submit() {
      const reqBody = {
        userId: this.elder.userId,
        nickname: this.elder.nickname,
        familycode: this.elder.familycode,
      };

      try {
        const res = await fetch(baseUrl + "/user/elder", {
          method: "POST",
          body: JSON.stringify(reqBody),
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage =
            jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
        
        this.$router.push({ 
          name: 'Home'
        });
        

        window.localStorage.setItem("userId", jsonData.userId);
        window.localStorage.setItem("familycode", jsonData.familycode);
        window.localStorage.removeItem("responses");



        // 成功時の処理
        console.log(jsonData);
        // 登録成功後、別のページにリダイレクトするなど
      } catch (e) {
        console.error(e);
        // エラー時の処理
      }
    },
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>

<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <!-- ここにセグメントの中身を記述する -->
        <h1>保護者登録</h1>
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="guardian.userId" />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" placeholder="Password" v-model="guardian.password" />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="relation" v-model="guardian.relation" />
            </div>
          </div>
          <button class="ui green button" type="submit">
            新規登録
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'GardianRegister',

  data() {
    return {
      guardian: {
        userId: null,
        password: null,
        relation: null
      },
      familyCode: null,
    };
  },

  methods: {
    async submit() {
      const reqBody = {
        userId: this.guardian.userId,
        password: this.guardian.password,
        relation: this.guardian.relation,
      };

      try {
        const res = await fetch(baseUrl + "/user/gardian", {
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
          name: 'FamilyCodePage',
          query: { familycode: jsonData.familycode }
        });
        
        window.localStorage.setItem("userId", jsonData.userId)
        window.localStorage.setItem("familycode", jsonData.familycode)

        // 成功時の処理
        window.localStorage.setItem("userId", jsonData.userId);
        window.localStorage.setItem("familycode", jsonData.familycode);
        console.log(jsonData);
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

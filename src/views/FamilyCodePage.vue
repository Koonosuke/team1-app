<template>
  <div class="ui main container">
    <div class="ui message">
      <h2>Family Code</h2>
      <p>以下のFamily Codeは記録して覚えてください。</p>
      <p>高齢者端末での登録を進めてください</p>
      <p><h2>{{ familyCode }}</h2></p>
    </div>
    <router-link :to="{ name: 'ElderRegister', query: { familycode: familyCode } }" class="ui button">
      高齢者登録
    </router-link>
  </div>
</template>

<script>
export default {
  name: "FamilyCodePage",
  data() {
    return {
      familyCode: null,
    };
  },
  created() {
    // familyCodeをクエリパラメータから取得する
    this.familyCode = this.$route.query.familycode;
  }
};
</script>

<style scoped>
/* スタイルを調整する場合はここに追加します */
</style>
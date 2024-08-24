<template>
  <div id="app">
    <div class="main-container">
      <h1 class="animated-title">
        <span v-for="(letter, index) in title.split('')" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
          {{ letter }}
        </span>
      </h1>
      <label>どちらで登録しますか</label>
      <label>初めての人は見守り人から登録してください</label>
      <button @click="goToGardianRegiter">見守り人</button>
      <button @click="goToElderRegiter">高齢者</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '新規登録'
    };
  },
  methods: {
    goToElderRegiter() {
      this.$router.push('/ElderRegister');
    },
    goToGardianRegiter() {
      this.$router.push('/GardianRegister');
    }
  }
}
</script>



<style>
body {
    background-color: #FFFFE0; /* 明るい黄色 */
}
label {
    display: block; /* 各ラベルをブロック表示 */
    font-size: 18px; /* ラベルのフォントサイズを大きく */
    font-weight: bold; /* ラベルを太字に */
    margin-bottom: 10px; /* ラベル間の余白 */
    color: #000000; /* ラベルの色を黒に */
}

label.description {
    font-size: 20px; /* サブタイトルのフォントサイズを少し小さく */
    font-weight: normal; /* サブタイトルは通常の太さ */
    margin-top: 0; /* サブタイトルの上部の余白をゼロに */
    color: #000000; /* サブタイトルの色を黒に */
}
button {
    background-color: #2E8B57; /* より鮮やかな緑 */
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px; /* さらに丸みを帯びたデザイン */
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    display: inline-flex; /* フレックスボックスを使用 */
    align-items: center; /* 垂直方向に中央揃え */
    justify-content: center; /* 水平方向に中央揃え */
    width: 200px; /* ボタンの幅を指定 */
    height: 50px; /* ボタンの高さを指定 */
    text-align: center; /* テキストを中央に配置 */
}

button:hover {
    background-color: #3CB371; /* ホバー時に少し明るい緑 */
    transform: scale(1.05); /* ホバー時に少し拡大 */
}

</style>

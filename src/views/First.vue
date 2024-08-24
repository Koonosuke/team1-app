<template>
  <div id="app">
    <div class="main-container">
      <h1 class="animated-title">
        <span v-for="(letter, index) in title.split('')" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
          {{ letter }}
        </span>
      </h1>
      <button @click="goToHome">スタート</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'ElderWatch'
    };
  },
  methods: {
    goToHome() {
      this.$router.push('/Login');
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.animated-title {
  display: inline-block;
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
  white-space: nowrap;
}
.animated-title span {
  display: inline-block;
  opacity: 0;
  transform: translateY(-100%);
  animation: drop 0.5s forwards;
}
@keyframes drop {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

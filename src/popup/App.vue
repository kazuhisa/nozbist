<template>
  <div>
    <h3>Nozbe Chrome Extension</h3>
    <button v-on:click="login">Login</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    login(event) {
      chrome.identity.launchWebAuthFlow(
        {
          url: 'https://api.nozbe.com:3000/login?client_id=c09481e1e01e60cc585ba6631277980b6f17dcda',
          interactive: true,
        },
        responseUrl => {
          // 後述
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

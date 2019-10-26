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
        function(redirect_url) {
          let params = new URLSearchParams(redirect_url.match(/\?.*/)[0].substring(1));
          console.log(params.get('access_token'));
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

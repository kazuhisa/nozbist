<template>
  <div>
    <div v-if="access_token">
      <fieldset>
        <label for="titleField">title</label>
        <input v-model="title" type="text" id="titleField" />
        <label for="commentField">comment</label>
        <textarea v-model="url" id="commentField"> </textarea>
        <button type="button" name="addRecord">
          Adding a new task.
        </button>
      </fieldset>
    </div>
    <div v-else>
      <h3>Nozbe Chrome Extension</h3>
      <button v-on:click="login">Login</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      title: '',
      url: '',
    };
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
          localStorage.setItem('access_token', params.get('access_token'));
        }
      );
    },
    access_token() {
      localStorage.getItem('access_token');
    },
    set_title(tab) {
      this.title = tab[0].title;
      this.url = tab[0].url;
    },
  },
  created() {
    chrome.tabs.query({ active: true, currentWindow: true }, this.set_title);
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

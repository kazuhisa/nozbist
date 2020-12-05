<template>
  <div>
    <div v-if="accessToken()">
      <fieldset>
        <label for="titleField">Title</label>
        <input v-model="title" type="text" id="titleField" />
        <label for="commentField">Comment</label>
        <textarea v-model="comment" id="commentField"> </textarea>
        <button v-on:click="postTask" type="button" name="addRecord">
          Add a new task
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
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      comment: '',
    };
  },
  methods: {
    login(event) {
      chrome.identity.launchWebAuthFlow(
        {
          url: 'https://api.nozbe.com:3000/login?client_id=c09481e1e01e60cc585ba6631277980b6f17dcda',
          interactive: true,
        },
        redirect_url => {
          let params = new URLSearchParams(redirect_url.match(/\?.*/)[0].substring(1));
          localStorage.setItem('access_token', params.get('access_token'));
        }
      );
    },
    accessToken() {
      return localStorage.getItem('access_token');
    },
    postTask() {
      let params = new URLSearchParams();
      params.append('name', encodeURI(this.title));
      axios
        .post('https://api.nozbe.com:3000/task', params, {
          headers: {
            Authorization: this.accessToken(),
          },
        })
        .then(this.postComment)
        .catch(result => {
          console.log(result);
        });
    },
    postComment(response) {
      let params = new URLSearchParams();
      params.append('task_id', response.data.id);
      params.append('type', 'markdown');
      params.append('body', encodeURI(this.comment));
      axios
        .post('https://api.nozbe.com:3000/task/comment', params, {
          headers: {
            Authorization: this.accessToken(),
          },
        })
        .then(() => {
          window.close();
        })
        .catch(result => {
          console.log(result);
        });
    },
  },
  created() {
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
      this.title = tab[0].title;
      this.comment = tab[0].url;
    });
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

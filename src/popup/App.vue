<template>
  <div>
    <div v-if="accessToken()">
      <fieldset>
        <label for="titleField">Title</label>
        <input v-model="title" type="text" id="titleField" />
        <label for="dateField">Date</label>
        <select v-model="dateField" name="dateField" id="dateField">
          <option v-for="(op, i) in dateOptions" :key="i" :value="op.match">{{ op.match }}</option>
        </select>
        <label for="commentField">Comment</label>
        <textarea v-model="comment" id="commentField"> </textarea>
        <button v-on:click="postTask" type="button" name="addRecord">
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
import Vue from 'vue';
import axios from 'axios';
import dateParser from 'node-date-parser';
import { findDates as extractDate } from 'find-dates';

export default {
  data() {
    return {
      title: '',
      comment: '',
      dateField: '',
      dateOptions: null,
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
      params.append('dateTime', dateParser(this.dateField));
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
      let dates = null;
      var bkg = chrome.extension.getBackgroundPage();
      try {
        chrome.tabs.sendMessage(tab[0].id, { type: 'from_popup' }, {}, msg => {
          bkg.console.log(msg);
          msg = msg || {};
          dates = extractDate(msg);
          bkg.console.log(dates);
          this.dateOptions = dates;
          this.dateField = dates[0].match;
        });
      } catch (e) {
        bkg.console.log('tab error', e);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

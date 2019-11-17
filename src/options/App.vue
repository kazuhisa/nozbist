<template>
  <div>
    <h3>Nozbist is Nozbe chrome extension.</h3>
    <div v-if="access_token()">
      <button v-on:click="logout">logout</button>
    </div>
    <div>
      Author: Kazuhisa Yamamoto
    </div>
    <div>Github: <a href="https://github.com/kazuhisa/nozbist">kazuhisa/nozbist</a></div>
    <div>
      Icons made by
      <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a>
      from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    access_token() {
      return localStorage.getItem('access_token');
    },
    logout() {
      localStorage.removeItem('access_token');
      window.close();
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>

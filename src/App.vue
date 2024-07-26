<template>
  <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <!-- <router-link :to="{ name: 'ListComp', query: { profileId: '2234' } }">ListComp</router-link> -->
      <router-link :to="{ name: 'ListComp', params: { message: 'Thai ladyboy tag teamed by a white shemale and a guy - aShemaletube.com' } }">ListComp</router-link>
  </div>
  <router-view />
  <input v-model="message">
</template>

<template>
  <div id="nav">
      <router-link :message="message" to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <!-- <router-link :to="{ name: 'ListComp', query: { profileId: '2234' } }">ListComp</router-link> -->
      <router-link :to="{ name: 'ListComp', params: { message: this.message } }">ListComp</router-link>
  </div>
  <router-view @updateMessage="updateMessage" />
  <input v-model="message">
</template>
<script>
export default {
    data() {
        return {
            message: "" // 子コンポーネントから渡されるデータ
        };
    },
    methods: {
      updateMessage(newMessage) {
        this.message = newMessage;
      }
    }    
};
</script>
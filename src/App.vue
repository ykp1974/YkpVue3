<template>
  <div id="nav">
    <router-link :message="message" to="/">Home</router-link> |
    <router-link :to="{ name: 'ListComp', params: { message: this.message, outputTexts: this.outputTexts } }">Order</router-link> | 
    <router-link to="/about">About</router-link>
  </div>
  <router-view @updateMessage="updateMessage" @updateOutputTexts="updateOutputTexts" />
  <input v-model="message">
</template>

<script>
export default {
  data() {
    return {
      message: "", // 子コンポーネントから渡されるデータ
      outputTexts: [] // Home.vueから渡されるoutputTexts
    };
  },
  methods: {
    updateMessage(newMessage) {
      this.message = newMessage;
    },
    updateOutputTexts(newOutputTexts) {
      console.log('this.outputTexts@@-->'+JSON.stringify(newOutputTexts))
      this.message = newOutputTexts.map(item => item.text).join(', ');
      this.outputTexts = newOutputTexts.map(item => item.text);
    }
  }    
};
</script>
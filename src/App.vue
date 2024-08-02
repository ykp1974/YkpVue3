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
      console.log('this.outputTexts@@-->'+JSON.stringify(newOutputTexts));
      // OFFの場合は削除
      this.outputTexts = newOutputTexts.filter(item => item.status !== 'OFF').map(item => item.text);
    }
  }    
};
</script>
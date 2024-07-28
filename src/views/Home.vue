<template>
    <h1>Home Page</h1>
    <template v-for="link in data.parVals2" :key="link.text">
      <button v-on:click="handleButtonClick" :test="link.text">{{ link.text }}</button>
</template>
<div>
    <span id="spn1">表示用のテキスト</span>
</div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'AppVue',
  props: {
    message: String
  },
  data() {
    return {
      data: {
        parVals2: [
        ]
      }
    }
  },
  mounted : function(){
    axios.get('/test2.json')
      .then(response => {
        response.data.forEach(element => {
          this.data.parVals2.push({
            text: element.text,
            value: element.value
          });
        });
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  },
  methods: {
    handleButtonClick(event) {
      console.log('message->'+this.message);
      const buttonLabel = event.target.getAttribute('test');
      const outputText = `${buttonLabel}がクリックされました！`;
      console.log(outputText);
      this.$emit('updateMessage', outputText);
      document.getElementById('spn1').textContent = outputText;
    }
  }
}
</script>

<template>
    <h1>Home Page</h1>
    <template v-for="link in data.parVals2" :key="link.text">
      <button v-on:click="handleButtonClick" :test="link.text">{{ link.text }}</button>
    </template>
    <span id="spn1">表示用のテキスト</span>
</template>
<script>
import axios from 'axios';
export default {
  name: 'AppVue',
  props: {
    msg: String
  },
  data() {
    return {
      data: {
        title: "Vue.js アプリケーションへようこそ！",
        links: [
          {
            text: "コア ドキュメント",
            href: "https://vuejs.org"
          },
          {
            text: "フォーラム",
            href: "https://forum.vuejs.org"
          },
          {
            text: "Community Chat",
            href: "https://chat.vuejs.org"
          },
          ],
        parVals: [
          {
            text: "123パラメータ1",
            value: "値1"
          },
          {
            text: "456パラメータ2",
            value: "値2"
          },
        ],
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
      const buttonLabel = event.target.getAttribute('test');
      const outputText = `${buttonLabel}がクリックされました！`;
      console.log(outputText);
      document.getElementById('spn1').textContent = outputText;
    }
  }
}
</script>

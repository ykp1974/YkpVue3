<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <h1>Home Page</h1>
  <div class="button-container">
    <template v-for="link in data.parVals2" :key="link.text">
      <button 
        v-on:click="handleButtonClick(link)" 
        :class="{'large-button btn': true, 'active': link.active}" 
        class="large-button btn">
        {{ link.text }}
      </button>
    </template>
  </div>
  <div>
    <span id="spn1">表示用のテキスト</span>
  </div>
</template>

<script>
import axios from 'axios';
import { useButtonStore } from './store';

export default {
  name: 'AppVue',
  props: {
    message: String
  },
  data() {
    return {
      data: {
        parVals2: [],
      }
    };
  },
  mounted() {
    const buttonStore = useButtonStore();
    axios.get('/test2.json')
      .then(response => {
        this.data.parVals2 = response.data.map(element => {
          const isActive = buttonStore.outputTexts.some(item => item.text === element.text && item.status === 'ON');
          return {
            text: element.text,
            value: element.value,
            active: isActive // ストアの状態を反映
          };
        });
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  },
  methods: {
    handleButtonClick(link) {
      const buttonStore = useButtonStore();
      link.active = !link.active; // ON/OFFの切り替え
      buttonStore.toggleButton(link.text);

      // outputTextsを更新
      this.outputTexts = buttonStore.outputTexts.map(item => item.text);
    
      console.log("buttonStore.outputTexts=>", JSON.stringify(buttonStore.outputTexts, null, 2)); // JSON形式で出力
      this.$emit('updateMessage', `${link.text}が${link.active ? 'ON' : 'OFF'}になりました！`);
      this.$emit('updateOutputTexts', buttonStore.outputTexts);
      document.getElementById('spn1').textContent = `${link.text}が${link.active ? 'ON' : 'OFF'}になりました！`;
    }
  }
};
</script>

<style>
.large-button {
  width: 300px;
  height: 300px;
  font-size: 16px;
  background-color: #d3d3d3; /* 薄いグレー */
  color: black; /* OFF状態のテキスト色 */
}
.large-button.active {
  background-color: #333; /* ON状態の色 */
  color: white; /* ON状態のテキスト色 */
}
.button-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 600px; /* 2つのボタンの高さ */
  max-width: 640px; /* 2つのボタンの幅 */
  overflow-y: scroll;
}
</style>
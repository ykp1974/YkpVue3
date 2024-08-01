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

export default {
  name: 'AppVue',
  props: {
    message: String
  },
  data() {
    return {
      data: {
        parVals2: [],
      },
      outputTexts: [] // outputTextを蓄積するための配列を追加
    };
  },
  mounted() {
    // ローカルストレージからoutputTextsを読み込む
    const savedOutputTexts = JSON.parse(localStorage.getItem('outputTexts')) || [];
    this.outputTexts = savedOutputTexts;
    
    axios.get('/test2.json')
      .then(response => {
        // this.data.parVals2 = response.data.map(element => ({
        //   text: element.text,
        //   value: element.value,
        //   active: false // 初期状態はOFF
        // }));
        this.data.parVals2 = response.data.map(element => {
          const isActive = savedOutputTexts.some(item => item.text === element.text && item.status === 'ON');
          return {
            text: element.text,
            value: element.value,
            active: isActive // ローカルストレージの状態を反映
          };
        });
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  },
  methods: {
  handleButtonClick(link) {
    link.active = !link.active; // ON/OFFの切り替え
    const outputText = {
      text: link.text,
      status: link.active ? 'ON' : 'OFF'
    };

    if (link.active) {
      // ONの場合は追加
      this.outputTexts.push(outputText);
    } else {
      // OFFの場合は削除
      this.outputTexts = this.outputTexts.filter(item => item.text !== link.text);
    }

    // ローカルストレージに保存
    localStorage.setItem('outputTexts', JSON.stringify(this.outputTexts));

    console.log("this.outputTexts=>", JSON.stringify(this.outputTexts, null, 2)); // JSON形式で出力
    this.$emit('updateMessage', `${outputText.text}が${outputText.status}になりました！`);
    this.$emit('updateOutputTexts', this.outputTexts);
    document.getElementById('spn1').textContent = `${outputText.text}が${outputText.status}になりました！`;
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
  max-width: 640px; /* 2つのボタンの高さ */
  overflow-y: scroll;
}
</style>
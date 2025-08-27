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
  <TestModal 
    v-if="showModal" 
    :show="showModal" 
    title="何人前ですか？" 
    content="注文数を入力してください。" 
    @close="showModal = false" 
    @updateModalInputValues="handleUpdateModalInputValues"
  />
</template>

<script>
import axios from 'axios';
import { useButtonStore } from './store';
import TestModal from './TestModal.vue';

export default {
  name: 'AppVue',
  components: {
    TestModal
  },
  data() {
    return {
      data: {
        parVals2: [],
      },
      showModal: false,
      currentButton: null // 押されたボタンの情報を保存するプロパティを追加
    };
  },
  mounted() {
    const buttonStore = useButtonStore();
  axios.get('/test2.json')
    .then(response => {
      this.data.parVals2 = response.data.map(element => {
        const item = element.menu.item; // ネストされたitemにアクセス
        const isActive = buttonStore.outputTexts.some(storeItem => storeItem.text === item.text && storeItem.status === 'ON');
        return {
          text: item.text,
          value: item.value,
          active: isActive // ストアの状態を反映
        };
      });
    })
    .catch(error => {
      console.error('データの取得エラー: ', error);
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

      // モーダルを表示
      this.showModal = true;
      this.currentButton = link; // 押されたボタンの情報を保存      
    },

    handleUpdateModalInputValues(inputValue) {
      console.log("@@@　handleUpdateModalInputValues　＠＠＠:");
      const buttonStore = useButtonStore();
      if (this.currentButton) {
        // ストアのアクションを呼び出して数量を更新
        buttonStore.updateItemQuantity(this.currentButton.text, inputValue);
      }
      //
      const buttonIndex = buttonStore.outputTexts.findIndex(item => item.text === this.currentButton.text);
      console.log("buttonIndex:", buttonIndex);
      if (buttonIndex !== -1) {
        buttonStore.outputTexts[buttonIndex].inputValue = inputValue; // 入力値を設定
      }
      console.log("Updated outputTexts:", buttonStore.outputTexts);
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
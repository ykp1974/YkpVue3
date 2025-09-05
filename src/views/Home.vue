<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <h1>Home Page</h1>
  <div class="button-container">
    <template v-for="link in buttonData" :key="link.text">
      <button
        v-on:click="handleButtonClick(link)"
        :class="{'large-button btn': true, 'active': link.active}"
        v-html="getButtonText(link)">
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
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'AppVue',
  components: {
    TestModal
  },
  setup(props, { emit }) {
    const buttonStore = useButtonStore();
    const showModal = ref(false);
    const currentButton = ref(null);
    const apiData = ref([]);

    // APIからデータを取得
    onMounted(() => {
      axios.get('/test2.json')
        .then(response => {
          apiData.value = response.data.map(element => element.menu.item);
        })
        .catch(error => {
          console.error('データの取得エラー: ', error);
        });
    });

    // buttonDataをcomputedで動的に生成
    const buttonData = computed(() => {
      // ストアの状態を反映させて、ボタンの状態をリアルタイムに更新
      return apiData.value.map(item => {
        const storeItem = buttonStore.outputTexts.find(storeItem => storeItem.text === item.text);
        return {
          text: item.text,
          value: item.value,
          active: storeItem ? storeItem.status === 'ON' : false,
          inputValue: storeItem ? storeItem.inputValue : 0 // inputValueを追加
        };
      });
    });

    const handleButtonClick = (link) => {
      // 修正ポイント：このメソッドではモーダルを開く処理のみ行う
      currentButton.value = link;
      showModal.value = true;
    };

    const handleUpdateModalInputValues = (inputValue) => {
      console.log("@@@　handleUpdateModalInputValues　＠＠＠:");
      if (currentButton.value) {
        const existingItem = buttonStore.outputTexts.find(item => item.text === currentButton.value.text);
        
        if (inputValue > 0) {
          // 注文数が0より大きい場合、ONにする
          if (existingItem) {
            existingItem.status = 'ON';
          } else {
            // 新しい要素を追加
            buttonStore.outputTexts.push({ text: currentButton.value.text, status: 'ON', inputValue: inputValue });
          }
          buttonStore.updateItemQuantity(currentButton.value.text, inputValue);
        } else {
          // 注文数が0の場合、OFFにする
          if (existingItem) {
            existingItem.status = 'OFF';
            buttonStore.updateItemQuantity(currentButton.value.text, 0);
          }
        }
        
        emit('updateOutputTexts', buttonStore.outputTexts);
        
        console.log("Updated outputTexts:", buttonStore.outputTexts);
        const statusText = buttonStore.outputTexts.find(item => item.text === currentButton.value.text)?.status === 'ON' ? 'ON' : 'OFF';
        document.getElementById('spn1').textContent = `${currentButton.value.text}が${statusText}になりました！`;
      }
    };

    // ボタンのテキストを動的に生成するメソッド
    const getButtonText = (link) => {
      const storeItem = buttonStore.outputTexts.find(item => item.text === link.text);
      if (storeItem && storeItem.status === 'ON' && storeItem.inputValue > 0) {
        return `${link.text}<br/><span class="order-quantity">x ${storeItem.inputValue}</span>`;
      }
      return link.text;
    };

    return {
      showModal,
      currentButton,
      buttonData,
      handleButtonClick,
      handleUpdateModalInputValues,
      getButtonText, // メソッドを公開
    };
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
  line-height: 1.2; /* 行間を調整 */
  padding-top: 50px; /* テキストを上部に寄せる */
  text-align: center;
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
.order-quantity {
  color: red;
  font-weight: bold;
}
</style>
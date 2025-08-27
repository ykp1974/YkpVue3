<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <h1>Home Page</h1>
  <div class="button-container">
    <template v-for="link in buttonData" :key="link.text">
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
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'AppVue',
  components: {
    TestModal
  },
  setup() {
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
          active: storeItem ? storeItem.status === 'ON' : false
        };
      });
    });

    const handleButtonClick = (link) => {
      // ボタンの状態をトグルする前に、ストアに新しいアイテムを存在させます
      const existingItem = buttonStore.outputTexts.find(item => item.text === link.text);
      if (!existingItem) {
          buttonStore.outputTexts.push({ text: link.text, status: 'OFF', inputValue: 1 });
      }

      buttonStore.toggleButton(link.text);
      console.log("buttonStore.outputTexts=>", JSON.stringify(buttonStore.outputTexts, null, 2));
      
      const statusText = buttonStore.outputTexts.find(item => item.text === link.text)?.status === 'ON' ? 'ON' : 'OFF';
      // emitは不要
      // this.$emit('updateMessage', `${link.text}が${statusText}になりました！`);
      // this.$emit('updateOutputTexts', buttonStore.outputTexts);
      document.getElementById('spn1').textContent = `${link.text}が${statusText}になりました！`;

      showModal.value = true;
      currentButton.value = link;
    };

    const handleUpdateModalInputValues = (inputValue) => {
      console.log("@@@　handleUpdateModalInputValues　＠＠＠:");
      if (currentButton.value) {
        buttonStore.updateItemQuantity(currentButton.value.text, inputValue);
      }
      console.log("Updated outputTexts:", buttonStore.outputTexts);
    };

    return {
      showModal,
      currentButton,
      buttonData,
      handleButtonClick,
      handleUpdateModalInputValues,
      // setup() でデータを返さないので、input v-model="message" は削除
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
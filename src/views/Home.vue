<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <h1>Home Page</h1>
  <div class="button-container">
    <template v-for="link in buttonData" :key="link.text">
      <button
        v-on:click="handleButtonClick(link)"
        :class="{'large-button btn': true, 'active': link.active}"
        :style="getButtonStyle(link)"
        v-html="getButtonText(link)">
      </button>
    </template>
  </div>
  <TestModal
    v-show="showModal"
    :show="showModal"
    title="何人前ですか？"
    content="注文数を入力してください。"
    @close="showModal = false"
    @updateModalInputValues="handleUpdateModalInputValues"
    :initial-value="currentButton ? currentButton.inputValue : 0"
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

    onMounted(() => {
      axios.get('/test2.json')
        .then(response => {
          apiData.value = response.data.map(element => element.menu.item);
        })
        .catch(error => {
          console.error('データの取得エラー: ', error);
        });
    });

    const buttonData = computed(() => {
      return apiData.value.map(item => {
        const storeItem = buttonStore.outputTexts.find(si => si.text === item.text);
        return {
          text: item.text,
          value: item.value,
          image: `/img/${item.picname}`,
          // image: `/img/grilled_cabbage.png`,
          
          active: storeItem ? storeItem.status === 'ON' : false,
          inputValue: storeItem ? storeItem.inputValue : 0
        };
      });
    });

    const getButtonStyle = (link) => {
      const fileName = link.image.split('/').pop();
      const encodedUrl = `/img/${encodeURIComponent(fileName)}`;

      return {
        // backgroundSize: 'cover' により、ボタンの隙間なく画像が広がります
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("${encodedUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#666',
        color: 'white'
      };
    };

    const handleButtonClick = (link) => {
      currentButton.value = link;
      showModal.value = true;
    };

    const handleUpdateModalInputValues = (inputValue) => {
      if (currentButton.value) {
        const existingItem = buttonStore.outputTexts.find(item => item.text === currentButton.value.text);
        if (inputValue > 0) {
          if (existingItem) {
            existingItem.status = 'ON';
          } else {
            buttonStore.outputTexts.push({ text: currentButton.value.text, status: 'ON', inputValue: inputValue });
          }
          buttonStore.updateItemQuantity(currentButton.value.text, inputValue);
        } else {
          if (existingItem) {
            existingItem.status = 'OFF';
            buttonStore.updateItemQuantity(currentButton.value.text, 0);
          }
        }
        emit('updateOutputTexts', buttonStore.outputTexts);
      }
    };

    const getButtonText = (link) => {
      const storeItem = buttonStore.outputTexts.find(item => item.text === link.text);
      if (storeItem && storeItem.status === 'ON' && storeItem.inputValue > 0) {
        // 文字列の配置を整えるため、クラスを調整
        return `<div class="btn-content"><span class="item-name">${link.text}</span><span class="order-quantity">x ${storeItem.inputValue}</span></div>`;
      }
      return `<div class="btn-content"><span class="item-name">${link.text}</span></div>`;
    };

    return {
      showModal,
      currentButton,
      buttonData,
      handleButtonClick,
      handleUpdateModalInputValues,
      getButtonText,
      getButtonStyle
    };
  }
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
}

.large-button {
  width: 280px;  /* お好みのサイズに固定 */
  height: 280px;
  padding: 0 !important; /* Bootstrapの干渉を確実に防ぐ */
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
}

/* 選択時のエフェクトを「枠線」から「光り（box-shadow）」に変更して画像を邪魔しないようにする */
.large-button.active {
  box-shadow: inset 0 0 0 6px #ffcc00; /* 内側に枠線を出す */
}

:deep(.btn-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

:deep(.item-name) {
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  pointer-events: none; /* テキストがクリックの邪魔をしないように */
}

:deep(.order-quantity) {
  margin-top: 10px;
  background-color: #ff3333;
  color: white;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 1.2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}
</style>
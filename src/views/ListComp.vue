<template>
      <div class="list-container">
        <h2 class="list-title">注文リスト</h2>        
        <div class="order-content">
          <div v-if="orderItems.length > 0">
            <!-- <h3>注文リスト</h3> -->
            <ul>
              <li v-for="item in orderItems" :key="item.text">
                {{ item.text }} - {{ item.inputValue }} 個
              </li>
            </ul>
          </div>
          <div v-else>
            <p>注文された商品はありません。</p>
          </div>
          <div class="button-area">
            <button class="modern-send-button" @click="sendOrder">
              <span class="btn-text">オーダーを送信する</span>
            </button>
          </div>
        </div>
      </div>
  </template>

  <script>
  import { useButtonStore } from './store';
  import axios from 'axios';
  import { computed } from 'vue';
  export default {
    setup() {
      const buttonStore = useButtonStore();
      const orderItems = computed(() =>
        buttonStore.outputTexts.filter(item => item.status === 'ON')
      );

      return {
        orderItems,
      };
    },
    props:{
        outputTexts: {
            type: Array,
            required: true
        }
    },
    data() {
      return {
        profileId: this.$route.query.profileId,
      }
    },
    methods: {
      sendOrder: function () {
        // ストアから取得した注文データ（orderItems）を整理して送信
        // 循環参照や不要なプロパティを避けるため、必要な項目のみを抽出
        const cleanData = this.orderItems.map(item => ({
          text: item.text,
          inputValue: item.inputValue
        }));
        const url = process.env.VUE_APP_GAS_ORDER_URL;
        if (!url) {
          console.error('API URLが取得できません。環境変数とサーバー再起動を確認してください。');
          alert('設定エラー：送信先URLが見つかりません。');
          return;
        }
        
        axios.post(url, JSON.stringify({ order: cleanData }), {
          headers: {
            'Content-Type': 'text/plain' // GASのdoPostへはJSONではなくtext/palinがよい
          }
        })
        .then(response => {
          console.log('Response:', response.data);
          // ライブラリ形式のレスポンスチェック
          if (response.data.status === 'success') {
            // 注文内容などは response.data.data の中に入っています
            const detail = response.data.data.received;
            alert('オーダーを送信しました!\n内容: ' + detail);
          } else {
            // GAS側でキャッチしたエラー（ロック失敗など）
            alert('エラー: ' + response.data.message);
          }
          // if (response.data.status === 'success') {
          //   alert('オーダーを送信しました!');
          // } else {
          //   alert('エラー: ' + response.data.message);
          // }
        })
        .catch(error => {
          // GASのリダイレクトにより、成功していてもここに来る場合がありますが
          // GAS側でContentServiceを返せば、基本的には.thenに入ります。
          console.error('Error fetching data: ', error);
          alert('送信中にネットワークエラーが発生しました。');
        });
      },
    }
  }
  </script>

<style scoped>
.list-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.list-title {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 30px;
  border-left: 5px solid #42b983;
  padding-left: 15px;
}

.order-items {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.item-text {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.empty-message {
  color: #999;
  text-align: center;
  padding: 40px;
}

.button-area {
  margin-top: 50px;
  display: flex;
  justify-content: flex-start;
}

.modern-send-button {
  appearance: none;
  background: linear-gradient(135deg, #42b983 0%, #38a171 100%);
  color: white;
  border: none;
  padding: 16px 48px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(66, 185, 131, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.modern-send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(66, 185, 131, 0.4);
  filter: brightness(1.05);
}

.modern-send-button:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px -3px rgba(66, 185, 131, 0.3);
}

.modern-send-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
}

.modern-send-button:hover::after {
  opacity: 1;
}

.btn-text {
  position: relative;
  z-index: 1;
}
</style>
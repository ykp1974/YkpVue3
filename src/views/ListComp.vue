<template>
      <div>
        <div v-if="orderItems.length > 0">
          <h3>注文リスト</h3>
          <ul>
            <li v-for="item in orderItems" :key="item.text">
              {{ item.text }} - {{ item.inputValue }} 個
            </li>
          </ul>
        </div>
        <div v-else>
          <p>注文された商品はありません。</p>
        </div>
        <input type="button" @click="sendOrder" value="送信">
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
        // JSON.stringifyでデータを文字列に変換
        // const orderData = JSON.stringify(this.orderItems);
        // const orderData = JSON.stringify(cleanData);
        const url = 'https://script.google.com/macros/s/AKfycbzilevW-OeRTrczq61YrWqwamcJkVAu0CAE-5a2rEM5eoBEY5n2Zko_RmWgP0wkaAM/exec';

        // doGet時代のコード
        // axios.get('https://script.google.com/macros/s/AKfycby728kJ3rlPo305c6yWlqymlRr_bJu89XaGBJGQnY6Eyx72kIEY8lmrM-cOaDHZzqU/exec?order=' + encodeURIComponent(orderData))
        // .then(response => {
        //   console.log(response.data);
        //   // カスタムモーダルに置き換え
        //   alert('オーダーを送信しました!');
        // })
        // .catch(error => {
        //   console.error('Error fetching data: ', error);
        // });

        // axios.get(url + '?order=' + encodeURIComponent(orderData))
        axios.post(url, JSON.stringify({ order: cleanData }), {
          headers: {
            'Content-Type': 'text/plain' // GASのdoPostへはJSONではなくtext/palinがよい
          }
        })
        .then(response => {
          console.log('Response:', response.data);
          if (response.data.status === 'success') {
            alert('オーダーを送信しました!');
          } else {
            alert('エラー: ' + response.data.message);
          }
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

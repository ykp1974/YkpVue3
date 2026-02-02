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
        // JSON.stringifyでデータを文字列に変換
        const orderData = JSON.stringify(this.orderItems);

        axios.get('https://script.google.com/macros/s/AKfycbzVJjlKzUkXmEcP8dUtnESIdvadN4iSpIMJtRlcMvYlvIpPaw-WtHBK2MotHzBKOaY/exec?order=' + encodeURIComponent(orderData))
        .then(response => {
          console.log(response.data);
          // カスタムモーダルに置き換え
          alert('オーダーを送信しました!');
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
      },
    }
  }
  </script>

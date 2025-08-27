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
      <input type="button" @click="createUser" value="送信">
    </div>
</template>
  
  <script>
  import { useButtonStore } from './store'; // ストアをインポート
  import axios from 'axios';
  import { computed } from 'vue'; // ここにcomputedを追加
  export default {
    setup() {
      const buttonStore = useButtonStore();
      // ストアのデータをリアクティブに取得
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
      createUser: function () {
        axios.get('https://script.google.com/macros/s/AKfycbxKqUMis09kMBL3MmntzXGFoAJYF1wQcDOAB71bTCEDOaCBV09D461AA-Ky59gVdTI/exec?order='+JSON.stringify(this.outputTexts))
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
        alert('オーダーを送信しました!');
      },
    }
  }
  </script>
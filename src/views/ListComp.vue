<template>
    <div>
      <div v-if="message != undefined">{{message}}</div>
      <ul>
        <li v-for="item in outputTexts" :key="item.text">{{ item }}- {{ item.status }}</li>
        <!-- <li v-for="(item, index) in outputTexts" :key="index">
            {{ item.text }} - {{ item.status }}
        </li> -->
      </ul>
      <input type="button" @click="createUser" value="送信">
    </div>
</template>
  
  <script>
  import axios from 'axios';
  export default {
    // props: ['message', 
    //         // 'outputTexts'
    // ],
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
    created() {
        console.log(Array.isArray(this.outputTexts)); // trueであれば配列
        console.log("xxx=>"+JSON.stringify(this.outputTexts)); // trueであれば配列
        // データを非同期で取得する例
        // this.fetchData();
    },
    methods: {
      createUser: function () {
        axios.get('https://script.google.com/macros/s/AKfycbxfjkupWXr6H8ajERs2h74pI7XMg6HwUuOWdfzcXvma3F0zvb_6KNhP-lwc1BtQUnE/exec?order='+this.message)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
        alert('createUser!');
      },
        // fetchData() {
        //     // ここでデータを取得し、outputTextsにセット
        //     this.outputTexts = [
        //         { text: "耐乏もやし御膳1人前", status: "ON" },
        //         { text: "豪華もやし御膳1人前", status: "ON" }
        //     ];
        // }
    }
  }
  </script>
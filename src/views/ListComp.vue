<template>
    <div>
      <div v-if="message != undefined">{{message}}</div>
      <ul>
        <li v-for="item in outputTexts" :key="item.text">{{ item }}- {{ item.status }}</li>
      </ul>
      <input type="button" @click="createUser" value="送信">
    </div>
</template>
  
  <script>
  import axios from 'axios';
  export default {
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
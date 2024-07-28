<template>
    <div>
      <div v-if="message != undefined">{{message}}</div>
      <div v-if="profileId != undefined">{{profileId}}</div>
      <input type="button" @click="createUser" value="送信">
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        props: ['message'],
        data() {
            return {
                profileId: this.$route.query.profileId,
            }
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
            }
        }
    }
</script>
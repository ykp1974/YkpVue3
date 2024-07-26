<template>
    <div>
      <div v-if="message != undefined">{{message}}</div>
      <div v-if="profileId != undefined">{{profileId}}</div>
      <input type="button" @click="createUser" value="送信">
    </div>
</template>

<script>
    export default {
        props: ['message'],
        data() {
            return {
                profileId: this.$route.query.profileId,
            }
        },
        methods: {
            createUser: function () {
                alert('createUser!');
            }
        }
    }
</script>
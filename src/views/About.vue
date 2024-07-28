<template>
    <h1>About Page</h1>
    <button v-on:click="submit">
        Submit
    </button>
    <button v-on:click="cancel">
        Cancel
    </button>
    {{ message }}
</template>
<script>
    export default {
        data: () => ({
            message: ""
        }),
        props: {
            ValPrms: String  
        },
        methods: {
            submit(){
            this.message = "submit";
            },
            cancel(){
            this.message = "cancel";
            }
        }
    }
</script>
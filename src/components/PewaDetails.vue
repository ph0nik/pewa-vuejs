<template>
<div id="details">
    <p>details</p>
    <!-- <p>macierz: {{ itemObject }}</p> -->
    <h1>{{itemObject.titleEng}}</h1>
    <h2>{{itemObject.titleRom}}</h2>
    <img v-bind:src="imageAddress">
    <button v-on:click="updateEncounter" name="update" type="button">update</button>
</div>

</template>

<script>

export default {
    name: 'pewa-details',
    props: {
        itemObject: {
            type: Object
        }
    },
    data() {
        return {
            url: '',
            restAddress: 'http://localhost:8081/'
        }
    },
    created() {
    }, 
    computed: {
        showContentInConsole: function() {
            console.log(this.itemObject);
        },
        imageAddress: function() {
            let link = this.itemObject.intPoster;
            return this.restAddress + link.slice(1, link.length);
        }
    },
    methods: {
        updateEncounter: function() {
            this.$emit('updateencounter', this.itemObject);
        }
    }
}
</script>

<style scoped>
#details {
    width: 300px;
    padding: 12px;
    background-color: #ff6600;
    
}
</style>
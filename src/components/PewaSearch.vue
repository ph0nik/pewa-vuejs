<template>
    <div class="pewa-search-box">
        <div>home</div>
        <div>
          <div>input</div>
          <div>
            <div class="switch">internal</div>
            <div class="switch">external</div>
          </div>
        </div>
        <div>search button</div>
        <button class="pewa-button" v-on:click="getLatestElements">
          <i class="fa fa-home" aria-hidden="true"></i>
          Home</button>
        
        <label for="pewa-search"></label>
        <input type="text" 
              name="encounter-search" 
              class="pewa-input-search" 
              v-model="queryObject.query" 
              autocomplete="on" 
              placeholder="search..."  
              v-on:keyup="searchEncountersKeyPress" 
              required/>      
        <button type="button" class="pewa-button" v-on:click="searchEncounters(queryObject)">
          <i class="fa fa-search" aria-hidden="true"></i>
        </button>
        <select class="pewa-search-scope" v-model="queryObject.externalSearch" required >
          <option v-bind:value="false">Internal</option>
          <option v-bind:value="true">External</option>
        </select>
        

    </div>
</template>

<script>
export default {
  name: "pewa-search",
  data() {
    return {
      queryObject: {
        query: "",
        externalSearch: true
      }
    };
  },
  methods: {
    getLatestElements: function() {
      this.$emit("gohome");
    },
    searchEncounters: function(obj) {
      console.log(obj);
      if (obj.query != "") this.$emit("searchencounter", obj);
    },
    searchEncountersKeyPress: function(pressed) {
      if (pressed.key === "Enter") {
        this.searchEncounters(this.queryObject);
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0px;
  outline: none;
}

.pewa-search-box {
  border: none;
  width: 600px;
  background-color: none;
  border: 1px solid #6B8FD4;
  color: #fff;
  padding: 0px;  
  margin: 20px;
  font-size: 1.2em;
  display: flex;
  justify-content: space-around;
}

.pewa-search-box > div:nth-of-type(2) {
  border: 1px solid red;
  display: flex;
  flex-direction: column;
}

.switch {
  border: 1px solid purple;
  flex-direction: row;
}
.pewa-input-search {
  /* display: inline; */
  /* background: #abab87; */
  border-width: 2px 0px 2px 2px;
  border-style: solid;
  border-color: #6B8FD4;
  background-color: #202E3C;
  padding: 5px;
  /* border: none; */
  margin: 5px 0px;
  width: 40%;
  height: 2em;
}

.pewa-input-search:focus {
  /* background-color: #F39C12; */
  color: #F39C12;
  /* border-color: #B97609; */
}

.pewa-button {
  cursor: pointer;
  margin: 5px 0px;
  width: 60px;  
  height: 2em;
  font-weight: bold;
  text-decoration: none;
  background-color: inherit;
  color: #fff;
  border: 2px solid #6B8FD4;
  border-width: 2px 2px 2px 2px;
  border-style: solid;
  border-color: #6B8FD4;
}

.pewa-button:hover {
  color: #F39C12;
  border-color: #B97609;
  /* background-color: rgb(42, 42, 42); */
}

.button-search {
  font-weight: bold;
  cursor: pointer;
  width: 100px;
  border-radius: 2px;
  border: none;
  margin: 5px;
  text-decoration: none;
  /* font-size: 16px; */
  color: #4e4e4e;
  background-color: rgb(206, 206, 206);
}

/* .pewa-search-scope {
  border: 0px solid #abab87;
  margin: 5px;
  height: 2em;
  width: 20%;
  background-color: #abab87;
} */
/* 
.button-search:hover {
  color: rgb(255, 255, 255);
  background: linear-gradient(to bottom, #1144AA, #05296E );
} */

</style>
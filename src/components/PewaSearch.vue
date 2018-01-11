<template>
<div class="pewa-search-box">
        <button class="pewa-button" v-on:click="getLatestElements">Home</button>
        
        <label for="pewa-search"></label>
        <input type="text" 
              name="encounter-search" 
              class="pewa-input-search" 
              v-model="queryObject.query" 
              autocomplete="on" 
              placeholder="search..."  
              v-on:keyup="searchEncountersKeyPress" 
              required/>      
        
        <select class="pewa-search-scope" v-model="queryObject.externalSearch" required >
          <option v-bind:value="false">Internal</option>
          <option v-bind:value="true">External</option>
        </select>
        
        <button type="button" class="pewa-button" v-on:click="searchEncounters(queryObject)">Search</button>
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
  outline:none;
}

.pewa-search-span {
  border: none;
  height: 100%;
  width: 0.5%;
  background-color: rgb(41, 41, 41);
}

.pewa-search-box {
  padding: 0px;
  border: none;
  margin: 5px;
  /* height: 20px; */
  display: flex;
  font-weight: bold;
  justify-content: space-around;
}

.pewa-input-search {
  /* display: inline; */
  background: #abab87;
  border-width: 0px 0px 4px 0px;
  border-style: solid;
  border-color: #666666;
  margin: 5px;
  width: 40%;
  height: 2em;
}

.pewa-input-search:focus {
  background-color: #34495E;
  border-color: #F39C12;
}

.pewa-button {
  cursor: pointer;
  margin: 5px;
  width: 20%;  
  height: 2em;
  font-weight: bold;
  text-decoration: none;
  border-width: 0px 0px 4px 0px;
  border-style: solid;
  border-color: #666666;
}

.pewa-button:hover {
  color: #ffffff;
  border-color: #F39C12;
  background-color: rgb(42, 42, 42);
}

.button-search {
  font-weight: bold;
  cursor: pointer;
  width: 100px;
  border-radius: 2px;
  border: none;
  margin: 5px;
  text-decoration: none;
  font-size: 16px;
  color: #4e4e4e;
  background-color: rgb(206, 206, 206);
}

.pewa-search-scope {
  border: 0px solid #abab87;
  margin: 5px;
  height: 2em;
  width: 20%;
  background-color: #abab87;
}

.button-search:hover {
  /* transition: 100ms; */
  color: rgb(255, 255, 255);
  background: linear-gradient(to bottom, #1144AA, #05296E );
}

</style>
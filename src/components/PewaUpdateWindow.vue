<template>
    <div class="pewa-update-box">
<!-- header -->
        <div class="update-header">Insert encounter details</div>
        <div class="update-values">
<!-- media type -->
            <div class="update-media-type">
<!-- list header -->
                <div>source:</div>
                <div>
                  <div class="select-list-header source"
                    v-on:mouseover="showList(sourceList)"
                    v-on:mouseout="hideList(sourceList)">  
                    <div>
                      {{ encounter.mediaSource }}
                    </div>
                    <div>
                      <i v-if="sourceList.visibility == 'hidden'" class="fa fa-caret-left" aria-hidden="true"></i>
                      <i v-else class="fa fa-caret-down" aria-hidden="true"></i>
                    </div>
                  </div>
<!-- list content -->
                  <div v-bind:style="getSourceList" 
                      class="select-list source"
                      v-on:mouseover="showList(sourceList)"
                      v-on:mouseout="hideList(sourceList)">
                    <div v-for="(item, index) in selectMedia" 
                        v-bind:value="item.val" 
                        v-bind:key="index" 
                        v-on:click="getFromList(item, sourceList)"
                        class="list-item">
                          &squf;&nbsp 
                          {{ item.id }}
                    </div>
                  </div>       
                </div>         
            </div>
<!-- date -->
            <div class="update-date">
              <div>
                &squf;&nbspdate&nbsp
              </div>
                <input type="date" value="status.encounterDate" v-model="status.encounterDate">
            </div>
<!-- rating -->
            <div class="update-rating">
              <div>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>  
              <div>
                  <div class="select-list-header rating"
                    v-on:mouseover="showList(ratingList)"
                    v-on:mouseout="hideList(ratingList)">  
                    <div>
                      {{ encounter.encounterRating }}
                    </div>
                    <div>
                      <i v-if="ratingList.visibility == 'hidden'" class="fa fa-caret-left" aria-hidden="true"></i>
                      <i v-else class="fa fa-caret-down" aria-hidden="true"></i>
                    </div>
                  </div>
<!-- list content -->
                  <div v-bind:style="getRatingList" 
                      class="select-list rating"
                      v-on:mouseover="showList(ratingList)"
                      v-on:mouseout="hideList(ratingList)">
                    <div v-for="(item, index) in 10" 
                        v-bind:value="item" 
                        v-bind:key="index" 
                        v-on:click="setRating(item, ratingList)"
                        class="list-item">                          
                          &squf;&nbsp 
                          {{ item }}   
                    </div>
                  </div>       
              </div>            
            </div>
<!-- season -->
            <div v-if="status.elementType === 'TVSERIES'" class="update-season">
              <div>
                season:
              </div>
              <div>
                  <div class="select-list-header season"
                    v-on:mouseover="showList(seasonList)"
                    v-on:mouseout="hideList(seasonList)">  
                    <div>
                      {{ status.season }}
                    </div>
                    <div>
                      <i v-if="seasonList.visibility == 'hidden'" class="fa fa-caret-left" aria-hidden="true"></i>
                      <i v-else class="fa fa-caret-down" aria-hidden="true"></i>
                    </div>
                  </div>
<!-- list content -->
                  <div v-bind:style="getSeasonList" 
                      class="select-list season"
                      v-on:mouseover="showList(seasonList)"
                      v-on:mouseout="hideList(seasonList)">
                    <div v-for="(item, index) in encounter.totalSeasons" 
                        v-bind:value="item" 
                        v-bind:key="index" 
                        v-on:click="setSeason(item, seasonList)"
                        class="list-item">                          
                          &squf;&nbsp 
                          {{ item }}   
                    </div>
                  </div>       
              </div>
              <!-- <select id="pewa-update-season" v-model="status.season" required>
                <option v-for="(item, index) in 7" v-bind:value="item" v-bind:key="index" v-bind:selected="status.mediaSource">
                  {{ item }}
                  
                </option>
              </select> -->
            </div>
        </div>
<!-- comment -->
        <div class="update-comment">
            <div>
              <textarea class="pewa-update-comment" v-model="status.comment" v-bind:placeholder="status.comment">
              </textarea>
            </div>
        </div>
<!-- footer -->
        <div class="update-footer">    
          <div>
            <button class="update-button" v-on:click="submitStatus" name="close" type="button">Submit</button>
          </div>        
          <div>
            <button class="update-button" v-on:click="closeWindow" name="close" type="button">Cancel</button>
          </div>        
        </div>
    </div>  
</template>

<script>
export default {
  name: "pewa-update-window",
  props: {
    itemObject: {
      type: Object,
      required: true
    },
    encounter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // status: {},
      addnew: true,
      selectMedia: [
        { id: "Cinema", val: "CINEMA" },
        { id: "Computer", val: "COMPUTER" },
        { id: "WebStream", val: "WEBSTREAM" },
        { id: "TV", val: "TV" },
        { id: "Video", val: "VIDEO" },
        { id: "DVD", val: "DVD" },
        { id: "BluRay", val: "BLURAY" },
        { id: "Book", val: "BOOK" },
        { id: "eBook", val: "EBOOK" },
        { id: "other", val: "OTHER" }
      ],
      // rating: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      newEncounter: {},
      sourceList: {
        visibility: "hidden"
      },
      ratingList: {
        visibility: "hidden"
      },
      seasonList: {
        visibility: "hidden"
      },
// TODO add distinc color on list header element      
      listHeader: {
        color: String
      }
    };
  },
  created() {
  },
  computed: {
// assign external status object to interla object and format date value
    status: function() {
      if (this.encounter != null) {
        this.newEncounter = this.encounter;
        var data = new Date(this.encounter.encounterDate)
          .toISOString()
          .slice(0, 10);
        this.newEncounter.encounterDate = data;
      }
      return this.newEncounter;
    },
    formatEncounterDate: function() {
      var date;
      if (this.status != null) {
        date = new Date(this.status.encounterDate);
      }
      // return date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
      return date.toISOString().slice(0, 10);
    },
    getSourceList: function() {
      return this.sourceList;
    },
    getRatingList: function() {
      return this.ratingList;
    },
    getSeasonList: function() {
      return this.seasonList;
    },
    getSeasonsNo: function() {
      console.log(this.itemObject.seasons);
      let s = 1;
      if (this.itemObject.season) {
        s = this.itemObject.season;
      }
      return s;
    }
  },
  methods: {
// show list
    showList: function(list) {
      list.visibility = "visible";      
    },
// hide list
    hideList: function(list) {
      list.visibility = "hidden";
    },
// select list item
    getFromList: function(item, list) {
      this.newEncounter.mediaSource = item.val;
      this.hideList(list);
    },
    setRating: function(item, list) {
      this.newEncounter.rating = item;
      this.hideList(list);
    },
    setSeason: function(item, list) {
      this.newEncounter.season = item;
      this.hideList(list);
    },
// close window emit
    closeWindow: function() {
      this.$emit("closeupdate", this.encounter);
    },
    submitStatus: function() {
      this.status.addedDate = "";
      this.$emit("submit", this.status);
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

.pewa-update-box {
  position: absolute;
  cursor: pointer;  
  width: 600px;
  padding: 0px;
  margin: 0px;
  /* color: #F0F0F0; */
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
  left: 20%;
  top: 10%;
  font-size: 0.9em;
  /* resize: both;
  overflow: hidden; */
  /* border: 1px solid #7C5E04; */
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
}

.update-values {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Add this line */
    background-color: #DEDEDE;
    color: #674E03;
}

.update-values > div {
  position: relative;
  display: flex;
  justify-content: space-around;
  /* line-height: 2em; */
  margin: 5px;
}


.update-header {
  border-radius: 10px 10px 0px 0px;
  border-width: 1px;
  border-top-color: #7C5E04;
  border-right-color: #7C5E04;
  border-left-color: #7C5E04;
  border-bottom: 1px solid #fff;
  background-color: #b38600;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  padding: 5px 0px 5px 0px;
}

.select-list-header {
  display: flex;
  justify-content: space-around;
  padding: 2px 10px;
  margin: 0px;
  z-index: 10;
  position: relative;
  border: 1px solid #A7A7A7;
}

.select-list-header:hover {
  color: red;
}

.select-list-header > div:nth-of-type(1) {
  text-align: center;
}

.rating {
  width: 50px;
}

.source {
  width: 120px;
}

.season {
  width: 50px;
}

.select-list {
  margin: 0px;
  background-color: none;
  /* border: 1px solid #A7A7A7; */
  position: absolute;
  color: #000;
}

.list-item {
  padding: 2px 10px;
  border-bottom: 1px solid #A7A7A7;
  /* background-color: inherit; */
  background-color: #DEDEDE;
  color: #000;;
}

.list-item:hover {
  /* color: #b38600; */
  color: #FF6200;
  background-color: #F0F0F0;
}

.update-comment {
  /* border: 1px solid red; */
  width: 100%;
  height: 200px;
  /* min-height: 200px; */

}

.update-comment > div {
  /* border: 1px solid purple; */
  /* padding: 10px; */
  height: 100%;
  background-color: #ffffff;

}

textarea {
  padding: 10px;
    width: 100%;
  height: 100%;
  resize: none;
}

.update-footer {
  height: 40px;
  padding: 0px;
  margin: 0px;
  border-radius: 0px 0px 10px 10px;
  border-width: 1px;
  border-top-color: #7C5E04;
  border-right-color: #7C5E04;
  border-left-color: #7C5E04;
  border-top: 1px solid #4A3802;
  background-color: #b38600;
  color: #ffffff;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.update-button {
  font-size: 1em;
    border: none;
  width: 9.4em;
  height: 2.1em;
  /* background-color: #404b56; */
  background-color: inherit;
  color: #ffffff;
  border-radius: 1px;
}

.update-button:hover {
  cursor: pointer;
  border: 1px solid #2B3743;
  color: #2B3743;
}

</style>

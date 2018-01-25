<template>
    <div class="pewa-update-box">
<!-- header -->
        <div class="update-header">
          <div>{{ action.encounterAction }}</div>
          <div>{{ action.encounterTitle }}</div>
          
        </div>
        <div class="update-details">
        <div class="update-values">
<!-- date -->
            <div class="update-date">
              <div>
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </div>
              <div>
                <input type="date" value="status.encounterDate" v-model="status.encounterDate">
              </div>              
            </div>
<!-- season -->
            <div v-if="status.elementType === 'TVSERIES'" class="update-season">
              <div v-on:mouseover="showList(seasonList)"
                  v-on:mouseout="hideList(seasonList)">
                  <div class="select-list-header season">  
                    <div>
                      season&nbsp&nbsp{{ status.season }}
                    </div>
                    <div>
                      <i v-if="seasonList.visibility == 'hidden'" class="fa fa-chevron-left" aria-hidden="true"></i>
                      <i v-else class="fa fa-chevron-down" aria-hidden="true"></i>
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
                          <!-- &squf;&nbsp  -->
                          season&nbsp&nbsp{{ item }}   
                    </div>
                  </div>       
              </div>
            </div>
<!-- media type -->
            <div class="update-media-type">
<!-- list header -->
                <div>
                  <div class="select-list-header source"
                    v-on:mouseover="showList(sourceList)"
                    v-on:mouseout="hideList(sourceList)">  
                    <div>
                      {{ getFormattedSource }}
                    </div>
                    <div>
                      <i v-if="sourceList.visibility == 'hidden'" class="fa fa-chevron-left" aria-hidden="true"></i>
                      <i v-else class="fa fa-chevron-down" aria-hidden="true"></i>
                      <!-- <i v-if="sourceList.visibility == 'hidden'" class="fa fa-caret-left" aria-hidden="true"></i>
                      <i v-else class="fa fa-caret-down" aria-hidden="true"></i> -->
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
                          <!-- &squf;&nbsp  -->
                          {{ item.id }}
                    </div>
                  </div>       
                </div>         
            </div>
<!-- rating horizontal select element -->
            <div class="update-rating">
              <div class="horizontal-list" 
                v-on:mouseout="hideStars()">
                <div 
                    v-for="(item, index) in 10"
                    v-bind:key="index" 
                    v-on:load="hideStars()"
                    v-on:mouseover="showStars(item)"
                    v-on:click="setRating(item, ratingList)"
                    v-bind:id="'star-' + item">
                  <i class="fa fa-star list-on" aria-hidden="true"></i>
                </div>
              </div>
              <div>
                {{ encounter.encounterRating }}/10
              </div>  
           
            </div>

        </div>
<!-- comment -->
          <div class="update-comment">
            <div>
              <textarea class="pewa-update-comment" v-model="status.comment" v-bind:placeholder="status.comment">
              </textarea>
            </div>
          </div>
      </div>
<!-- footer -->
        <div class="update-footer">    
          <div>
            <button class="update-button" v-on:click="submitStatus" name="close" type="button">
              <i class="fa fa-check" aria-hidden="true"></i>
              Submit</button>
          </div>        
          <div>
            <button class="update-button" v-on:click="closeWindow" name="close" type="button">
              <i class="fa fa-times" aria-hidden="true"></i>
              Cancel</button>
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
    },
    statusManager: {
      type: Object,
      required: true
    },
    externalElement: {
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
    console.log("init internal status");
    console.log(this.status);
  },
  mounted() {
    this.hideStars();
  },
  computed: {
    // assign external status object to interla object and format date value
    action: function() {
      var encounterAction = "";
      var encounterTitle = "";
      switch (this.itemObject.type) {
        case "ANIME":
          encounterTitle = this.itemObject.titleEnglish;
          break;
        case "MANGA":
          encounterTitle = this.itemObject.titleEnglish;
          break;
        case "MOVIE":
          encounterTitle = this.itemObject.engTitle;
          break;
        case "TVSERIES":
          encounterTitle = this.itemObject.title;
          break;
        case "BOOK":
          encounterTitle = this.itemObject.polishTitle;
          break;
      }
      switch (this.statusManager.action) {
        case "addstatus":
          encounterAction = "add new encounter for: ";
          break;
        case "updstatus":
          encounterAction = "update encounter for: ";
          break;
        default:
          encounterAction = "add new encounter for: ";
          encounterTitle = this.externalElement.altTitle;
          break;
      }
      return { encounterAction, encounterTitle };
    },
    status: function() {
      if (this.encounter != null) {
        this.newEncounter = this.encounter;
        var data =
          this.encounter.encounterDate === ""
            ? new Date(Date.now())
            : new Date(this.encounter.encounterDate);
        this.newEncounter.encounterDate = data.toISOString().slice(0, 10);
      }
      return this.newEncounter;
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
      let s = 1;
      if (this.itemObject.season) {
        s = this.itemObject.season;
      }
      return s;
    },
    // user friendly enum formatter
    getFormattedSource: function() {
      let obj = this.selectMedia.filter(x => {
        return x.val == this.encounter.mediaSource;
      })[0].id;
      return obj;
    },
    computedRating: function() {
      // this.showStars(this.encounter.encounterRating);
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
    // set rating
    setRating: function(item, list) {
      this.newEncounter.encounterRating = item;
      this.showStars(this.encounter.encounterRating);
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
    },
    // highlight rating stars
    showStars: function(item) {     
      for (var i = 1; i <= item; i++) {
        document.getElementById("star-" + i).style.color = "#ffe140";
      }
      for (var i = item + 1; i <= 10; i++) {
        document.getElementById("star-" + i).style.color = "#fff";
      }
    },
    // on mouse out of rating div set highlight to rating object value
    hideStars: function() {
      this.showStars(this.encounter.encounterRating);
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
  width: 800px;
  padding: 0px;
  margin: 0px;
  top: 10%;
  /* font-size: 0.9em; */
  /* resize: both;
  overflow: hidden; */
  /* border: 1px solid #7C5E04; */
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.update-header {
  border-radius: 10px 10px 0px 0px;
  background-color: #7c3204;
  color: #e7bca1;
  text-align: center;
  padding: 5px 0px 5px 0px;
}

.update-header > div:nth-of-type(2) {
  font-size: 1.2em;
  font-weight: bold;
  color: #e7bca1;
}

.update-values {
  display: flex;
  justify-content: center;
  background-color: #bf6730;
  color: #dedede;
  border-bottom: 1px solid #401a02;
}

.update-values > div {
  font-size: 0.9em;
  position: relative;
  display: flex;
  align-items: center;
  height: 2.8em;
}

.update-values > div:hover {
  color: #fff;
}

.update-values > div > div {
  line-height: 2em;
  align-items: center;
  margin: 0px 10px 0px 10px;
}

.update-values input {
  border: none;
  background-color: #e7bca1;
  text-align: center;
  /* color: red; */
}

.select-list-header {
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
  margin: 0px;
  position: relative;
  border-left: 1px dotted #e7bca1;
  border-right: 1px dotted #e7bca1;
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
  width: 120px;
}

.select-list {
  margin: 0px;
  background-color: none;
  /* border: 1px solid #A7A7A7; */
  position: absolute;
  color: #000;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.list-item {
  text-align: center;
  padding: 2px 10px;
  border-bottom: 1px dotted #a7a7a7;
  background-color: #e7bca1;
  color: #000;
}

.list-item:hover {
  color: #ff6200;
  background-color: #f0f0f0;
}

.horizontal-list {
  display: flex;
  flex-direction: row;
}

.fa-star {
  font-size: 1.2em;
  padding: 1px;
}

.update-comment {
  width: 100%;
  height: 400px;
  border: none;
}

.update-comment > div {
  border: none;
  height: 100%;
  /* background-color: #ffffff; */
}

textarea {
  border: none;
  padding: 10px;
  width: 100%;
  height: 100%;
  resize: none;
  text-align: justify;
}

.update-footer {
  height: 40px;
  padding: 0px;
  margin: 0px;
  border-radius: 0px 0px 10px 10px;
  border-top: 1px solid #401a02;
  background-color: #a63f00;
  background-color: #7c3204;
  color: #c7c7c7;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.update-button {
  font-size: 1em;
  border: none;
  width: 8em;
  height: 2em;
  background-color: inherit;
  font-weight: bold;
  color: #dedede;
  border-radius: 1px;
}

.update-button:hover {
  cursor: pointer;
  border: 1px solid #ffe140;
  color: #ffe140;
}
</style>

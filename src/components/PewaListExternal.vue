<template>
<div class="list">
        <div class="list-header">
          <!-- filter, elements count-->
          <div class="list-search">
            <input type="text" v-model="filteredName" placeholder="search..."/>
            <span>{{ this.itemBodySize }}</span>
          </div>
          <!-- sorting buttons -->
          <div class="list-sort">
              <div class="list-header-1">
                <span>sort: </span>
              </div>
              <div class="list-header-2">
                <a href="javascript:;" v-on:click="setSortingColumn('type')">type</a>
                <span> | </span>
              </div>
              <div class="list-header-3">
                <a href="javascript:;" v-on:click="setSortingColumn('title')">title</a>
                <span> | </span>
              </div>
              <div class="list-header-4">
                <a href="javascript:;" v-on:click="setSortingColumn('date')">year</a>
              </div>
          </div>
        </div>
        <!-- table header -->
        <div class="list-item-header">
            <div class="list-item-header-1">
              <b>Type</b>
            </div>
            <div class="list-item-header-2">
              <b>Title</b>
            </div>
            <div class="list-item-header-3">
              <b>Year</b>              
            </div>
        </div>
        <!-- table content -->
        <div 
        v-for="(item, index) of filteredResults"  
        
        v-on:mouseover="rowIn(index, item)" 
        v-on:mouseout="rowOut(index)" 
        v-on:click="addSelectedElementToDB(item)" 
        v-bind:key="index" 
        v-bind:style="rowEncounter"
        class="list-general">    
          <div class="list-item-level-1"
          v-bind:id="'item-' + index">
            <div v-bind:style="setDistinctType(item.type)" class="list-item-type">
              {{ item.type }}
            </div>
            <div class="list-item-title">
              {{ getShortTitle(item.title) }}
            </div>
            <div class="list-item-year">
              {{ new Date(item.date).getFullYear() }}
            </div>
          </div>
          <div class="full-desc"
              v-bind:id="'desc-' + index">
              <div class="full-desc-title">
                {{ item.title }} 
                ({{ new Date(item.date).getFullYear() }})
              </div>
              <div class="full-desc-text">
                {{ item.description }}
              </div>
                
          </div> 
        </div>
        
          <div class="list-item-footer">
            <div class="footer-prev-button">
              <button class="list-footer-buttons" v-if="previousVisible" v-on:click="setPageLoadRange('minus')">
                Previous
              </button>
            </div>
            <div class="footer-page-counter">
              {{ listPage }} of {{ totalPages }}
            </div>
            <div class="footer-next-button">
              <button class="list-footer-buttons" v-if="nextVisible" v-on:click="setPageLoadRange('plus')">
              Next
              </button>
            </div>
          </div>
        
        
</div>
</template>

<script>
export default {
  name: "pewa-list-external",
  props: {
    defaultList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      itemList: this.defaultList,
      itemBodySize: 0,
      filteredName: "",
      sortField: "id",
      sortDescending: false,
      elementId: 0,
      rowEncounter: {
        backgroundColor: "#669900"
      },
      shortTitleLength: 42,
      listPage: 1,
      elementsPerPage: 18,
      range: { min: Number, max: Number }
    };
  },
  created() {
    setDefaultListRange: {
      this.range.min = 0;
      this.range.max = this.elementsPerPage;
    }
    this.itemList = this.defaultList;
    emitFirstElementOnLoad: {
      // this.selectElement(this.defaultList[0]);
    }
  },
  computed: {
    filteredResults: function() {
      let query = this.filteredName.toLowerCase();
      let filteredItemList = this.itemList.filter(x => {
        let title = x.title ? x.title.toLowerCase() : "";
        let year = x.date ? new Date(x.date).getFullYear() : "0000";
        let desc = x.description ? x.description.toLowerCase() : "";
        let combinedFields = title + year + desc;
        return combinedFields.match(query);
      });
      this.itemBodySize = filteredItemList.length;
      let finalList = filteredItemList.sort(
        this.sortingCustom(this.sortField, this.sortDescending)
      );
      return finalList.slice(this.range.min, this.range.max);
    },
    previousVisible: function() {
      if (this.listPage - 1 <= 0) return false;
      else return true;
    },
    nextVisible: function() {
      if (this.listPage * this.elementsPerPage + 1 > this.itemBodySize)
        return false;
      else return true;
    },
    totalPages: function() {
      return Math.ceil(this.itemBodySize / this.elementsPerPage);
    }
  },
  methods: {
    setPageLoadRange: function(n) {
      this.listPage = n === "plus" ? this.listPage + 1 : this.listPage - 1;
      let pageRange = this.listPage * this.elementsPerPage;
      let maxDifference = 0;
      this.range.min = pageRange - this.elementsPerPage;
      if (this.itemBodySize / pageRange < 1) {
        maxDifference = pageRange - this.itemBodySize - 1;
      }
      this.range.max = this.listPage * this.elementsPerPage - maxDifference;
      // console.log(this.listPage);
      // console.log("min: " + this.range.min + " nax: " + this.range.max);
    },
    // funkcja sortowania
    sortingCustom: function(field, reverse, primer) {
      var key = primer
        ? function(x) {
            return primer(x[field]);
          }
        : function(x) {
            return x[field];
          };
      reverse = !reverse ? 1 : -1;
      return function(a, b) {
        return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
      };
    },
    // zmiana parametru sortowania i kierunek sortowania
    setSortingColumn: function(element) {
      if (element == this.sortField) {
        this.sortDescending = !this.sortDescending;
      } else {
        this.sortField = element;
        this.sortDescending = false;
      }
    },
    //wybór elementu który jest dodawany do bazy
    addSelectedElementToDB: function(elem) {
      this.$emit("addelement", elem);
    },
    // najazd na pozycję
    rowIn: function(id, item) {
      var selected = "item-" + id;
      var description = "desc-" + id;
      if (item.description != null && item.description.length != 0) {
        document.getElementById(description).style.visibility = "visible";
      }
      document.getElementById(selected).style.backgroundColor = "#c2c2a3";
    },
    rowOut: function(id) {
      var selected = "item-" + id;
      var description = "desc-" + id;
      document.getElementById(selected).style.backgroundColor = "#669900";
      document.getElementById(description).style.visibility = "hidden";
    },
    // set background color for specified type
    setDistinctType: function(data) {
      var style = {};
      switch (data) {
        case "MOVIE":
          style = {
            backgroundColor: "#ff99ff"
          };
          break;
        case "ANIME":
          style = {
            backgroundColor: "#80ffff"
          };
          break;
        case "MANGA":
          break;
      }
      return style;
    },
    getShortTitle: function(data) {
      let endMarker = 0;
      let output = "";
      if (data != undefined && data.length > this.shortTitleLength) {
        endMarker = data.slice(0, this.shortTitleLength).lastIndexOf(" ");
        output = data.slice(0, endMarker) + "...";
      } else if (
        data != undefined &&
        data.length <= this.shortTitleLength
      ) {
        output = data.slice(0, data.length);
      }
      return output;
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 2px;
}
.list {
  background-color: #669900;
  width: 500px;
  cursor: pointer;
  position: relative;
}


.list-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-sort {
  font-size: 80%;
  float: left;
}

.list-header-1 {
  /* width: 10%; */
  float: left;
}

.list-header-2 {
  /* width: 11%; */
  float: left;
}

.list-header-3 {
  /* width: 9%; */
  float: left;
}

.list-header-4 {
  /* width: 14%; */
  float: left;
}

.list-header-5 {
  /* width: 10%; */
  float: left;
}

.list-item-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.list-item-header-1 {
  width: 14%;
}
.list-item-header-2 {
  width: 70%;
}
.list-item-header-3 {
  width: 10%;
}

.list-general {
  height: 2em;
  padding: 0px;
}

.list-item-level-1 {
  /* padding: 5px; */
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.list-item-type {
  width: 18%;
}
.list-item-title {
  width: 72%;
}
.list-item-year {
  width: 10%;
}

.full-desc {
  visibility: hidden;
  z-index: 1;
  position: relative;
  left: 102%;
  top: -4em;
  padding: 0px;
}

.full-desc-title {
  font-size: 14pt;
  border-radius: 3px 3px 0px 0px;
  border-bottom: solid 1px #fff2e6;
  padding: 3px;
  color: #fff2e6;
  background-color: #994d00;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.full-desc-text {
  border-radius: 0px 0px 3px 3px;
  padding: 5px;
  color: #fff2e6;
  background-color: #e67300;
  text-align: justify;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.list-item-footer {
  width: 100%;
  position: absolute;
  bottom: 2px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-footer-buttons {
  width: 100%;
}

.footer-prev-button {
  width: 25%;
}

.footer-next-button {
  width: 25%;
}
</style>
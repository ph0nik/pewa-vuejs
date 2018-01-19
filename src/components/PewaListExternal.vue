<template>
    <div class="list">
        <div class="list-header">
<!-- filter, elements count-->
          <div>
            search results:&nbsp
            <span>{{ this.itemBodySize }}</span>
          </div>
          <div class="list-search">
            <input type="text" v-model="filteredName" placeholder="filter..."/>
          </div>
        </div>
<!-- table header -->
        <div class="list-item-header">
<!-- type header -->
            <div class="list-item-header-1 list-item-type-size" v-on:click="setSortingColumn('type')">
              <span>type</span>&nbsp
              <span v-if="this.sortField == 'type'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
<!-- title header -->
            <div class="list-item-header-2 list-item-title-size" v-on:click="setSortingColumn('altTitle')">
              <span>title</span>&nbsp
              <span v-if="this.sortField == 'altTitle'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
<!-- tear header -->
            <div class="list-item-header-3 list-item-year-size" v-on:click="setSortingColumn('date')">
              <span>year</span>&nbsp
              <span v-if="this.sortField == 'date'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
        </div>
<!-- table content -->
        <div class="external-list-content">
          <div 
          v-for="(item, index) of filteredResults"            
          v-bind:key="index" 
          v-bind:style="rowEncounter"
          class="list-general">    
<!-- list item first level -->
          <div class="list-item"
            v-on:click="addSelectedElementToDB(item)"
            v-on:mouseover="rowIn(index, item)"
            v-on:mouseout="rowOut(index)" 
            v-bind:id="'item-' + index">
<!-- type -->
            <div class="list-item-type list-item-type-size">
              <i v-if="item.type == 'MOVIE' || item.type == 'ANIME'" class="fa fa-film" aria-hidden="true"></i>          
              <i v-if="item.type == 'TVSERIES'" class="fa fa-television" aria-hidden="true"></i>
              <i v-if="item.type == 'BOOK' || item.type == 'MANGA'" class="fa fa-book" aria-hidden="true"></i>
              {{ setReadableType(item.type) }}
            </div>
<!-- item title -->
            <div class="list-item-title list-item-title-size">
              <span>{{ getShortTitle(item) }}</span>
            </div>
<!-- year -->
            <div class="list-item-year list-item-year-size">
              {{ new Date(item.date).getFullYear() }}
            </div>
          </div>
<!-- description floating window -->
          <div class="full-desc" v-bind:id="'desc-' + index" >
<!-- floating div arrow -->
            <div class="desc-arrow">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
<!-- floating div title -->
              <div class="full-desc-title">
                {{ item.title }} 
                ({{ new Date(item.date).getFullYear() }})
              </div>
<!-- floating div description -->
              <div class="full-desc-text">
                {{ item.description }}
              </div>                
            </div>
          </div> 
        </div>
      </div>
<!-- footer -->
      <div class="list-item-footer">
        <div class="footer-prev-button">
              <button class="list-footer-buttons" v-if="previousVisible" v-on:click="setPageLoadRange('minus')">
                <i class="fa fa-long-arrow-left" aria-hidden="true"></i>
                Previous
              </button>
              <div class="list-footer-buttons-placeholder" v-if="!previousVisible"></div>  
        </div>            
        <div class="footer-page-counter">
              {{ listPage }} of {{ totalPages }}
        </div>
        <div class="footer-next-button">
              <button class="list-footer-buttons" v-if="nextVisible" v-on:click="setPageLoadRange('plus')">
                Next
                <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
              </button>
              <div class="list-footer-buttons-placeholder" v-if="!nextVisible"></div>
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
      sortField: "altTitle",
      sortDescending: false,
      elementId: 0,
      rowEncounter: {},
      shortTitleLength: 42,
      listPage: 1,
      elementsPerPage: 20,
      descriptionVisible: {
        visibility: "hidden"
      },
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
      let title = "";
      let filteredItemList = this.itemList.filter(x => {
        let type = x.type.toLowerCase();
        let altTitle = x.altTitle ? x.altTitle.toLowerCase() : "";
        let title = x.title ? x.title.toLowerCase() : "";
        let year = x.date ? new Date(x.date).getFullYear() : "0000";
        let desc = x.description ? x.description.toLowerCase() : "";
        let combinedFields = type + altTitle + title + year + desc;
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
    setReadableType: function(type) {
      let readable = "";
      switch (type) {
        case 'ANIME':
          readable = "Anime"
          break;
        case 'MANGA':
          readable = "Manga"
          break;
        case 'TVSERIES':
          readable = "TV Series"
          break;
        case 'MOVIE':
          readable = "Movie"
          break;
        case 'BOOK':
          readable = "Book"
          break;
      }
      return readable;
    },
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
// emit selected element
    addSelectedElementToDB: function(elem) {
      this.$emit("addelement", elem);
    },
// mouse over item on list    
    rowIn: function(id, item) {
      var description = "desc-" + id;
      if (item.description != null && item.description.length != 0) {
        document.getElementById(description).style.visibility = "visible";
      }
    },
// mouse out
    rowOut: function(id) {
      var selected = "item-" + id;
      var description = "desc-" + id;
      document.getElementById(description).style.visibility = "hidden";
    },
// set background color for specified type  -deprecated
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
// shorten title string to fit table
    getShortTitle: function(data) {
      let title = "";
      if (data.altTitle) {
        title = data.altTitle;
      } else {
        title = data.title;
      }
      let endMarker = 0;
      let output = "";
      if (title != undefined && title.length > this.shortTitleLength) {
        endMarker = title.slice(0, this.shortTitleLength).lastIndexOf(" ");
        output = title.slice(0, endMarker) + "...";
      } else if (
        title != undefined &&
        title.length <= this.shortTitleLength
      ) {
        output = title.slice(0, title.length);
      }
      return output;
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  outline: none;
}
.list {
  position: relative;
  cursor: pointer;  
  width: 600px;
  padding: 0px;
  margin: 20px;
  color: #F0F0F0;
  border-radius: 0px;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #334251;
  border-radius: 10px 10px 0px 0px;
}

.list-header > div {
  color: #718497;
  font-size: 0.9em;
  padding: 2px 20px;
  line-height: 2em;
}

.list-header > div > span {
  padding: 5px;
  color: #fff;
}

.list-sort {
  font-size: 80%;
  float: left;
}

.list-search input {
  margin: 5px;
  text-align: center;
  line-height: 1.5em;
  font-size: 1em;
  border: none;
  background-color: #c7c7c7;
  border-radius: 2px;
}

.list-search input:focus {
  background-color: #F0F0F0;
}

.list-item-header {
  background-color: #718497;
  font-size: 0.9em;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-bottom: 1px solid #2b3743;
  padding: 3px;
  text-align: center;
}

.list-item-header > div:hover {
  color: #F9A551;
}

.list-item-type {
  text-align: center;
  font-variant: small-caps;
  font-weight: bold;
}

.list-item-type-size {
  width: 110px;
}


.list-item-title-size {
  width: 66%;
}

.list-item-year-size {
  text-align: center;
  width: 80px;
}

.external-list-content {
  background-color: #DEDEDE;
  min-height: 32.5em;
}

.list-general {
  position: relative;
  color: #000000;
}

.list-general:nth-child(odd) {
  background-color: #DEDEDE;
}

.list-general:nth-child(even) {
  background-color: #F0F0F0;
}

.list-item:hover {
  background-color: #e67300;
  color: #fff;
}

.list-item {
  height: 26px;
  font-size: 0.9em;
  padding: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.full-desc {
  display: flex;
  flex-direction: row;
  visibility: hidden;
  z-index: 1;
  width: 500px;
  position: absolute;
  left: 100%;
  top: -2em;
  padding: 0px;
  margin: 0px;
}

.desc-arrow > div:nth-of-type(1){
  height: 1.3em;
}
.desc-arrow > div:nth-of-type(2) {
  margin: 0px 4px 0px 4px;
  border-right: 20px solid #994d00;
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
}

.full-desc-title {
  font-size: 1em;
  padding: 5px 10px;
  border-style: solid;
  border-width: 2px 2px 0px 2px;
  border-color: #DEDEDE;
  color: #ffffff;
  border-radius: 5px 5px 0px 0px;
  background-color: #994d00;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.full-desc-text {
  border-radius: 0px 0px 5px 5px;
  border-style: solid;
  border-width: 0px 2px 2px 2px;
  border-color: #DEDEDE;
  min-height: 100px;
  padding: 5px;
  font-size: 0.9em;
  color: #000;
  background-color: #DEDEDE;
  text-align: justify;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.list-item-footer {
  padding: 0px;
  margin: 0px;
  background-color: #334251;
  border-top: 1px solid #2b3743;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 0px 0px 10px 10px;
}

.footer-page-counter {
  margin: 5px;
  line-height: 2em;
}

.list-footer-buttons {
  font-size: inherit;
  margin: 5px 20px;
  border: none;
  width: 120px;
  height: 2em;
  background-color: inherit;
  color: #b9b9b9;
  border-radius: 1px;
}

.list-footer-buttons-placeholder {
  margin: 0px 20px;
  border: none;
  width: 120px;
  background-color: inherit;
}

.list-footer-buttons:hover {
  cursor: pointer;
  border: 1px solid #e67300;  
  color: #e67300;
}
</style>
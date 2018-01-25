<template>
  <div class="list">
<!-- filter, elements count-->
      <div class="list-header">
          <div>
            search results:&nbsp
            [<span>{{ this.itemBodySize }}</span>]
          </div>
          <div class="list-search">
            <input type="text" v-model="filteredName" placeholder="filter..."/>
          </div>
        </div>
<!-- table header -->
        <div class="list-item-header">
<!-- type header -->
            <div class="list-item-header-1 list-item-type-size" v-on:click="setSortingColumn('type')">
              <span>type</span>
              <span v-if="this.sortField == 'type'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
<!-- title header -->
            <div class="list-item-header-2 list-item-title-size" v-on:click="setSortingColumn('title')">
              <span>title</span>
              <span v-if="this.sortField == 'title'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
<!-- year header -->
            <div class="list-item-header-3 list-item-year-size" v-on:click="setSortingColumn('year')">
              <span>year</span>
              <span v-if="this.sortField == 'year'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
<!-- rate header -->
            <div class="list-item-header-4 list-item-rating-size" v-on:click="setSortingColumn('encounterRating')">
              <span>rated</span>
              <span v-if="this.sortField == 'encounterRating'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>
<!-- date header -->
            <div class="list-item-header-5 list-item-date-size" v-on:click="setSortingColumn('encounterDate')">
              <span>date</span>
              <span v-if="this.sortField == 'encounterDate'">
                <i v-if="this.sortDescending == false" class="fa fa-sort-asc" aria-hidden="true"></i>
                <i v-if="this.sortDescending == true" class="fa fa-sort-desc" aria-hidden="true"></i>
              </span>
              <span v-else>&nbsp&nbsp</span>
            </div>            
        </div>
<!-- table header end         -->
<!-- table content -->
        <div class="list-content">
          <div 
          v-for="(item, index) of filteredResults"            
          v-bind:key="index" 
          v-bind:style="rowEncounter"
          class="list-general">    
<!-- list item first level -->
          <div class="list-item"
            v-on:click="selectElement(item)"
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
              <span>{{ getShortTitle(item) }} </span>
            </div>
<!-- year -->
            <div class="list-item-year list-item-year-size">
              {{ item.year }}
            </div>
<!-- rated -->
            <div class="list-item-rating list-item-rating-size">
                <span>{{ item.encounterRating }}</span>
                <i class="fa fa-star" aria-hidden="true"></i>
            </div>
<!-- date -->
            <div class="list-item-date list-item-date-size">
              {{ new Date(item.encounterDate).toLocaleDateString() }}
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
             [<span>{{ listPage + 1 }} of {{ totalPages }}</span>]
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
  name: "pewa-list",
  props: {
    defaultList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // itemList: this.setItemList,
      itemBodySize: 0,
      filteredName: "",
      sortField: "encounterDate",
      sortDescending: true,
      elementId: 0,
      rowEncounter: {
        oldBackground: ""
      },
      listPage: 0,
      totalPages: Number,
      elementsPerPage: 20,
      shortTitleLength: 42,
      range: {min:Number, max:Number}
    };
  },
  watch: {
  },
  created() {
    this.range.min = 0;
    this.range.max = this.elementsPerPage;
    emitFirstElementOnLoad:  {
      this.setSortingColumn('encounterDate');
      this.sortDescending = true;
      var sorted = this.defaultList.sort(
        this.sortingCustom(this.sortField, this.sortDescending)
      );
      this.selectElement(this.defaultList[0]);
    };
  },
  computed: {
// watches and updates props list element    
    setItemList: function() {
      console.log(this.defaultList);
      return this.defaultList;
    },
// filtering and sorting function    
    filteredResults: function() {
      this.addLatestStatus();
      // let filteredItemList = this.setItemList.filter(itemList => {
      //   let title = itemList.title.toLowerCase();
      //   let altTitle = (itemList.engTitle) ? itemList.engTitle.toLowerCase() : "";
      //   let year = itemList.year;
      //   let all = title + altTitle + year;
      //   return all.includes(this.filteredName.toLowerCase());
        // return itemList.title
        //   .toLowerCase()
        //   .match(this.filteredName.toLowerCase());
      // });
      // this.itemBodySize = filteredItemList.length;
      // let finalList = filteredItemList.sort(
      //   this.sortingCustom(this.sortField, this.sortDescending));
      // return finalList.slice(this.range.min, this.range.max);

      let query = this.filteredName.toLowerCase();
      let title = "";
      let filteredItemList = this.setItemList.filter(x => {
        let type = x.type.toLowerCase();
        let altTitle = (x.engTitle) ? x.engTitle.toLowerCase() : "";
        let title = x.title ? x.title.toLowerCase() : "";
        let year = x.year;
        let combinedFields = type + altTitle + title + year;
        return combinedFields.includes(query);
      });
      this.itemBodySize = filteredItemList.length;
      let finalList = filteredItemList.sort(
        this.sortingCustom(this.sortField, this.sortDescending)
      );
      let output = this.collectAndDivide(finalList);
      this.totalPages = output.length;      
      this.listPage = (this.listPage > this.totalPages) ? 0 : this.listPage;
      return output[this.listPage];
    },
    // returns true of there's preceding page with items, sets previous button visible
    previousVisible: function() {
      return (this.listPage <= 0) ? false : true;
    },
    // return true if there's following page with items, sets next button visible
    nextVisible: function() {
      return (this.listPage + 1 < this.totalPages) ? true : false;
    }
  },
  methods: {
// Divides given array in chunks of defined size and returns array of arrays
    collectAndDivide: function(arr) {
      let arrSize = arr.length;
      let newArr = [];
      let tempArr = []
      for (var i = 0; i < arrSize; i++) {  
        if (i == arrSize - 1) {
          tempArr.push(arr[i]);
          newArr.push(tempArr);
        } else if (i % this.elementsPerPage == 0 && i != 0) {          
          newArr.push(tempArr);
          tempArr = [];
          tempArr.push(arr[i]);
        } else {
          tempArr.push(arr[i]);
        }        
      }
      return newArr;
    },
// format type string
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
    // select latest status from status array
    addLatestStatus: function() {
      var item;
      console.log(this.setItemList);
      for (item of this.setItemList) {
        var status = this.getLatest(item.status);
        item["encounterDate"] = status.encounterDate
          ? status.encounterDate
          : "";
        item["encounterRating"] = status.encounterRating
          ? status.encounterRating
          : "";
        item["mediaSource"] = status.mediaSource ? status.mediaSource : "";
        item["addedDate"] = status.addedDate ? status.addedDate : "";
      }
    },
    setPageLoadRange: function(n) {
      this.listPage = (n === 'plus')
        ? this.listPage + 1
        : this.listPage - 1;
        let pageRange = this.listPage * this.elementsPerPage;
        let maxDifference = 0;
        this.range.min = pageRange - this.elementsPerPage;
        if (this.itemBodySize / pageRange < 1) {
          maxDifference = pageRange - this.itemBodySize - 1;
        }
        this.range.max = this.listPage * this.elementsPerPage - maxDifference; 
    },
// get latest encounter date from array of encounters    
    getLatest: function(item) {
      var sorted = item.sort(function(a, b) {
        return a.encounterDate - b.encounterDate;
      });
      return sorted[sorted.length - 1];
    },
// custom sorting
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
// set column used for sorting
    setSortingColumn: function(element) {
      if (element == this.sortField) {
        this.sortDescending = !this.sortDescending;
      } else {
        this.sortField = element;
        this.sortDescending = false;
      }
    },
// emit selected element
    selectElement: function(elem) {
      this.$emit("selectelement", elem);
    },
// shorten title string to fit table
    getShortTitle: function(data) {
      let title = "";
      if (data.altTitle) {
        title = data.altTitle;
      } else if (data.engTitle) {
        title = data.engTitle
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
  /* background-color: #806000; */
  /* background-color: #b38600; */
  /* background-color: #806000; */
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

.list-filter-input {
  border: 2px solid #bebebe;
  border-radius: 2px;
  font-size: 14pt;
  color: #ffffff;
  outline:none;
}

.list-filter-input:focus {
  border: 2px solid #b38600;
}

.list-item-header {
  background-color: #718497;
  font-size: 0.9em;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-bottom: 1px solid #2b3743;
  /* padding: 3px; */
  text-align: center;
}

.list-item-header > div {
  padding: 3px;
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
  width: 16%;
}

.list-item-title-size {
  width: 48%;
}

.list-item-year-size {
  text-align: center;
  width: 10%;
}

.list-item-rating-size {
  text-align: center;
  width: 12%;
}

.list-item-rating {
  padding: 0px 20px 0px 0px;
  text-align: right;
}

.list-item-rating-size > .fa-star {
  color: #a68c00;
}

.list-item-date-size {
  text-align: center;
  width: 16%;
}

.list-content {
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
  color: #718497;
}

.footer-page-counter {
  margin: 5px;
  line-height: 2em;
}

.footer-page-counter > span {
  margin: 0px 5px;
  color: #F0F0F0;
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
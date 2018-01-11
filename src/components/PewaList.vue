<template>
  <div class="list">
        <!-- nagłówek listy -->
      <div class="list-header">
            <!-- filtrowanie -->
            <div class="list-filter list-sort-common">
              <input type="text" class="list-filter-input" v-model="filteredName" placeholder="filter..."/>
              <span>results found: {{ this.itemBodySize }}</span>
            </div>
            <!-- sortowanie -->
            <div class="list-sort">
              <div class="list-header-1 list-sort-common">
                <span>sort: </span>
              </div>
              <div class="list-sort-title list-sort-common">
                <a href="javascript:;" v-on:click="setSortingColumn('title')">title</a> |
              </div>
              <div class="list-sort-year list-sort-common">
                <a href="javascript:;" v-on:click="setSortingColumn('year')">year</a> |
              </div>
              <div class="list-sort-rating list-sort-common">
                <a href="javascript:;" v-on:click="setSortingColumn('encounterRating')">rating</a> |
              </div>
              <div class="list-sort-date list-sort-common">
                <a href="javascript:;" v-on:click="setSortingColumn('encounterDate')">date</a>
              </div>
            </div>
      </div>
      <div class="list-item-header-bg">
        <div class="list-item-header">
          <div class="list-item-type list-header-common">Type</div>
          <div class="list-item-title list-header-common">Title</div>
          <div class="list-item-year list-header-common">Year</div>
          <div class="list-item-rating list-header-common">Rating</div>
          <div class="list-item-date list-header-common">Last seen</div>
        </div>
      </div>
      
      <div> 
        <!-- lista -->
        <div v-for="(item, index) of filteredResults"  
        v-bind:id="'item-' + index" 
        v-on:mouseover="rowIn(index)" 
        v-on:mouseout="rowOut(index)" 
        v-on:click="selectElement(item)" 
        v-bind:key="index" 
        v-bind:style="rowEncounter">
        <!-- v-bind:style="rowEncounter(index)" -->
          <div class="list-item-level-1" v-bind:class="{even: index % 2, odd: !(index % 2)}" >
            <!-- v-bind:style="setClassName(item.type)" -->
            <div v-bind:style="setClassName(item.type)" class="list-item-type list-item-common" v-bind:id="'type-' + index" >{{ item.type }}</div>
            <div class="list-item-title list-item-common" v-bind:id="'title-' + index" >{{ item.title }}</div>
            <div class="list-item-year list-item-common" v-bind:id="'year-' + index" >{{ item.year }}</div>
            <div class="list-item-rating list-item-common" v-bind:id="'rating-' + index" >{{ item.encounterRating }}</div>
            <div class="list-item-date list-item-common" v-bind:id="'date-' + index" >{{ new Date(item.encounterDate).toLocaleDateString() }}</div>
          </div>          
        </div>
        <div class="list-item-footer">
          <div>
            <button class="list-footer-buttons" v-if="previousVisible" v-on:click="setPageLoadRange('minus')">
              Previous
            </button>
          </div>
          <div>
            {{ listPage }} of {{ totalPages }}
          </div>
          <div>
            <button class="list-footer-buttons" v-if="nextVisible" v-on:click="setPageLoadRange('plus')">
            Next
            </button>
          </div>
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
      sortField: "id",
      sortDescending: true,
      elementId: 0,
      rowEncounter: {
        oldBackground: ""
      },
      listPage: 1,
      elementsPerPage: 10,
      range: {min:Number, max:Number}
      // długość listy / ilość elementów na stronę = ilość wszystkich stron
      // pokazuj przyciski jeśli ilość elementów listy jest większa niż ilość el. na stronę
      // 1 * 10 - 1, 2 * 10 - 1
    };
  },
  watch: {
  },
  created() {
    this.range.min = 0;
    this.range.max = this.elementsPerPage;
    // this.rowEncounter.oldBackground
    // addLatestStatus: {
    //   var item;
    //   for (item of this.setItemList) {
    //     var status = this.getLatest(item.status);
    //     item["encounterDate"] = status.encounterDate
    //       ? status.encounterDate
    //       : "";
    //     item["encounterRating"] = status.encounterRating
    //       ? status.encounterRating
    //       : "";
    //     item["mediaSource"] = status.mediaSource ? status.mediaSource : "";
    //     item["addedDate"] = status.addedDate ? status.addedDate : "";
    //   }
    // };
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
    setItemList: function() {
      return this.defaultList;
    },
    // filtrowanie i sortowanie elementów
    filteredResults: function() {
      this.addLatestStatus();
      let filteredItemList = this.setItemList.filter(itemList => {
        return itemList.title
          .toLowerCase()
          .match(this.filteredName.toLowerCase());
      });
      this.itemBodySize = filteredItemList.length;
      let finalList = filteredItemList.sort(
        this.sortingCustom(this.sortField, this.sortDescending));
      return finalList.slice(this.range.min, this.range.max);
    },
    setTypeBackground: function() {
      var backgroundColor = this.typeBackground;
      return backgroundColor;
    },
    previousVisible: function() {
      if (this.listPage - 1 <= 0) return false;
      else return true;
    },
    nextVisible: function() {
      if (this.listPage * this.elementsPerPage + 1 > this.itemBodySize) return false;
      else return true;
    },
    totalPages: function() {
      return Math.ceil(this.itemBodySize / this.elementsPerPage);
    }
  },
  methods: {
    // select latest status from status array
    addLatestStatus: function() {
      var item;
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
    // szukanie najnowszej daty w macierzy
    getLatest: function(item) {
      var sorted = item.sort(function(a, b) {
        return a.encounterDate - b.encounterDate;
      });
      return sorted[sorted.length - 1];
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
    // najazd na pozycję
    // TODO poprawić podświetlenie tekstu pozycji
    rowIn: function(id) {
      let selectedRow = "item-" + id;
      this.rowEncounter.oldBackground = document.getElementById(selectedRow).style.backgroundColor;
      document.getElementById(selectedRow).style.backgroundColor = "#6666ff";
      let title = "title-" + id;
      this.rowEncounter.oldFontColor = document.getElementById(title).style.color;
      document.getElementById(title).style.color = "#ffffff";
      
    },
    rowOut: function(id) {
      let selectedRow = "item-" + id;
      // document.getElementById(selectedRow).style.backgroundColor = "#669900";
      document.getElementById(selectedRow).style.backgroundColor = this.rowEncounter.oldBackground;
      let title = "title-" + id;
      document.getElementById(selectedRow).style.color = this.rowEncounter.oldFontColor;
    },
    // set background color for specified type
    setClassName: function(data) {
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

.list {
  /* background-color: #000033; */
  width: 600px;
  cursor: default;
  margin: 5px;
  color: white;
  z-index: 0;
}

.list-header {
  background-color: #806000;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-sort-common {
  padding: 5px;
  font-size: 80%;
}

.list-filter-input {
  border: 2px solid #bebebe;
  background-color: #806000;
  border-radius: 2px;
  font-size: 14pt;
  color: #ffffff;
  outline:none;
}

.list-filter-input:focus {
  border: 2px solid #b38600;
}

.list-filter {

}

.list-sort {

}

.list-header-common {
  font-weight: bold;
  float: left;
  padding: 5px 5px 5px 5px;
  background-color: #b38600;
  color: #fff9e6;
  /* border-bottom: 1px solid #ffffff; */
  margin-bottom: 2px;
}

.list-item-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;  
}

.list-item-header-bg {
  padding: 0px;
  /* background: linear-gradient(to right,#b38600,#ffffff,#b38600); */
  background-color: #ffffff;
}

.list-header-1 {
  /* width: 10%; */
  float: left;
}

.list-sort-title {
  /* width: 11%; */
  float: left;
}

.list-sort-year {
  /* width: 9%; */
  float: left;
}

.list-sort-rating {
  /* width: 14%; */
  float: left;
}

.list-sort-date {
  /* width: 10%; */
  float: left;
}

/* .list-item-level-1:nth-child(odd) {
  background-color: red;
} */

.even {
  background-color: #34495E;
}

.odd {
  background-color: #2C3E50;
}

.list-item-level-1 {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0px;
  cursor: pointer;
}

.list-item-common {
  padding: 4px;
  
  float: left;
}

.list-item-type {
  text-align: center;
  width: 16%;
}

.list-item-title {
  width: 60%;
}

.list-item-year {
  text-align: center;
  width: 10%;
}

.list-item-rating {
  text-align: center;
  width: 10%;
}

.list-item-date {
  text-align: center;
  width: 18%;
}

.list-item-level-2 {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.list-item-4 {
  font-size: 90%;
}

.list-item-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-footer-buttons {
  width: 100px;
}

</style>
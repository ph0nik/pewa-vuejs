<template>
  <div id="main-window">

<!-- layer covering all the other layers -->
    <div class="cover-for-update"
      v-if="updateWindowVisible">
    </div>
      
<!-- confirm action on delete of item or status -->
    <pewa-confirm
      class="pewa-update-window"
      v-bind:status-manager="statusManager"
      v-bind:item-object="elementDetails"
      v-on:closeconfirm="confirmVisible = false"
      v-on:proceed="deleteElement"
      v-if="confirmVisible">      
    </pewa-confirm>
<!-- update window -->
      <pewa-update-window 
        class="pewa-update-window"
        v-if="updateWindowVisible" 
        v-bind:encounter="statusRequest" 
        v-bind:item-object="elementDetails"
        v-bind:status-manager="statusManager"
        v-bind:external-element="externalElement"
        v-on:closeupdate="closeUpdateWindow"
        v-on:submit="statusBridge($event)">
      </pewa-update-window>

<!-- mid wrapper -->
    <div class="mid-wrapper">

      <div class="list-and-search">


<!-- search component       -->
      <pewa-search 
          class="search-component"
          v-on:searchencounter="searchEncounterByQuery($event)"
          v-on:gohome="loadOnStart()">
      </pewa-search>
      
<!-- loading cover -->
<!-- v-if="!dataReady" -->
      <div v-if="!dataReady" class="loading-window-lists" v-bind:style="loadingWindowPanel">
          <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          <p>Loading...</p>
      </div>

<!-- internal list -->
      <pewa-list
        class="pewa-list-component"
        v-if="dataReady && internalListVisible" 
        v-bind:default-list="resultsTable" 
        v-on:topelement="setTopListElement($event)"
        v-on:selectelement="getSelectedElement($event)">
      </pewa-list>

      <!-- dodać widocznośc listy i zmienić zawartość -->
<!-- external list -->
      <pewa-list-external
        class="pewa-list-external-component"
        v-if="dataReady && externalListVisible" 
        v-bind:default-list="externalResultsTable" 
        v-on:addelement="addNewElement($event)">
      </pewa-list-external>

      </div>

<!-- right column -->
      <div class="details-and-status">

<!-- loading panel -->
      <div v-if="!detailsReady.status" class="loading-window-details" v-bind:style="loadingWindowPanel">
          <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          <p>Loading...</p>
      </div>


      <pewa-details-anime
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'anime'" 
        v-bind:status-visible="statusVisible"
        v-bind:item-object="elementDetails" 
        v-on:updateencounter="openUpdateWindow($event)"
        v-on:showstatus="statusVisible = $event">
      </pewa-details-anime>
<!-- manga component -->
      <pewa-details-manga
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'manga'" 
        v-bind:status-visible="statusVisible"
        v-bind:item-object="elementDetails" 
        v-on:updateencounter="openUpdateWindow($event)"
        v-on:showstatus="statusVisible = $event">
      </pewa-details-manga>

<!-- tv component -->
      <pewa-details-tv
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'tvseries'" 
        v-bind:item-object="elementDetails" 
        v-bind:window-size="windowSize"
        v-bind:status-visible="statusVisible"
        v-bind:endpoint="restMainEndpoint"
        v-on:updatetv="updateElement($event)"
        v-on:deletetv="confirmDelete"
        v-on:showstatus="statusVisible = $event">
      </pewa-details-tv>

<!-- movie component -->
      <pewa-details-movie 
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'movie'" 
        v-bind:status-visible="statusVisible"
        v-bind:item-object="elementDetails" 
        v-bind:window-size="windowSize"
        v-on:updatemovie="updateElement($event)"
        v-on:deletemovie="confirmDelete"
        v-on:showstatus="statusVisible = $event">>
      </pewa-details-movie>

<!-- book component -->
      <pewa-details-book
        class="component" 
        v-if="detailsReady.status && detailsReady.type == 'book'" 
        v-bind:item-object="elementDetails" 
        v-bind:status-visible="statusVisible"
        v-on:updatebook="updateElement($event)"
        v-on:showstatus="statusVisible = $event">
      </pewa-details-book>

<!-- status component -->
      <pewa-status
        class="component"
        v-if="detailsReady.status && statusVisible"
        v-bind:item-object="elementDetails"
        v-on:updatestatus="updateEncounter($event)"
        v-on:deletestatus="deleteEncounter($event)"
        v-on:addstatus="addEncounter($event)">
      </pewa-status>
      </div>

    </div>

    <pewa-footer
      v-bind:info="searchResults">

    </pewa-footer>
    <!-- <router-view/> -->
    
  </div>
</template>

<script>
import PewaHeader from "./components/PewaHeader";
import PewaSearch from "./components/PewaSearch";
import PewaList from "./components/PewaList";
import PewaDetails from "./components/PewaDetails";
import PewaFooter from "./components/PewaFooter";
import PewaUpdateWindow from "./components/PewaUpdateWindow";
import PewaDetailsAnime from "./components/PewaDetailsAnime";
import PewaDetailsMovie from "./components/PewaDetailsMovie";
import PewaDetailsManga from "./components/PewaDetailsManga";
import PewaDetailsBook from "./components/PewaDetailsBook";
import PewaDetailsTv from "./components/PewaDetailsTv";
import PewaListExternal from "./components/PewaListExternal";
import PewaStatus from "./components/PewaStatus";
import PewaConfirm from "./components/PewaConfirm";
import axios from "axios";
import { HTTP, pewaHttp } from "./http-comon";

export default {
  name: "app",
  data() {
    return {
      restMainEndpoint: "http://localhost:8081",
      internalListVisible: true,// set internal list visibility
      updateWindowVisible: false,// set update window visibility
      lastQueryObject: { // last query send to external search
        externalSearch: false,
        query: ""
      },
      initialData: [], // initial data from internal db
      externalData: [], // search results from external db
      externalElement: {}, // element selected from external results list
      searchResults: {}, // search results from internal db
      topElementFromInternal: {}, // top element emited by internal list
      elementDetails: {}, // details of element selected from internal list
      idNumber: 0,
      dataReady: false, // are search results ready to be shown
      detailsReady: { // are selected item details ready to be shown
        status: false,
        type: ""
      },
      loadingWindow: { // loading window visibility
        status: false
      },
      urlModifier: "",
      confirmVisible: false, // confirmation window visibility
      statusVisible: false, // status window visibility
      statusRequest: {}, // status object to be sent to db
      addNewItem: false, // are you adding new item
      statusManager: { // status manager object, informs of action to be taken
        action: "addmovie"
      },
      selectedTitle: String, // selected element title
      windowSize: {// size of component loaded on the right side, it refreshes every time new set of data is loaded
        width: Number,
        height: Number
      },
      errors: []
    };
  },
  components: {
    "pewa-header": PewaHeader,
    "pewa-search": PewaSearch,
    "pewa-list": PewaList,
    "pewa-footer": PewaFooter,
    "pewa-status": PewaStatus,
    "pewa-update-window": PewaUpdateWindow,
    "pewa-details-anime": PewaDetailsAnime,
    "pewa-details-manga": PewaDetailsManga,
    "pewa-details-movie": PewaDetailsMovie,
    "pewa-details-book": PewaDetailsBook,
    "pewa-details-tv": PewaDetailsTv,
    "pewa-list-external": PewaListExternal,
    "pewa-confirm": PewaConfirm
  },
  created() {
    this.loadOnStart(); 
  },
  computed: {
    getWindowSize: function() {
      return this.windowSize;
    },
    externalListVisible: function() {
      return !this.internalListVisible;
    },
    resultsTable: function() {
      return this.initialData;
    },
    externalResultsTable: function() {
      return this.externalData;
    },
    loadingWindowPanel: function() {
      let thisStyle = {
        width: this.windowSize.width + "px",
        height: this.windowSize.height + "px"
      };
      return thisStyle;
    },
    // sets element to be show on the right panel
    getElement: function() {

    }
  },
  methods: {
    // ładowanie tabeli na starcie
    loadOnStart: function() {
      console.log("created & start button");
      let initStatus = "status/30";
      pewaHttp
        .get(initStatus)
        .then(response => {
          this.internalListVisible = true;
          this.searchResults = response.data;
          this.initialData = this.searchResults.encounters;
          this.dataReady = true;
          console.log(this.initialData);
        })
        .catch(e => {
          this.dataReady = false;
          this.errors.push(e);
        });
    },
// get details about element selected from list
    getEncounterDetails: function(url, type) {
      this.detailsReady.type = type;
      this.detailsReady.status = false;
      this.loadingWindow.visible = true;
      pewaHttp
        .get(url)
        .then(response => {
          this.elementDetails = response.data.encounters[0];
          // notifies that response was procesed
          this.loadingWindow.visible = false;
          this.detailsReady.status = true;
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    setInternalData: function(item) {
      this.initialData.push(item);
    },
    setExternalData: function(item) {
      this.externalData.push(item);
    },
    // TODO paginacja wyników + ograniczyć ilość linijek opisu (po najechaniu zsczegóły)
    searchEncounterByQuery: function(queryObject) {
      var query = queryObject.query;
      var scope = queryObject.externalSearch;
      if (
        this.lastQueryObject.externalSearch === scope &&
        this.lastQueryObject.query === query
      ) {
        if (scope === true) {
          this.internalListVisible = false;
        } else {
          this.internalListVisible = true;
        }
      } else {
        this.initialData = [];
        this.externalData = [];
        var extended =
          queryObject.externalSearch === false
            ? "search/internal/"
            : "search/external/";
        extended += queryObject.query;
        this.dataReady = false;
        pewaHttp
          .get(extended)
          .then(response => {
            this.searchResults = response.data;
            this.lastQueryObject.query = query;
            this.lastQueryObject.externalSearch = scope;
            if (queryObject.externalSearch === false) {
              this.searchResults.encounters.forEach(this.setInternalData);
              this.internalListVisible = true;
            } else {
              this.searchResults.encounters.forEach(this.setExternalData);
              console.log(this.externalData);
              this.internalListVisible = false;
            }
            this.dataReady = true;
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    // TODO znaleźć gdzie następuje ładowanie pierwszego elementu z listy
    // get selected element from db
    getSelectedElement: function(object) {
      let modurl = "";
      let type = "";
      // TODO dodać statyczne endpointy
      // opracować widok detali
      if (object) {
        switch (object.type) {
          case "ANIME":
            modurl = "anime/id/" + object.id;
            type = "anime";
            break;
          case "MANGA":
            modurl = "manga/id/" + object.id;
            type = "manga";
            break;
          case "MOVIE":
            modurl = "movie/id/" + object.id;
            type = "movie";
            break;
          case "TVSERIES":
            modurl = "tv/id/" + object.id;
            type = "tvseries";
            break;
          case "BOOK":
            modurl = "book/id/" + object.id;
            type = "book";
            break;
        }
        this.elementDetails = {};
        this.idNumber = object.id;
        this.selectedTitle = object.title;
        this.getEncounterDetails(modurl, type);
        // console.log(this.initialData[this.idNumber].body);
      }
    },
    // get details of last shown element
    getLastSelectedElement: function() {
      if (this.elementDetails.type != null) {
        this.getSelectedElement({
          type: this.elementDetails.type,
          id: this.elementDetails.id
        });
      }
    },
    // change visibility of update window
    closeUpdateWindow: function() {
      this.updateWindowVisible = false;
      this.getLastSelectedElement();
    },
    // delete selected status
    deleteEncounter: function(data) {
      this.statusManager.action = "deleteStatus";
      var extend = "status/delete/" + data;
      var message = "Selected status will be deleted, continue?";
      if (window.confirm(message)) {
        pewaHttp
          .get(extend)
          .then(response => {
            this.searchResults.message = response.data.message;
            this.searchResults.resultsFound = response.data.resultsFound;
            this.searchResults.rowsAffected = response.data.rowsAffected;
          })
          .catch(error => {
            console.log(error);
          });
        this.getLastSelectedElement();
      }
      // naprawić reakcję po wykonaniu czynności
    },
// confirm deleting element or status
    confirmDelete: function() {
      console.log(this.elementDetails);
      this.statusManager.action = "deleteItem";
      this.confirmVisible = true;      
    },
    deleteElement: function() {
      this.confirmVisible = false;      
      let data = this.elementDetails;
      let extend;
      switch (data.type) {
        case "TVSERIES":
          extend = "tv/delete/" + data.id;
          break;
        case "MOVIE":
          extend = "movie/delete/" + data.id;
          break;
        case "ANIME":
          extend = "anime/delete/" + data.id;
          break;
        case "MANGA":
          extend = "manga/delete/" + data.id;
          break;
        case "BOOK":
          extend = "book/delete/" + data.id;
          break;
      }
      console.log(extend);
      pewaHttp
        .get(extend)
        .then(response => {
          console.log("delete");
          this.searchResults.message = response.data.message;
          this.searchResults.resultsFound = response.data.resultsFound;
          this.searchResults.rowsAffected = response.data.rowsAffected;
          // TODO po usunieciu automatycznie laduje pierwszy elemen z listy lub wisi jesli zostal usuniety pierwszy element
          this.loadOnStart();
          console.log("delete function: " + this.topElementFromInternal.title);
          
          
          // this.getSelectedElement(this.topElementFromInternal);
          // if (this.dataReady) console.log(this.topElementFromInternal.title);
        })

        .catch(error => {
          if (!error.response) {
            console.log("Error 4xx - network problem");
          } else {
            this.searchResults.message = response.data.message;
          }
        });
    },
    updateElement: function(data) {
      let extend;
      switch (data.type) {
        case "TVSERIES":
          extend = "tv/update/" + data.tvMazeId;
          break;
        case "MOVIE":
          extend = "movie/update/" + data.tmdbId;
          break;
        case "ANIME":
          extend = "anime/update" + data.tvMazeId;
          break;
        case "MANGA":
          extend = "manga/update" + data.tvMazeId;
          break;
        case "BOOK":
          extend = "book/update" + data.tvMazeId;
          break;
      }
      pewaHttp
        .get(extend)
        .then(response => {
          this.searchResults.message = response.data.message;
          this.searchResults.resultsFound = response.data.resultsFound;
          this.searchResults.rowsAffected = response.data.rowsAffected;
          this.getLastSelectedElement();
          this.loadOnStart(); 
        })
        .catch(error => {
          if (!error.response) {
            console.log("Error 4xx - network problem");
          } else {
            this.searchResults.message = response.data.message;
          }
        });
      
    },
    statusBridge: function(data) {
      console.log(this.statusRequest);
      this.updateWindowVisible = false;
      this.statusRequest.elementType = this.elementDetails.type;
      this.statusRequest.mediaSource = data.mediaSource;
      this.statusRequest.encounterDate = data.encounterDate;
      this.statusRequest.encounterId = data.encounterId;
      this.statusRequest.encounterRating = data.encounterRating;
      this.statusRequest.season = data.season ? data.season : 0;
      this.statusRequest.comment = data.comment;
      this.statusRequest.statusId = data.statusId ? data.statusId : 0;
      var extend;
      switch (this.statusManager.action) {
        case "addstatus":
          extend = "status/add";
          break;
        case "updstatus":
          extend = "status/update";
          break;
        case "addmovie":
          extend = "movie/add/";
          this.statusRequest.elementType = "MOVIE";          
          break;
        case "addanime":
          extend = "anime/add/";
          this.statusRequest.elementType = "ANIME";
          break;
        case "addmanga":
          extend = "manga/add/";
          this.statusRequest.elementType = "MANGA";
          break;
        case "addtv":
          extend = "tv/add/";
          this.statusRequest.elementType = "TVSERIES";
          break;
        case "addbook":
          extend = "book/add/";
          this.statusRequest.elementType = "BOOK";
          break;
      }
      var postData = this.statusRequest;
      console.log("extend: " + extend);
      console.log(postData);

      pewaHttp
        .post(extend, postData)
        .then(response => {
          console.log(response);
          this.searchResults.message = response.data.message;
          this.searchResults.resultsFound = response.data.resultsFound;
          this.searchResults.rowsAffected = response.data.rowsAffected;
          this.getLastSelectedElement();
        })
        .catch(error => {
          console.log(error);
        });
      
    },
    addEncounter: function(encounterId) {
      console.log(this.elementDetails);
      this.statusManager.action = "addstatus";
      var date = new Date().toISOString().slice(0, 10);
      this.statusRequest = {
        elementType: this.elementDetails.type,
        encounterId: encounterId,
        mediaSource: "CINEMA",
        encounterDate: date,
        encounterRating: 10,
        comment: ""
      };
      if (this.elementDetails.type.includes("TVSERIES")) {
        // this.statusRequest.season = this.elementDetails.seasons;
        this.statusRequest.totalSeasons = this.elementDetails.seasons;
      }
      console.log("add encounter");
      console.log(this.statusRequest);
      this.updateWindowVisible = true;
    },
    updateEncounter: function(status) {
      this.statusManager.action = "updstatus";
      let tempEncounter = {};
      // assign selected encounter object to statusRequest object
      if (this.elementDetails.type != null) {
        tempEncounter = (this.elementDetails.type === "TVSERIES") ? this.elementDetails.internalStatus[status] : this.elementDetails.status[status];
        this.statusRequest = Object.assign({}, tempEncounter);
        this.statusRequest.elementType = this.elementDetails.type;
        this.statusRequest.totalSeasons = (this.statusRequest.elementType == "TVSERIES") ? this.elementDetails.seasons : 1;
        console.log(this.statusRequest);
      }
      this.updateWindowVisible = true;
    },

    // ustawia parametry dodawanego filmu, odpala status -> status do requesta
    addNewElement: function(data) {
      this.statusRequest.encounterId = data.idInt;
      this.statusRequest.elementType = data.type;
      console.log(data.idInt);
      this.externalElement = data;
      switch (this.statusRequest.elementType) {
        case "ANIME":
          this.statusManager.action = "addanime";
          this.statusRequest.mediaSource = "VIDEO";
          break;
        case "MANGA":
          this.statusManager.action = "addmanga";
          this.statusRequest.mediaSource = "COMPUTER";
          break;
        case "MOVIE":
          this.statusManager.action = "addmovie";
          this.statusRequest.mediaSource = "CINEMA";
          break;
        case "TVSERIES":
          this.statusManager.action = "addtv";
          this.statusRequest.mediaSource = "TV";
          break;
        case "BOOK":
          this.statusManager.action = "addbook";
          this.statusRequest.mediaSource = "BOOK";
          break;
      }
      var date = new Date().toISOString().slice(0, 10);
      this.statusRequest.comment = "";
      this.statusRequest.encounterDate = date;
      this.statusRequest.encounterRating = 10;
      this.statusRequest.season = this.elementDetails.season;
      this.updateWindowVisible = true;
    },
    setTopListElement: function(elem) {
      this.topElementFromInternal = elem;
      console.log("app: " + this.topElementFromInternal.title);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
@import url("https://fonts.googleapis.com/css?family=Oxygen");

#main-window {
  /* padding: 10px; */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: inherit;
  align-items: center;
  /* width: 1200px; */
  /* height: 1200px; */
  font-family: "Oxygen", sans-serif;
}

body {
  background-color: #131B23;
  /* position: relative;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  margin: 0px;
  padding: 0px; */
}

.compontent {
}

.list-and-search {
  width: 640px;
}

.details-and-status {
  width: 610px;
}

.loading-window-lists {  
  z-index: 10;
  background-color: #131B23;
  opacity: 0.7;
  position: absolute;
  text-align: center;
  width: 620px;
  min-height: 400px;
  padding: 0px;
  margin: 20px;
  color: #F0F0F0;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-window-details {
  z-index: 10;
  background-color: #131B23;
  opacity: 0.7;
  position: absolute;
  text-align: center;
  width: 620px;
  min-height: 400px;
  padding: 0px;
   margin: 20px;
  color: #F0F0F0;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-for-update {
  position: absolute;
  z-index: 9;
  visibility: visible;
  background-color: #000000;
  opacity: 0.5;
  width: 100%;
  height: 100%;
}

.search-component {
  position: relative;
  z-index: 2;
}


.pewa-update-window {
  z-index: 10;
  position: absolute;
}

.mid-wrapper {
  /* width: 100%; */
  z-index: 3;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0px;
  min-height: 600px;
}

</style>

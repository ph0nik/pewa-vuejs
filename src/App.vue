<template>
  <div id="app">
    <div class="cover-for-update"
      v-if="updateWindowVisible">
    </div>

      <pewa-update-window 
        class="pewa-update-window"
        v-if="updateWindowVisible" 
        v-bind:encounter="statusRequest" 
        v-on:closeupdate="closeUpdateWindow"
        v-on:submit="statusBridge($event)">
      </pewa-update-window>

    <div class="mid-wrapper">      
      
      <div class="list-and-search">
        <pewa-search 
          v-on:searchencounter="searchEncounterByQuery($event)"
          v-on:gohome="loadOnStart()">
        </pewa-search>

      <pewa-list
        class="pewa-list-component"
        v-if="dataReady && internalListVisible" 
        v-bind:default-list="resultsTable" 
        v-on:selectelement="getSelectedElement($event)">
      </pewa-list>

      <!-- dodać widocznośc listy i zmienić zawartość -->
      <pewa-list-external
        class="pewa-list-external-component"
        v-if="dataReady && externalListVisible" 
        v-bind:default-list="externalResultsTable" 
        v-on:addelement="addNewElement($event)">
      </pewa-list-external>

      </div>

      <div class="details-and-status">

      <!-- <pewa-details-switch
        class="pewa-details-switch-component"
        v-if="detailsReady.status"
        v-bind:item-object="elementDetails" >
      </pewa-details-switch> -->

      <pewa-details-anime
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'anime'" 
        v-bind:item-object="elementDetails" 
        v-on:updateencounter="openUpdateWindow($event)">
      </pewa-details-anime>

      <pewa-details-manga
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'manga'" 
        v-bind:item-object="elementDetails" 
        v-on:updateencounter="openUpdateWindow($event)">
      </pewa-details-manga>

      <pewa-details-tv
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'tvseries'" 
        v-bind:item-object="elementDetails" 
        v-bind:endpoint="restMainEndpoint"
        v-on:updatetv="updateElement($event)">
      </pewa-details-tv>

      <pewa-details-movie 
        class="component"
        v-if="detailsReady.status && detailsReady.type == 'movie'" 
        v-bind:item-object="elementDetails" 
        v-on:updatemovie="updateElement($event)">
      </pewa-details-movie>

      <pewa-details-book
        class="component" 
        v-if="detailsReady.status && detailsReady.type == 'book'" 
        v-bind:item-object="elementDetails" 
        v-on:updatebook="updateElement($event)">
      </pewa-details-book>

      <pewa-status
        class="component"
        v-if="detailsReady.status"
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
import PewaDetailsSwitch from "./components/PewaDetailsSwtich";
import axios from "axios";
import { HTTP, pewaHttp } from "./http-comon";

export default {
  name: "app",
  data() {
    return {
      restMainEndpoint: "http://localhost:8081",
      internalListVisible: true,
      updateWindowVisible: false,
      lastQueryObject: {
        externalSearch: false,
        query: ""
      },
      initialData: [],
      externalData: [],
      searchResults: {},
      elementDetails: {},
      idNumber: 0,
      dataReady: false,
      detailsReady: {
        status: false,
        type: ""
      },
      urlModifier: "",
      // updateObject: {},
      statusRequest: {},
      addNewItem: false,
      statusManager: {
        action: "addmovie"
      },
      selectedTitle: String
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
    "pewa-details-switch": PewaDetailsSwitch
  },
  created() {
    this.loadOnStart();
    console.log('app created');
    if (this.dataReady) {
      console.log('details ->' + this.elementDetails);
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
          // console.log(this.searchResults);
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    // pobieranie informacji dodatkowych o wybranym elemencie
    getEncounterDetails: function(url, type) {
      this.detailsReady.type = type;
      this.detailsReady.status = false;
      pewaHttp
        .get(url)
        .then(response => {
          this.elementDetails = response.data.encounters[0];
          // notifies that response was procesed
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
    // change visibility of update windo
    closeUpdateWindow: function() {
      this.updateWindowVisible = false;
      this.getLastSelectedElement();
    },
    // delete selected status
    deleteEncounter: function(data) {
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
    updateElement: function(data) {
      console.log(data);
      let extend;
      switch (data.type) {
        case "TVSERIES":
          extend = "tv/updatea/" + data.tvMazeId;
          break;
        case "MOVIE":
          extend = "movie/update/" + data.tmdbId;
          break;
        case "ANIME":
          extend = "tv/update" + data.tvMazeId;
          break;
        case "MANGA":
          extend = "tv/update" + data.tvMazeId;
          break;
        case "BOOK":
          extend = "tv/update" + data.tvMazeId;
          break;
      }
      pewaHttp
        .get(extend)
        .then(response => {
          this.searchResults.message = response.data.message;
          this.searchResults.resultsFound = response.data.resultsFound;
          this.searchResults.rowsAffected = response.data.rowsAffected;
        })
        .catch(error => {
          if (!error.response) {
            console.log("Error 4xx - network problem");
          } else {
            this.searchResults.message = response.data.message;
          }
        });
      this.getLastSelectedElement();
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
        })
        .catch(error => {
          console.log(error);
        });
      this.getLastSelectedElement();
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
        this.statusRequest.season = this.elementDetails.seasons;
      }
      console.log("add encounter");
      console.log(this.statusRequest);
      this.updateWindowVisible = true;
    },
    updateEncounter: function(status) {
      this.statusManager.action = "updstatus";
      this.statusRequest = status;
      console.log(this.elementDetails.type);
      if (this.elementDetails.type != null) {
        status.elementType = this.elementDetails.type;
      }
      // TODO poprawić updateObject na statusRequest
      // this.updateObject = status;
      console.log("app main");
      console.log(status);
      this.updateWindowVisible = true;
    },

    // ustawia parametry dodawanego filmu, odpala status -> status do requesta
    addNewElement: function(data) {
      this.statusRequest.encounterId = data.idInt;
      this.statusRequest.elementType = data.type;
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
    }
  },
  computed: {
    externalListVisible: function() {
      return !this.internalListVisible;
    },
    resultsTable: function() {
      return this.initialData;
    },
    externalResultsTable: function() {
      return this.externalData;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
@import url("https://fonts.googleapis.com/css?family=Oxygen");

#app {
  /* display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; */
  position: relative;
  width: 1200px;
  height: 1200px;
  font-family: "Oxygen", sans-serif;
}

body {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  margin: 0px;
  padding: 0px;
  /* background: linear-gradient(to bottom, #1b1b1b, #2e2e1f); */
  /* background-color: #22313f; */
  background-color: #131B23;

  /* height: 1000px; */
}

.pewa-list-component {
  z-index: 1;
  position: relative;
}

.cover-for-update {
  position: absolute;
  z-index: 2;
  visibility: visible;
  background-color: #000000;
  opacity: 0;
  width: 100%;
  height: 100%;
}

.pewa-update-window {
  z-index: 3;
  position: absolute;
}

.mid-wrapper {
  /* width: 100%; */
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0px;
  min-height: 600px;
}

.list-and-search {
}

.details-and-status {
}

.component {
}

pewa-details-book {

}
</style>

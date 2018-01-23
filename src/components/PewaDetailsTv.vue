<template>
    <div class="details" >
<!-- detale - górna belka       -->
        <div class="details-tv-title-bar">
<!-- tytuł -->
            <div> {{ this.titleBar }}
              <a href="javascript:;" v-on:click="getYear(realoadedData)">
                ( {{ new Date(realoadedData.premiered).getFullYear() }} )
              </a>
            </div>
<!-- ocena -->
            <div>
              <i class="fa fa-star" aria-hidden="true"></i>
                {{ realoadedData.ratingAvg }}
                <span class="out-of-ten">
                  /&nbsp10
                </span>
            </div>
        </div>
        <div class="details-tv-title-bar2">
<!-- type -->
          <div>
            <i class="fa fa-television" aria-hidden="true"></i>
            TV
          </div>
          &nbsp&squf;&nbsp
<!-- czas trwania -->
          <div>
            {{ realoadedData.runtime }} min.
          </div>            
          &nbsp&squf;&nbsp
<!-- gatunek -->
          <div v-for="(item, index) of realoadedData.genres" v-bind:key="index">
            <a href="javascript:;" v-on:click="getGenre(item)">
              {{ item.genre }}
            </a>
            <span v-if="index < realoadedData.genres.length - 1">
              ,&nbsp
            </span>  
          </div>
          &nbsp&squf;&nbsp
<!-- rodzaj -->
          <div>
            {{ realoadedData.showType }}
          </div>
          &nbsp&squf;&nbsp
<!-- status -->
          <div>
            {{ realoadedData.status }}
          </div>
        </div>
<!-- przyciski na górnej belce -->
        <div class="details-tv-title-select">
<!-- details button -->
          <div>
            <div>
              <button class="details-tv-button" v-on:click="setDetails">
                <i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp
                details
                </button>
            </div>
            <div class="details-tv-title-arrow-wrapper">
              <div v-if="detailsVisible" class="details-tv-title-arrow"></div>
            </div>        
          </div>
<!-- episodes button -->
          <div>
            <div>
              <button class="details-tv-button" v-on:click="setEpisodes">
                <i class="fa fa-list-ul" aria-hidden="true"></i>&nbsp
                episodes
                </button>
            </div>
            <div class="details-tv-title-arrow-wrapper">
              <div v-if="episodesVisible" class="details-tv-title-arrow"></div>
            </div>
          </div>
<!-- encounters button -->
          <div>
            <div>
              <button class="details-tv-button" v-on:click="setStatus">
                <i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp
                encounters
                </button>
            </div>
            <div class="details-tv-title-arrow-wrapper">
              <div v-if="encounterVisible" class="details-tv-title-arrow"></div>
            </div>
          </div>  
        </div>
<!-- warstwa detali -->
        <div v-if="detailsVisible">
          <div class="details-tv-full-title">
<!-- full title -->
            {{ realoadedData.title }}
          </div>
          <div class="poster-box-tv">
            <div>
<!-- plot -->
              <div class="details-tv-plot">
                {{realoadedData.summary}}
              </div>
<!-- creators -->
              <div class="details-tv-people">created by:
                <div v-for="(item, index) of creators" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a> 
                </div>
              </div>
<!-- producers -->
              <div class="details-tv-people">produced by: <br />
                <div v-for="(item, index) of producers" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a>
                  &nbsp({{ item.job }})
                </div>
              </div>      
            </div>
<!-- poster div -->
            <div class="details-tv-poster-right">
<!-- poster -->
                <img class="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize">
                <!-- <div class="poster-div" v-bind:style="imageSize"></div>   -->
<!-- poster links                 -->
                <div class="poster-links">
<!-- imdb -->
                  <div>
                    <a v-bind:href="imdbLink" target="_blank" v-bind:title="imdbLink">
                      <i class="fa fa-external-link-square" aria-hidden="true"></i>
                      imdb
                    </a>
                  </div>
<!-- tvmaze                   -->
                  <div>
                    <a v-bind:href="tvmazeLink" target="_blank" v-bind:title="tvmazeLink">
                      <i class="fa fa-external-link-square" aria-hidden="true"></i>
                      TvMaze
                    </a>
                  </div>                              
                </div>                
            </div>        
          </div>
<!-- end of poster div           -->
<!-- cast -->
          <div class="details-tv-people stars">
            <div>stars:
              <span v-for="(item, index) of this.actors" v-bind:key="index">
                <a href="javascript:;" v-on:click="getPerson(item)">
                {{ item.name }}
                </a>
              <span v-if="index < actors.length - 1">&squf;</span>    
              </span>         
            </div>
          </div>
<!-- additional info below cast           -->
          <div class="details-tv-people details-tv-bottom-info stars">
<!-- country of origin             -->
            <div> country:
              <a href="javascript:;" v-on:click="getCountry(realoadedData.country)">
              {{ realoadedData.country.country }}
              </a>
            </div>
            &nbsp&squf;&nbsp
<!-- language -->
            <div>language:
              <a href="javascript:;" v-on:click="getCountry(realoadedData.language)">
              {{ realoadedData.language.language }}
              </a>
            </div>
          </div>
<!-- encounter div -->
          <div class="encounter">
<!-- last seen date -->
            <div> 
              <i class="fa fa-calendar" aria-hidden="true">&nbsp</i>
              last seen:
              <span class="rating-full">
                {{ new Date(latestEncounter.encounterDate).toLocaleDateString() }}
              </span>
            </div>
            &nbsp&squf;&nbsp
<!-- rating -->
            <div class="rating">
              rated:&nbsp
              <span v-for="(index) of latestEncounter.encounterRating" v-bind:key="index">
                <i class="fa fa-star"></i>
              </span>
              <span v-for="(index) of (10 - latestEncounter.encounterRating)" v-bind:key="index">
                <i class="fa fa-star-o" aria-hidden="true"></i>
              </span>&nbsp
              <span class="rating-full">
                {{ latestEncounter.encounterRating }}
              </span>
              <span class="rating-full">
                /10
              </span>
            </div>
<!-- encounters link -->
            &nbsp&squf;&nbsp
            <div>
              <a href="#" v-on:click="setStatus">more...</a>
            </div>
          </div>
<!-- end of encounter div           -->
        </div>
<!-- end of details plane -->
<!-- episode list -->
        <div v-if="episodesVisible">
<!-- seasons list -->
            <div class="details-tv-seasons">seasons:
              <span v-for="(item, index) of realoadedData.seasons" v-bind:key="index">
                <a href="javascript:;" v-on:click="setSeason(item)">
                  [ {{ item }} ]
                </a>
              <span v-if="index < realoadedData.seasons - 1">&squf;</span>    
              </span>  
            </div>
<!-- selected season             -->
            <div class="details-tv-episode" v-for="(item, index) of showSeason" v-bind:key="index">
              <div>
                <div>
                  {{ episodeNumber(item.season, item.episode) }}
                  &squf;
                  <a v-bind:href="item.tvMazeUrl" target="_blank" v-bind:title="item.tvMazeUrl">
                  {{ item.epTitle }}
                  </a>      
                </div>
<!-- premiere date -->
                <div>
                  {{ new Date(item.firstAired).toDateString() }}
                </div>
              </div>   
<!-- episode summary              -->
              <div>
                {{ item.summary }}
              </div>          
            </div>            
        </div>
<!-- footer div         -->
        <div v-if="!encounterVisible" class="details-tv-footer-bar">
<!-- element date added -->
          <div>
            added: {{ new Date(realoadedData.dbDatetime).toUTCString() }}
          </div>
<!-- update tv button           -->
          <div>
            <button v-if="detailsVisible" class="details-tv-button" v-on:click="updateItem()" name="update" type="button">
            <i class="fa fa-refresh" aria-hidden="true"></i>
            update tv show
            </button>  
<!-- back to the top if episodes visible             -->
            <button v-if="episodesVisible" class="details-tv-button" onclick="location.href='#'" name="update" type="button">  
            back to top&nbsp
            <i class="fa fa-arrow-up" aria-hidden="true"></i>
            </button>  
          </div>
        </div>
    </div>
</template>

<script>
import PewaStatus from "./PewaStatus";

export default {
  name: "pewa-details-tv",
  props: {
    itemObject: {
      type: Object,
      required: true
    },
    endpoint: String,
    statusVisible: Boolean,
    windowSize: {
        width: Number,
        height: Number
      }
  },
  components: {
    "pewa-status": PewaStatus
  },
  data() {
    return {
      restAddress: "http://localhost:8081/",
      imgRest: "",
      imgLoaded: false,
      imgWidth: 200,
      producers: [],
      creators: [],
      actors: [],
      movieStaffShort: {
        display: "block"
      },
      details: true,
      episodes: false,
      encounters: false,
      visibleSeason: 1
    };
  },
  created() {
    let staff = this.itemObject.staff;
    for (var i = 0; i < staff.length; i++) {
      if (staff[i].job.toLowerCase().includes("producer")) {
        this.producers.push(staff[i]);
      } else if (staff[i].job.toLowerCase().includes("creator")) {
        this.creators.push(staff[i]);
      } else if (staff[i].job.toLowerCase().includes("actor")) {
        this.actors.push(staff[i]);
      }
    };
//   console.log(this.itemObject);
    if (this.statusVisible == true) {
      this.episodes = false;
      this.details = false;
    } else {
      this.details = true;
    }
  },
  computed: {
    // assign props object to computed value
    realoadedData: function() {
      return this.itemObject;
    },
    // shorten longer titles to fit top bar
    titleBar: function() {
      let shortTitleLength = 28;
      let output = "";
      let endMarker = 0;
      if (
        this.realoadedData != undefined &&
        this.realoadedData.title.length >= shortTitleLength
      ) {
        endMarker = this.realoadedData.title
          .slice(0, shortTitleLength)
          .lastIndexOf(" ");
        output = this.realoadedData.title.slice(0, endMarker) + "...";
      } else if (
        this.realoadedData != undefined &&
        this.realoadedData.title.length <= shortTitleLength
      ) {
        output = this.realoadedData.title.slice(0, this.realoadedData.title.length);
      }
      return output;
    },
    showSeason: function() {
      let filteredSeasonList = this.realoadedData.episodes.filter(item => {
        return item.season == this.visibleSeason;
      });
      return filteredSeasonList;
    },
    detailsVisible: function() {
      return this.details;
    },
    episodesVisible: function() {
      return this.episodes;
    },
    encounterVisible: function() {
      this.encounters = this.episodes || this.details ? false : true;
      return this.encounters;
    },
    // pobieranie adresu obrazka
    imageAddress: function() {
//      console.log("image address computed function");
      let link = this.realoadedData.intPosterOrg;
      return link.replace(".", this.endpoint);
    },
    // zmiana rozmiaru obrazka z zachowaniem proporcji
    imageSize: function() {
      var img = new Image();
      img.src = this.imageAddress;
      var imgRatio = img.naturalWidth / img.naturalHeight;
      var imageSize = {
        width: this.imgWidth.toString() + "px",
        height: Math.round(this.imgWidth / imgRatio) + "px"
      };
      // console.log(imageSize.height);
      return imageSize;
    },
    // zwraca adres imdb
    imdbLink: function() {
      return "http://www.imdb.com/title/" + this.realoadedData.imdbLink;
    },
    tvmazeLink: function() {
      return this.realoadedData.tvMazeUrl;
    },
    // szukanie najnowszej daty w macierzy
    latestEncounter: function() {
      let item = this.realoadedData.internalStatus;
      var sorted = item.sort((a, b) => {
        return a.encounterDate - b.encounterDate;
      });
      return sorted[sorted.length - 1];
    }
  },
  mounted:function(){
    this.getWindowSize();
  },
  methods: {
// set actual parent element size    
    getWindowSize: function() {
      this.windowSize.height = document.getElementsByClassName("details")[0].clientHeight;
      this.windowSize.width = document.getElementsByClassName("details")[0].clientWidth;
//      console.log(this.windowSize);
    },
    // formatowanie identyfikatorów sezonów i odcinków
    episodeNumber: function(s, ep) {
      let season;
      let episode;
      season = s.toString().length < 2 ? "s0" + s : "s" + s;
      episode = ep.toString().length < 2 ? "e0" + ep : "e" + ep;
      return season + episode;
    },
    // ustaw nr sezonu
    setSeason: function(id) {
      this.visibleSeason = id;
    },
    // detale widoczne
    setDetails: function() {
      this.details = true;
      this.episodes = false;
      this.$emit("showstatus", false);
    },
    // detale niewidoczne, epizody widoczne
    setEpisodes: function() {
      this.details = false;
      this.episodes = true;
      this.$emit("showstatus", false);
    },
    // emituj widok statusu
    setStatus: function() {
      this.details = false;
      this.episodes = false;
      this.$emit("showstatus", true);
    },
    // auktualizuj film
    updateItem: function() {
      this.$emit("updatetv", this.itemObject);
    },
    // TODO szukanie po wybranych
    getGenre: function(genre) {
      this.request = "/tv/genreId/" + genre.id;
      console.log(this.request);
    },
    getPerson: function(person) {
      this.request = "/tv/personId/" + person.id;
      console.log(this.request);
    },
    getCountry: function(country) {
      console.log(country);
      this.request = "/tv/countryId/" + country.id;
      console.log(this.request);
    },
    getLanguage: function(language) {
      this.request = "/tv/langId" + language.id;
      console.log(this.request);
    },
    getYear: function(item) {
      this.dateRange.yearIn = item.startDate;
      this.dateRange.yearOut = item.endDate;
      console.log(this.dateRange);
    },
    isLoaded: function(bool) {
      this.imgLoaded = bool;
    }
  }
};
</script>

<style scoped>
 /* @import '../../static/font-awesome-4.7.0/css/font-awesome.min.css'; */

* {
  box-sizing: border-box;
  padding: 0px;
  outline: none;
}

a:link,
a:visited,
a:active {
  text-decoration: none;
  color: #a68c00;
}

a:hover {
  color: #ffe140;
}

.fa-star {
  color: #ffe140;
  /* text-shadow: 2px 2px #a68c00; */
}

.fa-star-o {
  color: #a68c00;
}

.details {
  width: 600px;
  border: none;
  padding: 0px;
  margin: 5px 5px 0px 5px;
  background-color: #1c252e;
}

.details-tv-title-bar {
  display: flex;
  justify-content: space-between;
  line-height: 1.4em;
  font-size: 1.8em;
  font-weight: bold;
  background: linear-gradient(to right, #22313f, #2c3f50);
  color: #fff;
  padding: 0px 8px 0px 8px;
}

.details-tv-title-bar2 {
  border-bottom: 1px solid #b9b9b9;
  background-color: #505f6d;
  line-height: 1.5em;
  font-size: 1em;
  color: #e2e2e2;
  padding: 0px 10px 0px 10px;
  display: flex;
}

.details-tv-footer-bar {
  border-top: 1px solid #b9b9b9;
  background-color: #3b444d;
  font-size: 0.9em;
  color: #b9b9b9;
  padding: 0px 10px 0px 10px;
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 5px 0px;
}

.details-tv-footer-bar > div {
  line-height: 2em;
  margin: 4px;
}

.rating-star {
  width: 20px;
}

.out-of-ten {
  font-size: 0.6em;
}

.details-tv-plot {
  text-align: justify;
  color: #d4d4d4;
  margin: 10px;
}

.details-tv-full-title {
  border-bottom: 1px solid #2e353c;
  text-align: left;
  color: #6b8fd4;
  font-size: 1em;
  margin: 8px 10px 0px 10px;
}

.details-tv-people {
  padding: 2px 0px 4px 0px;
  border-top: 1px solid #2e353c;
  text-align: justify;
  color: #747474;
  font-size: 1em;
  margin: 6px 10px 0px 10px;
}

.stars {
  font-size: 0.9em;
}

.details-tv-seasons {
  padding: 14px;
  text-align: center;
  color: #747474;
  font-size: 1.1em;
}

.details-tv-episode {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  padding: 4px 10px;
}

.details-tv-episode > div:nth-of-type(1) {
  padding: 2px 6px 2px 6px;
  background-color: #2b3743;
  display: inherit;
  flex-direction: row;
  justify-content: space-between;
  color: #747474;
}

.details-tv-episode > div:nth-of-type(2) {
  padding: 2px 6px 10px 6px;
  text-align: justify;
  color: #d4d4d4;
}

.details-tv-bottom-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.details-tv-poster-right {
  display: flex;
  flex-direction: column;
  padding: 0px;
  margin: 8px 8px 8px 0px;
}

.poster {
  border: 1px solid #747474;
  border-radius: 0px;
  padding: 0px;
}

.poster-div {
  position: relative;
  border: 1px solid #747474;
}

.poster-box-tv {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.poster-links {
  position: relative;
  width: 100%;
  top: 6px;
  padding: 2px;
  margin: 0px;
  background-color: #2b3743;
  color: #747474;
  display: flex;
  justify-content: space-around;
}

.details-tv-button {
  border: none;
  width: 9.4em;
  height: 2.1em;
  /* background-color: #404b56; */
  background-color: inherit;
  color: #b9b9b9;
  border-radius: 1px;
}

.details-tv-button:hover {
  cursor: pointer;
  border: 1px solid #ffe140;
  color: #ffe140;
}

.details-tv-title-select {
  background-color: #2b3743;
  display: flex;
  flex-direction: row;
}

.details-tv-title-select > div {
  width: 34%;
  display: inherit;
  flex-direction: column;
  justify-content: center;
}

.details-tv-title-select > div button {
  margin: 6px;
}

.details-tv-title-select > div > div {
  display: inherit;
  justify-content: inherit;
}

.details-tv-title-arrow-wrapper {
  background-color: #1c252e;
  height: 7px;
}

.details-tv-title-arrow {
  background-color: #2b3743;
  width: 0px;
  height: 0px;
  border-left: 24px solid #1c252e;
  border-right: 24px solid #1c252e;
  border-top: 10px solid #2b3743;
}

.encounter {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 4px;
  border-top: 1px solid #2e353c;
  /* text-align: justify; */
  /* color: #747474; */
  color: #bdbdbd;
  font-size: 0.9em;
  margin: 6px 8px 0px 8px;
}

.rating {
  display: flex;
  flex-direction: row;
}

.rating > span {
  margin: 0px 1px 0px 0px;
}

.rating-full {
  color: #6b8fd4;
}
</style>


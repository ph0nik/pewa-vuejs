<template>
    <div class="details" >
        <!-- detale - górna belka       -->
        <div class="details-tv-title-bar">
          <!-- tytuł -->
            <div> {{ this.titleBar }}
              <!-- {{ itemObject.title }} -->
              <a href="javascript:;" v-on:click="getYear(itemObject)">
                ( {{ new Date(itemObject.premiered).getFullYear() }} )
              </a>
            </div>
            <!-- ocena -->
            <div>
              <img class="rating-star" src="../assets/filled_star-512.png" alt="">
                &nbsp{{ itemObject.ratingAvg }}
                <span class="out-of-ten">
                  &nbsp/&nbsp10
                </span>
            </div>
        </div>
        <div class="details-tv-title-bar2">
          <!-- type -->
          <div>
            TV
          </div>
          &nbsp&squf;&nbsp
          <!-- czas trwania -->
          <div>
            {{ itemObject.runtime }} min.
          </div>            
          &nbsp&squf;&nbsp
          <!-- gatunek -->
          <div v-for="(item, index) of itemObject.genres" v-bind:key="index">
            <a href="javascript:;" v-on:click="getGenre(item)">
              {{ item.genre }}
            </a>
            <span v-if="index < itemObject.genres.length - 1">
              ,&nbsp
            </span>  
          </div>
          &nbsp&squf;&nbsp
          <!-- rodzaj -->
          <div>
            {{ itemObject.showType }}
          </div>
          &nbsp&squf;&nbsp
          <!-- status -->
          <div>
            {{ itemObject.status }}
          </div>
        </div>
        <!-- przyciski na górnej belce -->
        <div class="details-tv-title-select">
          <!-- details -->
          <div>
            <div>
              <button class="details-tv-button" v-on:click="setDetails">details</button>
            </div>
            <div class="details-tv-title-arrow-wrapper">
              <div v-if="detailsVisible" class="details-tv-title-arrow"></div>
            </div>        
          </div>
          <!-- episodes -->
          <div>
            <div>
              <button class="details-tv-button" v-on:click="setEpisodes">episodes</button>
            </div>
            <div class="details-tv-title-arrow-wrapper">
              <div v-if="episodesVisible" class="details-tv-title-arrow"></div>
            </div>
          </div>
          <!-- encounters -->
          <div>
            <div>
              <button class="details-tv-button" v-on:click="setStatus">encounters</button>
            </div>
            <div class="details-tv-title-arrow-wrapper">
              <div v-if="encounterVisible" class="details-tv-title-arrow"></div>
            </div>
          </div>  
        </div>
        <!-- warstwa detali -->
        <div v-if="detailsVisible">
          <div class="details-tv-full-title">
            <!-- &squf;&nbsp -->
            {{ itemObject.title }}
          </div>
          <div class="poster-box-tv">
            <div>
              <!-- fabuła -->
              <div class="details-tv-plot">
                {{itemObject.summary}}
              </div>
              <!-- twórcy -->
              <div class="details-tv-people">created by:
                <div v-for="(item, index) of creators" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a> 
                </div>
              </div>
              <!-- producenci -->
              <div class="details-tv-people">produced by: <br />
                <div v-for="(item, index) of producers" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a>
                  &nbsp({{ item.job }})
                </div>
              </div>
      
            </div>
            <!-- poster -->
            <div class="details-tv-poster-right">
                <!-- <img class="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize"> -->
                <div class="poster-div" v-bind:style="imageSize">
                </div>  
                
                <div class="poster-links">
                  <div>links:</div>
                  <div>
                    <a v-bind:href="imdbLink" target="_blank" v-bind:title="imdbLink">&squf;&nbspimdb</a>
                  </div>
                  <div>
                    <a v-bind:href="tvmazeLink" target="_blank" v-bind:title="tvmazeLink">&squf;&nbspTvMaze</a>
                  </div>            
                </div>
                
            </div>        
          </div>
          <!-- obsada -->
          <div class="details-tv-people">
            <div>stars:
              <span v-for="(item, index) of this.actors" v-bind:key="index">
                <a href="javascript:;" v-on:click="getPerson(item)">
                {{ item.name }}
                </a>
              <span v-if="index < actors.length - 1">&squf;</span>    
              </span>         
            </div>
          </div>
          <!-- dodatkowe info pod obsadą -->
          <div class="details-tv-people details-tv-bottom-info">
            <!-- kraj produkcji -->
            <div> country:
              <a href="javascript:;" v-on:click="getCountry(itemObject.country)">
              {{ itemObject.country.country }}
              </a>
            </div>
            &nbsp&squf;&nbsp
            <!-- language -->
            <div>language:
              <a href="javascript:;" v-on:click="getCountry(itemObject.language)">
              {{ itemObject.language.language }}
              </a>
            </div>
          </div>
        </div>
        <!-- koniec warstwy detali -->
        <!-- listy odcinków -->
        <div v-if="episodesVisible">
            <!-- lista sezonów -->
            <div class="details-tv-seasons">seasons:
              <span v-for="(item, index) of itemObject.seasons" v-bind:key="index">
                <a href="javascript:;" v-on:click="setSeason(item)">
                  [ {{ item }} ]
                </a>
              <span v-if="index < itemObject.seasons - 1">&squf;</span>    
              </span>  
            </div>
            <!-- wybrany sezon -->
            <div class="details-tv-episode" v-for="(item, index) of showSeason" v-bind:key="index">
              <div>
                <div>
                  {{ episodeNumber(item.season, item.episode) }}
                  &squf;
                  <a v-bind:href="item.tvMazeUrl" target="_blank" v-bind:title="item.tvMazeUrl">
                  {{ item.epTitle }}
                  </a>      
                </div>
                <div>
                  {{ new Date(item.firstAired).toDateString() }}
                </div>
              </div>                
              <div>
                {{ item.summary }}
              </div>          
            </div>            
        </div>
        <!-- stopka -->
        <div v-if="!encounterVisible" class="details-tv-footer-bar">
          <!-- dodane -->
          <div>
            added: {{ itemObject.dbDatetime }}
          </div>
          <!-- update -->
          <div>
            <button v-if="detailsVisible" class="details-tv-button" v-on:click="updateItem()" name="update" type="button">
            update tv show
            </button>  
            <button v-if="episodesVisible" class="details-tv-button" onclick="location.href='#'" name="update" type="button">
            back to top
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
    endpoint: String
  },
  components: {
    "pewa-status": PewaStatus
  },
  data() {
    return {
      restAddress: "http://localhost:8081/",
      imgRest: "",
      imgLoaded: false,
      imgWidth: 220,
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
    }
    console.log(this.itemObject);
  },
  computed: {
    titleBar: function() {
      let shortTitleLength = 28;
      let output = "";
      let endMarker = 0;
      if (this.itemObject != undefined && this.itemObject.title.length >= shortTitleLength) {                    
        endMarker = this.itemObject.title.slice(0, shortTitleLength).lastIndexOf(" ");
        output = this.itemObject.title.slice(0, endMarker) + "...";
      } else if (this.itemObject != undefined && this.itemObject.title.length <= shortTitleLength) {
        output = this.itemObject.title.slice(0, this.itemObject.title.length);
      }
      return output;
    },
    showSeason: function() {
      let filteredSeasonList = this.itemObject.episodes.filter(item => {
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
      this.encounters = (this.episodes || this.details) ? false : true;      
      return this.encounters;
    },
    // setting background image as computed style
    backgroundBlurredImage: function() {
      let imageLink = 'url("' + this.imageAddress + '")';
      console.log(imageLink);
        return {
          backgroundImage : imageLink + 'blur(100px)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          };
    },
    // pobieranie adresu obrazka
    imageAddress: function() {
      console.log("image address computed function");
      let link = this.itemObject.intPosterOrg;
      return link.replace(".", this.endpoint);
    },
    // zmiana rozmiaru obrazka z zachowaniem proporcji
    imageSize: function() {
      var img = new Image();
      img.src = this.imageAddress;
      if (img && img.style) {
        var imgRatio = img.naturalWidth / img.naturalHeight;
        var imageSize = {
          backgroundImage: "url(" + this.imageAddress + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: this.imgWidth.toString() + "px",
          height: Math.round(this.imgWidth / imgRatio) + "px"
        };
      }
      // console.log(imageSize.height);
      return imageSize;
    },
    // zwraca adres imdb
    imdbLink: function() {
      return "http://www.imdb.com/title/" + this.itemObject.imdbLink;
    },
    tvmazeLink: function() {
      return this.itemObject.tvMazeUrl;
    }
  },
  methods: {
    // formatowanie identyfikatorów sezonów i odcinków
    episodeNumber: function(s, ep) {
      let season;
      let episode;
      season = (s.toString().length < 2) ? "s0" + s : "s" + s;
      episode = (ep.toString().length < 2) ? "e0" + ep : "e" + ep;
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
    },
    // detale niewidoczne, epizody widoczne
    setEpisodes: function() {
      this.details = false;
      this.episodes = true;
    },
    // emituj widok statusu
    setStatus: function() {
      this.details = false;
      this.episodes = false;
      this.$emit("showstatus", "true");
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
* {
  box-sizing: border-box;
  padding: 0px;
  outline:none;
}

a:link, a:visited, a:active {
  text-decoration: none;
  color: #A68C00;
}

a:hover {
  color: #FFE140;
}

.details {
  width: 600px;
  border: none;
  padding: 0pt 0pt 5pt 0pt;
  /* margin: 5pt; */
  margin: 5pt 5pt 0pt 5pt;
  background-color: #1C252E;
}

.details-tv-title-bar {
  display: flex;
  justify-content: space-between;
  font-size: 22pt;
  font-weight: bold;
  background: linear-gradient(to right, #22313F, #2C3F50);
  color: #fff;
  padding: 0px 8px 2px 8px;
}

.details-tv-title-bar2 {
  border-bottom: 1px solid #b9b9b9;
  background-color: #505F6D;
  font-size: 11pt;
  color: #e2e2e2;
  padding: 0px 10px 0px 10px;
  display: flex;
}

.details-tv-footer-bar {
  border-top: 1px solid #b9b9b9;
  background-color: #3B444D;
  font-size: 11pt;
  color: #b9b9b9;
  padding: 0px 10px 0px 10px;
  display: flex;
  justify-content: space-between;
  margin: 10pt 0pt 0pt 0pt;
}

.details-tv-footer-bar > div {
  margin: 4pt;
}

.rating-star {
  width: 20pt;
}

.out-of-ten {
  font-size: 14pt;
}

.details-tv-plot {
  text-align: justify;
  color: #d4d4d4;
  margin: 10px;
}

.details-tv-full-title {
  border-bottom: 1px solid #2E353C;
  text-align: left;
  color: #6B8FD4;
  font-size: 12pt;
  margin: 6pt 8pt 0pt 8pt;
  
}

.details-tv-people {
  padding: 2pt 0pt 4pt 0pt;
  border-top: 1px solid #2E353C;
  text-align: justify;
  color: #747474;
  font-size: 11pt;
  margin: 6pt 8pt 0pt 8pt;
}

.details-tv-seasons {
  padding: 4pt 0pt 4pt 0pt;
  text-align: center;
  color: #747474;
  font-size: 13pt;
  margin: 0pt 8pt 0pt 8pt;
}

.details-tv-episode {
  display: flex;
  flex-direction: column;
  font-size: 11pt;
  margin: 0pt 8pt 0pt 8pt;
}

.details-tv-episode > div:nth-of-type(1) {
  padding: 2pt 6pt 2pt 6pt;
  background-color: #2B3743;
  display: inherit;
  flex-direction: row;
  justify-content: space-between;
  color: #747474;
}

.details-tv-episode > div:nth-of-type(2) {
  padding: 2pt 6pt 10pt 6pt;
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
  /* position: relative; */
    padding: 0px;
  margin: 8pt 4pt 0px 0px;
}

.poster {
  border: 1pt solid #11181F;
  border-radius: 0px;
  padding: 0px;
  margin: 8pt 4pt 0px 0px;
}

.poster-div {
  position: relative;
  /* margin: 8pt 4pt 0px 0px; */
  border: 1pt solid #747474;
}

.poster-box-tv {
  display: flex;
  justify-content: space-between;
  font-size: 11pt;
}

.poster-links {
  position: relative;
  width: 100%;
  top: 4pt;
  padding: 2pt;
  margin: 0px;
  background-color: #2b3743;
  color: #747474;
  display: flex;
  justify-content: space-around;
}

.details-tv-button {
  border: 1pt solid #b9b9b9;
  width: 90pt;
  height: 15pt;
  background-color:#404B56;
  color: #b9b9b9;
  border-radius: 4pt;
}

.details-tv-title-select {
  background-color: #2B3743;
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
  margin: 4pt;
}

.details-tv-title-select > div > div {
  display: inherit;
  justify-content: inherit;
}

.details-tv-title-arrow-wrapper {
  background-color: #1C252E;
  height: 7pt;
}

.details-tv-title-arrow {
  background-color: #2B3743;
  width: 0; 
  height: 0; 
  border-left: 20pt solid #1C252E;
  border-right: 20pt solid #1C252E;
  border-top: 7pt solid #2B3743;
}

.details-tv-button:hover {
  cursor: pointer;
  border-color: #FFE140;
  color: #FFE140;
}


</style>


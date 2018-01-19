<template>
  <div class="details">
    <div id="poster-box-movie">
<!-- detale - górna belka       -->
      <div class="details-title-bar">
<!-- tytuł -->
        <div> {{ this.titleBar }}
          <a href="javascript:;" v-on:click="getYear(realoadedData)">
            ( {{ realoadedData.year }} )
          </a>
        </div>
<!-- ocena -->
        <div v-if="realoadedData.tmdbRating">
            <i class="fa fa-star" aria-hidden="true"></i>
            {{ realoadedData.tmdbRating }}
            <span class="out-of-ten">
              /&nbsp10
            </span>
        </div>
      </div>
        <div class="details-title-bar2">
<!-- type -->
          <div>
            <i class="fa fa-film" aria-hidden="true"></i>
            Movie
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
        </div>
        <div class="details-select">
<!-- details button -->
          <div>
            <div>
              <button class="details-button" v-on:click="setDetails">
                <i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp
                details
                </button>
            </div>
            <div class="details-arrow-wrapper">
              <div v-if="detailsVisible" class="details-arrow"></div>
            </div>        
          </div>
<!-- encounters button -->
          <div>
            <div>
              <button class="details-button" v-on:click="setStatus">
                <i class="fa fa-check-square-o" aria-hidden="true"></i>&nbsp
                encounters
                </button>
            </div>
            <div class="details-arrow-wrapper">
              <div v-if="encounterVisible" class="details-arrow"></div>
            </div>
          </div>  
        </div>    
<!-- warstwa detali -->
        <div v-if="detailsVisible">          
          <div class="details-full-title">
<!-- full title -->
            <span class="title-label">original: </span>
            {{ realoadedData.title }}
            <div v-if="realoadedData.title.toLowerCase() != realoadedData.engTitle.toLowerCase()">
              <span class="title-label">english: </span>
              {{ itemObject.engTitle }}
            </div>
            <div v-if="realoadedData.title.toLowerCase() != realoadedData.titlePl.toLowerCase()">
              <span class="title-label">polish: </span>
              {{ itemObject.titlePl }}
            </div>

          </div>
          <div class="poster-box">
            <div>
<!-- plot -->
              <div class="details-plot">
                {{ realoadedData.plot }}
              </div>
<!-- creators -->
              <div class="details-people">directed by:
                <div v-for="(item, index) of directors" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a> 
                </div>
              </div>
<!-- producers -->
              <div class="details-people">screenplay:
                <div v-for="(item, index) of writers" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a>
                  &nbsp({{ item.job }})
                </div>
              </div>      
<!-- music -->
              <div class="details-people">music:
                <div v-for="(item, index) of composers" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getPerson(item)">
                  {{ item.name }}
                  </a>
                  &nbsp({{ item.job }})
                </div>
              </div>  
<!-- country -->
              <div class="details-people"> country:
                <span v-for="(item, index) of realoadedData.country" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getCountry(item)">
                  {{ item.country }}
                  </a>
                  <span v-if="index < realoadedData.country.length - 1">&squf;</span>                  
                </span>
              </div>
<!-- language -->
              <div class="details-people">language:
                <span v-for="(item, index) of realoadedData.language" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getCountry(realoadedData.language)">
                  {{ item.language }}
                  </a>
                  <span v-if="index < realoadedData.language.length - 1">&squf;</span>  
                </span>
              </div>
            </div>
<!-- end of left column  -->
<!-- poster -->
            <div class="details-poster-right">
                <img class="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize">
                <!-- <div class="poster-div" v-bind:style="imageSize"></div>   -->
                <div class="poster-links">
                  <!-- <div>links:</div> -->                  
                  <div>
                    <a v-bind:href="imdbLink" target="_blank" v-bind:title="imdbLink">
                      <i class="fa fa-external-link-square" aria-hidden="true"></i>
                      imdb
                    </a>
                  </div>
                  <div>
                    <a v-bind:href="tmdbLink" target="_blank" v-bind:title="tmdbLink">
                      <i class="fa fa-external-link-square" aria-hidden="true"></i>
                      TMDb
                    </a>
                  </div>
                </div>
            </div>  
          </div>         
<!-- cast -->
          <div class="details-people stars">
            <div>stars:
              <span v-for="(item, index) of this.actors" v-bind:key="index">
                <a href="javascript:;" v-on:click="getPerson(item)">
                {{ item.name }}
                </a>
              <span v-if="index < actors.length - 1">&squf;</span>    
              </span>         
            </div>
          </div>
          <!-- last seen -->
          <div class="encounter">
            <!-- data -->
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
              <span v-for="(index) of latestEncounter.encounterRating" class="rating-full" v-bind:key="index">
                <i class="fa fa-star"></i>
              </span>
              <span v-for="(index) of (10 - latestEncounter.encounterRating)" class="rating-full" v-bind:key="index">
                <i class="fa fa-star-o" aria-hidden="true"></i>
              </span>&nbsp
              <span>
                {{ latestEncounter.encounterRating }}
              </span>
              <span>
                /10
              </span>
            </div>
<!-- encounters link -->
            &nbsp&squf;&nbsp
            <div>
              <a href="#" v-on:click="setStatus">more...</a>
            </div>
          </div>
        </div>
<!-- end of detail section -->
        <!-- stopka -->
        <div v-if="!encounterVisible" class="details-footer-bar">
          <!-- dodane -->
          <div>
            added: {{ new Date(realoadedData.dbDatetime).toUTCString() }}
          </div>
          <!-- update -->
          <div>
            <button v-if="detailsVisible" class="details-button" v-on:click="updateItem()" name="update" type="button">
            <i class="fa fa-refresh" aria-hidden="true"></i>
            update movie
            </button>  
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "pewa-details-movie",
  props: {
    itemObject: {
      type: Object,
      required: true
    },
     statusVisible: Boolean,
    windowSize: {
        width: Number,
        height: Number
      }
  },
  data() {
    return {
      restAddress: "http://localhost:8081/",
      tmdb: "https://www.themoviedb.org/movie/",
      imgLoaded: false,
      directors: [],
      writers: [],
      composers: [],
      actors: [],
      movieStaffLong: {
        display: "none"
      },
      movieStaffShort: {
        display: "block"
      },
      showMoreOrLessButton: {
        title: "show more...",
        moreVisible: false
      },
      details: true,
      encounters: false,
      imgWidth: 200
    };
  },
  created() {
    let staff = this.itemObject.staff;
    for (var i = 0; i < staff.length; i++) {
      if (staff[i].job.toLowerCase() == "director") {
        this.directors.push(staff[i]);
      } else if (
        staff[i].job.toLowerCase() == "writer" ||
        staff[i].job.toLowerCase() == "screenplay"
      ) {
        this.writers.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "original music composer") {
        this.composers.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "actor") {
        this.actors.push(staff[i]);
      }
    }
    this.details = (this.statusVisible == true) ? false : true;
    console.log(this.itemObject);
  },
  computed: {
// set details plane
    detailsVisible: function() {
      return this.details;
    },
// set encounters plane
    encounterVisible: function() {
      this.encounters = this.episodes || this.details ? false : true;
      return this.encounters;
    },
// assign props object to computed value
    realoadedData: function() {
      if (this.itemObject.titlePl == undefined) this.itemObject.titlePl = this.itemObject.title;
      if (this.itemObject.engTitle == undefined) this.itemObject.engTitle = this.itemObject.title;
      return this.itemObject;
    },
// shorten title to fit title bar
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
        output = this.realoadedData.title.slice(
          0,
          this.realoadedData.title.length
        );
      }
      return output;
    },
    // create image addres based on given endpoint
    imageAddress: function() {
      let link = this.itemObject.intPoster;
      return this.restAddress + link.slice(1, link.length);
    },
    // resize image with correct aspect ratio
    imageSize: function() {
      var img = new Image();
      img.src = this.imageAddress;
      // if (img && img.style) {
      var imgRatio = img.naturalWidth / img.naturalHeight;
      var imageSize = {
// dziwna pusta przestrzen z prawej strony na niektorych plakatach        
        width: this.imgWidth.toString() + "px",
        height: Math.round(this.imgWidth / imgRatio) + "px"
      };
      // console.log(imageSize.height);
      return imageSize;
    },
// returns imdb link
    imdbLink: function() {
      return this.realoadedData.imdbLink;
    },
// returns tmdb link    
    tmdbLink: function() {
      return this.tmdb + this.realoadedData.tmdbId;
      // https://www.themoviedb.org/movie/603-the-matrix
    },
// gest latest encounter from list
    latestEncounter: function() {
      let item = this.realoadedData.status;
      var sorted = item.sort((a, b) => {
        return a.encounterDate - b.encounterDate;
      });
      return sorted[sorted.length - 1];
    }
  },  
  mounted: function() {
    this.getWindowSize();
  },
  methods: {
// set actual parent element size    
    getWindowSize: function() {
      this.windowSize.height = document.getElementsByClassName("details")[0].clientHeight;
      this.windowSize.width = document.getElementsByClassName("details")[0].clientWidth;
      console.log(this.windowSize);
    },    
// set details visible
    setDetails: function() {
      this.details = true;
      this.$emit("showstatus", false);
    },
// set encounters visible
    setStatus: function() {
      this.details = false;
      this.$emit("showstatus", true);
    },
    // auktualizuj film
    updateItem: function() {
      this.$emit("updatemovie", this.itemObject);
    },
    // TODO szukanie po wybranych
    getGenre: function(genre) {
      this.request = "/movie/genre/" + genre.id;
      console.log(this.request);
    },
    getPerson: function(person) {
      this.request = "/movie/person/" + person.id;
      console.log(this.request);
    },
    getCountry: function(country) {
      this.request = "/movie/country/" + country.id;
      console.log(this.request);
    },
    getYear: function(item) {
      this.dateRange.yearIn = item.startDate;
      this.dateRange.yearOut = item.endDate;
      console.log(this.dateRange);
    },
    isLoaded: function(bool) {
      this.imgLoaded = bool;
    },
    showOrHide: function() {
      if (this.showMoreOrLessButton.moreVisible) {
        this.movieStaffShort.display = "block";
        this.movieStaffLong.display = "none";
        this.showMoreOrLessButton.title = "show more...";
        this.showMoreOrLessButton.moreVisible = false;
      } else {
        this.movieStaffShort.display = "none";
        this.movieStaffLong.display = "block";
        this.showMoreOrLessButton.title = "show less...";
        this.showMoreOrLessButton.moreVisible = true;
      }
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

.details-title-bar {
  display: flex;
  justify-content: space-between;
  line-height: 1.4em;
  font-size: 1.8em;
  font-weight: bold;
  background: linear-gradient(to right, #22313f, #2c3f50);
  color: #fff;
  padding: 0px 8px 0px 8px;
}

.details-title-bar2 {
  border-bottom: 1px solid #b9b9b9;
  background-color: #505f6d;
  line-height: 1.5em;
  font-size: 1em;
  color: #e2e2e2;
  padding: 0px 10px 0px 10px;
  display: flex;
}

.details-select {
  background-color: #2b3743;
  display: flex;
  flex-direction: row;
}

.details-select > div {
  width: 50%;
  display: inherit;
  flex-direction: column;
  justify-content: center;
}

.details-select > div button {
  margin: 6px;
}

.details-select > div > div {
  display: inherit;
  justify-content: inherit;
}

.details-button {
  border: none;
  width: 9.4em;
  height: 2.1em;
  /* background-color: #404b56; */
  background-color: inherit;
  color: #b9b9b9;
  border-radius: 1px;
}

.details-button:hover {
  cursor: pointer;
  border: 1px solid #ffe140;
  /* border-color: #ffe140; */
  color: #ffe140;
}

.details-arrow-wrapper {
  background-color: #1c252e;
  height: 7px;
}

.details-arrow {
  background-color: #2b3743;
  width: 0px;
  height: 0px;
  border-left: 24px solid #1c252e;
  border-right: 24px solid #1c252e;
  border-top: 10px solid #2b3743;
}

.details-full-title {
  border-bottom: 1px solid #2e353c;
  text-align: left;
  color: #6b8fd4;
  font-size: 1em;
  margin: 12px 8px 0px 8px;
}

.details-full-title > div:nth-of-type(1) {
  color: #d8d8d8;
}

.details-full-title > div:nth-of-type(2) {
  color: #718497;
}

.details-full-title span {
  color: #747474;
  font-size: 0.9em;
}

.poster-box {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.details-plot {
  text-align: justify;
  color: #d4d4d4;
  margin: 10px;
}

.details-people {
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

.details-poster-right {
  display: flex;
  flex-direction: column;
  padding: 0px;
  margin: 8px 8px 8px 0px;
}

.poster {
  position: relative;
  border: 1px solid #747474;
}

.poster-links {
  position: relative;
  width: 100%;
  top: 4px;
  padding: 2px;
  margin: 0px;
  background-color: #2b3743;
  color: #747474;
  display: flex;
  justify-content: space-around;
}

.details-footer-bar {
  border-top: 1px solid #b9b9b9;
  background-color: #3b444d;
  font-size: 0.9em;
  color: #b9b9b9;
  padding: 0px 10px 0px 10px;
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 5px 0px;
}

.details-footer-bar > div {
  line-height: 2em;
  margin: 4px;
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


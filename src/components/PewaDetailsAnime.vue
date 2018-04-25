<template>
<div class="details">
    
    <div id="poster-box-anime">
<!-- detale - górna belka       -->
      <div class="details-title-bar">
<!-- tytuł -->
        <div> {{ this.titleBar }}
          <span>(</span>
          <a href="javascript:;" v-on:click="getYear(realoadedData)">
           {{ new Date(realoadedData.startDate).getFullYear() }}
          </a>
          <span>-</span>
          <a href="javascript:;" v-on:click="getYear(realoadedData)">
           {{ new Date(realoadedData.endDate).getFullYear() }}
          </a>
          <span>)</span>
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
            Anime
          </div>
          &nbsp&squf;&nbsp
<!-- czas trwania -->
          <div>
            {{ realoadedData.duration }} min.
          </div>            
          &nbsp&squf;&nbsp
<!-- gatunek -->
          <div v-for="(item, index) of realoadedData.genres" v-bind:key="index">
            <a href="javascript:;" v-on:click="getGenre(item)">
              {{ item.genre }}
            </a>
            <span v-if="index < realoadedData.genres.length - 1">,&nbsp
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
                encounters&nbsp[{{itemObject.status.length}}]
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
<!-- delete element -->
          <div>
            <button class="details-button" v-on:click="deleteItem()" name="delete" type="button">
              <i class="fa fa-times" aria-hidden="true"></i>
              delete movie
            </button>            
          </div>
<!-- added -->
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
<!-- 
        <div>
          <h2>"{{itemObject.titleEng}}" <a href="javascript:;" v-on:click="getYear(itemObject)">({{yearFormatted}})</a></h2>
          <h3>"{{itemObject.titleRom}}"</h3>
          <p><b>Director:</b>
          <span v-for="(item, index) of directors" v-bind:key="index"><a href="javascript:;" v-on:click="getPerson(item)">{{item.name}}</a></span>
          </p>
          <p><b>Script:</b>
          <span v-for="(item, index) of writers" v-bind:key="index"><a href="javascript:;" v-on:click="getPerson(item)">{{item.name}}</a></span>
          </p>
          <p><b>Music:</b>
          <span v-for="(item, index) of composers" v-bind:key="index"><a href="javascript:;" v-on:click="getPerson(item)">{{item.name}}</a></span>
          </p>
          <p><b>Anime type:</b> {{itemObject.animeType}}</p>
          <p><b>Runtime:</b> {{itemObject.duration}} min.</p>
          <p><b>Genres:</b>
          <span v-for="(item, index) of itemObject.genres" v-bind:key="index"><a href="javascript:;" v-on:click="getGenre(item)">{{ item.genre }}</a>, </span>
          </p>
        </div>
        
        <div>
          <img id="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize">
        </div> -->
        
    </div>

    <!-- <p><b>Plot:</b> {{itemObject.description}}</p>

    <div id="staff-list">
      <div id="anime-staff-short" v-bind:style="animeStaffShort">
       <ul>
         <li v-for="(item, index) of itemObject.staff.slice(0, 5)" v-bind:key="index"><a href="javascript:;" v-on:click="getPerson(item)">{{ item.name }}</a> ... {{ item.job }}</li>
         <li><a href="javascript:;" v-on:click="showOrHide()"> show more...</a></li>
       </ul>
      </div>
      <div id="anime-staff-long" v-bind:style="animeStaffLong">
        <ul>
          <li v-for="(item, index) of itemObject.staff.slice(0, itemObject.staff.length)" v-bind:key="index"><a href="javascript:;" v-on:click="getPerson(item)">{{ item.name }}</a> ... {{ item.job }}</li>
          <li><a href="javascript:;" v-on:click="showOrHide()"> show less...</a></li>
        </ul>
      </div>
    </div> -->
</div>

</template>

<script>
export default {
  name: "pewa-details-anime",
  props: {
    itemObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: "",
      request: "",
      restAddress: "http://localhost:8081/",
      directors: [],
      writers: [],
      composers: [],
      animeStaffLong: {
        display: "none"
      },
      animeStaffShort: {
        display: "block"
      },
      dateRange: {},
      imgLoaded: false
    };
  },
  created() {
    let staff = this.itemObject.staff;
    for (var i = 0; i < staff.length; i++) {
      if (staff[i].job.toLowerCase() == "director") {
        this.directors.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "script") {
        this.writers.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "music") {
        this.composers.push(staff[i]);
      }
    };
    console.log("anime");
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
    showContentInConsole: function() {
      console.log(this.itemObject);
    },
    imageAddress: function() {
      let link = this.itemObject.intPoster;
      return this.restAddress + link.slice(1, link.length);
    },
    imageSize: function() {
      if (this.imgLoaded) {
        var img = document.getElementById("poster");
        if (img && img.style) {
          var imgRatio = img.naturalWidth / img.naturalHeight;
          var imageSize = {
            width: "220px",
            height: Math.round(220 / imgRatio) + "px"
          };
        }
      }
      return imageSize;
    },
// assign props object to computed value
    realoadedData: function() {
      if (this.itemObject.engTitle == undefined) this.itemObject.engTitle = this.itemObject.titleEng;
      return this.itemObject;
    },
// shorten title to fit title bar
    titleBar: function() {
      let shortTitleLength = 28;
      let output = "";
      let endMarker = 0;
      if (
        this.realoadedData != undefined &&
        this.realoadedData.titleEng.length >= shortTitleLength
      ) {
        endMarker = this.realoadedData.titleEng
          .slice(0, shortTitleLength)
          .lastIndexOf(" ");
        output = this.realoadedData.titleEng.slice(0, endMarker) + "...";
      } else if (
        this.realoadedData != undefined &&
        this.realoadedData.titleEng.length <= shortTitleLength
      ) {
        output = this.realoadedData.titleEng.slice(
          0,
          this.realoadedData.titleEng.length
        );
      }
      return output;
    },
  },
  methods: {
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
    updateEncounter: function() {
      this.$emit("updateencounter", this.itemObject);
    },
    // TODO szukanie po wybranych
    getGenre: function(genre) {
      this.request = "/anime/genre/" + genre.id;
      console.log(this.request);
    },
    getPerson: function(person) {
      this.request = "/anime/person/" + person.id;
      console.log(this.request);
    },
    getYear: function(item) {
      this.dateRange.yearIn = item.startDate;
      this.dateRange.yearOut = item.endDate;
      console.log(this.dateRange);
    },
    showOrHide: function() {
      if (this.animeStaffLong.display == "none") {
        this.animeStaffShort.display = "none";
        this.animeStaffLong.display = "block";
      } else {
        this.animeStaffShort.display = "block";
        this.animeStaffLong.display = "none";
      }
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
  outline: none;
}

a:link,
a:visited,
a:active {
  text-decoration: none;
  color: #a68c00;
}

a:hover {
  color: #F39C12;
}

.fa-star {
  color: #F39C12;
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

.out-of-ten {
  font-size: 0.6em;
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

img#poster {
  border: 4px solid white;
  border-radius: 2px;
  background-color: white;
}


</style>
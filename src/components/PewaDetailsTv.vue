<template>
    <div class="details" >
        <div class="details-tv-title">
                "{{ itemObject.title }}" 
                <a href="javascript:;" v-on:click="getYear(itemObject)">
                    ( {{ new Date(itemObject.premiered).getFullYear() }} )
                </a>
        </div>
    <div class="poster-box-tv">
      <div>
        <div>
          <b>show type:</b> {{ itemObject.showType }}
        </div>
        <div>
          <b>show status:</b> {{ itemObject.status }}
        </div>
            <!-- twórcy -->
        <div><b>Creators:</b>
        <span v-for="(item, index) of creators" v-bind:key="index">
                <a href="javascript:;" v-on:click="getPerson(item)">
                {{ item.name }}
                </a> 
              <span v-if="index < creators.length - 1"> &8226 </span>
            </span>
        </div>
            <!-- producenci -->
        <div><b>Producers:</b>
            <span v-for="(item, index) of producers" v-bind:key="index">
                <a href="javascript:;" v-on:click="getPerson(item)">
                {{ item.job }} - {{ item.name }}</a> 
                <span v-if="index < producers.length - 1"> &#8226 </span>
            </span>
        </div>
            <!-- kraj produkcji -->
        <div><b>Country:</b> 
                <a href="javascript:;" v-on:click="getCountry(itemObject.country)">
                {{ itemObject.country.country }}</a>
        </div>
            <!-- language -->
        <div><b>Language:</b> 
                <a href="javascript:;" v-on:click="getCountry(itemObject.language)">
                {{ itemObject.language.language }}</a>
        </div>
            <!-- czas trwania -->
            <div>
            <b>Runtime:</b> 
            {{ itemObject.runtime }} min.
            </div>
            <!-- gatunki -->
            <div>
            <b>Genres:</b>
            <span v-for="(item, index) of itemObject.genres" v-bind:key="index">
             <a href="javascript:;" v-on:click="getGenre(item)">
               {{ item.genre }}</a>
             <span v-if="index < itemObject.genres.length - 1"> &#8226 </span>  
            </span>
          </div>
          <!-- seasons -->
          <div>
              <b>Seasons:</b> {{ itemObject.seasons }}
          </div>
          <!-- external links -->
          <div>
            <b>Links: </b>
            <a v-bind:href="imdbLink" target="_blank">IMDB </a>&#8226
            <a v-bind:href="tvmazeLink" target="_blank"> TvMaze</a>
          </div>
          <!-- update -->
          <div>
            <button v-on:click="updateItem()" name="update" type="button">update tv show</button>  
          </div>
        </div>
        <!-- poster -->
        <div>
            <img id="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize"><br />   
            <div class="tv-rating">
              ocena
            </div>
        </div>        
    </div>
    <!-- opis -->
    <div><b>Plot:</b> {{itemObject.summary}}</div>
    <!-- obsada -->
    <div id="staff-list">
      <div>
        <b>Cast: </b>
      </div>
      <div id="movie-staff-short" v-bind:style="movieStaffShort">        
          <span v-for="(item, index) of this.actors.slice(0, 10)" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
             {{ item.name }}
            </a>
            <span v-if="index < actors.slice(0, 10).length - 1">, </span>    
          </span>         
      </div>
      <div id="movie-staff-long" v-bind:style="movieStaffLong">
          <span v-for="(item, index) of this.actors" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
              {{ item.name }}
            </a>
            <span v-if="index < actors.length - 1">, </span>    
          </span>
      </div>
      <button v-on:click="showOrHide()" name="update" type="button">{{ showMoreOrLessButton.title }}</button>
    </div>

  </div>

</template>

<script>
export default {
  name: "pewa-details-tv",
  props: {
    itemObject: {
      type: Object,
      required: true
    },
    endpoint: String
  },
  data() {
    return {
      restAddress: "http://localhost:8081/",
      imgRest: "",
      imgLoaded: false,
      producers: [],
      creators: [],
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
      }
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
          width: "220px",
          height: Math.round(220 / imgRatio) + "px"
        };
      }
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
}

.details {
  width: 600px;
  border: 1px solid #ff6600;
  padding: 0px;
  /* background-color: #ff6600; */
  margin: 5px;
  /* filter: blur(30px); */
}

.details-tv-title {
  font-size: 18pt;
  font-variant: small-caps;
  font-weight: bold;
}

img#poster {
  border: 4px solid white;
  border-radius: 0px;
  background-color: white;
  /* filter: blur(10px); */
}

div.poster-box-tv {
  display: flex;
  justify-content: space-between;
}

.tv-rating {
  position: relative;
  top: -50%;
  background-color: white;
}
</style>


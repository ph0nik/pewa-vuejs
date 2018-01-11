<template>
  <div id="details">
    <div id="poster-box-movie">
      
        <div>
          <h2>"{{ itemObject.title }}" <a href="javascript:;" v-on:click="getYear(itemObject)">( {{ itemObject.year }} )</a></h2>
          <h3>"{{ itemObject.titlePl }}"</h3>
          <!-- reżyseria -->
          <div><b>Director:</b>
          <span v-for="(item, index) of directors" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
              {{ item.name }}
            </a> 
            <span v-if="index < writers.length - 1">, </span>
          </span>
          </div>
          <!-- scenariusz -->
          <div><b>Screenplay:</b>
          <span v-for="(item, index) of writers" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
              {{ item.name }}
            </a> 
            <span v-if="index < writers.length - 1">, </span>
          </span>
          </div>
          <!-- muzyka -->
          <div><b>Music:</b>
          <span v-for="(item, index) of composers" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
              {{ item.name }}
            </a>
          </span>
          </div>
          <!-- kraj produkcji -->
          <div><b>Country:</b> 
          <span v-for="(item, index) of itemObject.country" v-bind:key="index">
            <a href="javascript:;" v-on:click="getCountry(item)">
              {{ item.country }}
            </a>
            <span v-if="index < itemObject.country.length - 1">, </span>
          </span></div>
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
               {{ item.genre }}
             </a>
             <span v-if="index < itemObject.genres.length - 1">, </span>  
            </span>
          </div>
          <!-- external links -->
          <div>
            <b>Links: </b>
            <a v-bind:href="imdbLink" target="_blank">
              IMDB
            </a>
          </div>
          <!-- update -->
          <div>
            <button v-on:click="updateItem()" name="update" type="button">update movie</button>  
          </div>
        </div>
        <div>
            <img id="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize"><br />   
        </div>        
    </div>
    <!-- opis -->
    <div><b>Plot:</b> {{itemObject.plot}}</div>
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
  name: "pewa-details-movie",
  props: {
    itemObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      restAddress: "http://localhost:8081/",
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
      }
    };
  },
  created() {
    let staff = this.itemObject.staff;
    for (var i = 0; i < staff.length; i++) {
      if (staff[i].job.toLowerCase() == "director") {
        this.directors.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "writer" || staff[i].job.toLowerCase() == "screenplay") {
        this.writers.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "original music composer") {
        this.composers.push(staff[i]);
      } else if (staff[i].job.toLowerCase() == "actor") {
        this.actors.push(staff[i]);
      }
    }
    console.log(this.itemObject);
  },
  computed: {
    // pobieranie adresu obrazka
    imageAddress: function() {
      let link = this.itemObject.intPoster;
      return this.restAddress + link.slice(1, link.length);
    },
    // zmiana rozmiaru obrazka z zachowaniem proporcji
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
    // zwraca adres imdb
    imdbLink: function() {
      return this.itemObject.imdbLink;
    }
  },
  methods: {
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
#details {
  width: 600px;
  padding: 12px;
  background-color: #ff6600;

}

img#poster {
  border: 4px solid white;
  border-radius: 2px;
  background-color: white;
  /* filter: blur(10px); */
}

div#poster-box-movie {
  display: flex;
  justify-content: space-between;
}
</style>


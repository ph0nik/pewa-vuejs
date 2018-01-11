<template>
  <div id="details">
    <div id="poster-box-movie">
      
        <div>
          <h2>"{{ itemObject.polishTitle }}" <a href="javascript:;" v-on:click="getYear(itemObject)">( {{ itemObject.firstPubDate }} )</a></h2>
          <h3>"{{ itemObject.originalTitle }}"</h3>
          <!-- autor -->
          <div><b>Author:</b>
          <span v-for="(item, index) of staff.authors" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
              {{ item.name }}
            </a> 
            <span v-if="index < staff.authors.length - 1"> &#8226 </span>
          </span>
          </div>
          <!-- tłumacz -->
          <div><b>Translator:</b>
          <span v-for="(item, index) of staff.translators" v-bind:key="index">
            <a href="javascript:;" v-on:click="getPerson(item)">
              {{ item.name }}
            </a> 
            <span v-if="index < staff.translators.length - 1"> &#8226 </span>
          </span>
          </div>
          <!-- język oryginalny -->
          <div><b>Language:</b> 
          {{ itemObject.originalLanguage }}
          </div>
          <div>
              <b>Category:</b>
              {{ itemObject.category}}
          </div>
          <div>
              <b>Form:</b>
              <span v-for="(item, index) of itemObject.form" v-bind:key="index">
                  <a href="javascript:;" v-on:click="getForm(item)">
                      {{ item.form }}</a>
                  <span v-if="index < itemObject.genre.length - 1"> &#8226 </span>  
              </span>
          </div>
          <!-- gatunki -->
          <div>
            <b>Genres:</b>
            <span v-for="(item, index) of itemObject.genre" v-bind:key="index">
             <a href="javascript:;" v-on:click="getGenre(item)">
               {{ item.genre }}
             </a>
             <span v-if="index < itemObject.genre.length - 1"> &#8226 </span>  
            </span>
          </div>
          <!-- external links -->
          <div>
            <b>Links: </b>
            <a v-bind:href="biblioLink" target="_blank">
              BiblioNETka
            </a>
          </div>
          <!-- update -->
          <div>
            <button v-on:click="updateItem()" name="update" type="button">update movie</button>  
          </div>
        </div>
        <div>
            <!-- no poster -->
            <!-- <img id="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize"><br />    -->
        </div>        
    </div>
    <!-- opis -->
    <div><b>Plot:</b> {{itemObject.plot}}</div>
  

</div>
</template>

<script>
export default {
  name: "pewa-details-book",
  props: {
    itemObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      restAddress: "http://localhost:8081/",
      biblioUrl: "https://www.biblionetka.pl/book.aspx?id=",
      staff: {
          authors: [],
          translators: []
      }
    };
  },
  created() {
    let staff = this.itemObject.people;
    for (var i = 0; i < staff.length; i++) {
        if (staff[i].job.toLowerCase().includes("author")) {
            this.staff.authors.push(staff[i]);
        } else if (staff[i].job.toLowerCase().includes("translator")) {
            this.staff.translators.push(staff[i]);
        }          
    }
    console.log(this.itemObject);
  },
  computed: {
    // zwraca adres biblionetki
    biblioLink: function() {
      return this.biblioUrl + this.itemObject.externalBookId;
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


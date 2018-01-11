<template>
<div id="details">
    
    <div id="poster-box-anime">
      
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
        <!-- poster v-on:load="setImageSize"  -->
        <div>
          <img id="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize">
        </div>
        
    </div>
    <!-- opis -->
    <p><b>Plot:</b> {{itemObject.description}}</p>
    <!-- obsada -->
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
    </div>
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
    console.log(this.itemObject);
  },
  computed: {
    showContentInConsole: function() {
      console.log(this.itemObject);
    },
    imageAddress: function() {
      let link = this.itemObject.intPoster;
      return this.restAddress + link.slice(1, link.length);
    },
    yearFormatted: function() {
      var year =
        this.itemObject.endDate == this.itemObject.startDate
          ? new Date(this.itemObject.endDate).getFullYear()
          : new Date(this.itemObject.startDate).getFullYear() +
            " - " +
            new Date(this.itemObject.endDate).getFullYear();
      return year;
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
    }
  },

  methods: {
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
#details {
  width: 600px;
  padding: 12px;
  background-color: #ff6600;
}

img#poster {
  border: 4px solid white;
  border-radius: 2px;
  background-color: white;
}

div#poster-box-anime {
  display: flex;
  justify-content: space-between;
}

</style>
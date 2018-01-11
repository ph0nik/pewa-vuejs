<template>
<div id="details">
    
    <div class="poster-box-manga">
        <div>
            <!-- titles -->
            <div class="manga-title-date">
              "{{itemObject.titleEng}}" 
                <a href="javascript:;" v-on:click="getYear(itemObject)">
                  ({{yearFormatted}})
                </a>
            </div>
            <div class="manga-title">
              "{{itemObject.titleRom}}"
            </div>
            <!-- staff -->
            <div class="manga-staff"><b>Staff:</b>
            <span v-for="(item, index) of mangaStaff" v-bind:key="index">
                <a href="javascript:;" v-on:click="getPerson(item)">{{item.job}} - {{item.name}}</a>
            </span>
            </div>
            <!-- type -->
            <div><b>Manga type:</b> 
            {{itemObject.mangaType}}
            </div>
            <!-- publishing -->
            <div><b>Publishing Status:</b> 
            {{itemObject.publishingStatus}}
            </div>
            <!-- volumes / chapters -->
            <div><b>Volumes / Chapters:</b> 
            {{itemObject.totalVolumes}} / {{itemObject.totalChapters}}
            </div>
            <!-- genres -->
            <div><b>Genres:</b>
            <span v-for="(item, index) of itemObject.genres" v-bind:key="index">
                <a href="javascript:;" v-on:click="getGenre(item)">
                {{ item.genre }}</a>, 
            </span>
            </div>
            <div>
                <b>Links: </b>
                <a v-bind:href="anilist" target="_blank">AniList</a>
            </div>
            <!-- opis -->
            <div class="manga-plot">
            <b>Plot:</b> {{itemObject.description}}
            </div>
        </div>
        <!-- poster v-on:load="setImageSize"  -->
        <div>
          <img id="poster" v-on:load="isLoaded(true)" v-bind:src="imageAddress" v-bind:style="imageSize">
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
      anilistLink: "https://anilist.co/manga/",
      request: "",
      restAddress: "http://localhost:8081/db-img/",
      mangaStaff: [],
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
      if (staff[i].job.toLowerCase().includes("story")) {
        this.mangaStaff.push(staff[i]);
      }
    };
    console.log(this.itemObject);
  },
  computed: {
    anilist: function() {
        return this.anilistLink + this.itemObject.idAnilist
    },
    showContentInConsole: function() {
      console.log(this.itemObject);
    },
    imageAddress: function() {
      // let link = this.itemObject.intPoster;
      // return this.restAddress + link.slice(1, link.length);
      return this.restAddress + this.itemObject.intPoster;
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
  padding: 0px;
  background-color: #ff6600;
}

img#poster {
  border: 4px solid white;
  border-radius: 2px;
  background-color: white;
  padding: 0px;
}

.poster-box-manga {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.manga-plot {
    text-align: justify;
    padding: 0px;
}

</style>
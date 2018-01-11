<template>
    <div class="pewa-update-box">
        <div class="update-header">Insert encounter details</div>
        <div class="update-content">
            <div class="update-media-type">
                <!-- TODO uzupełnić opcję select -->
                <select id="pewa-update-media" v-model="status.mediaSource" required>
                  <option disabled value="">Please select one</option>
                    <option v-for="(item, index) in selectMedia" v-bind:value="item.val" v-bind:key="index" >
                      <!-- v-bind:selected="index === 0" -->
                      {{ item.id }}
                    </option>
                </select>
            </div>
            <div class="update-date">
                <input type="date" value="status.encounterDate" v-model="status.encounterDate">
                {{ formatEncounterDate }}
            </div>
            <div class="update-rating">
              Rating:
              <select id="pewa-update-rating" v-model="status.encounterRating" required>
                <option v-for="(item, index) in rating" v-bind:value="item" v-bind:key="index" v-bind:selected="status.mediaSource">
                  {{ item }}
                  
                </option>
              </select>
            </div>
            <div v-if="status.elementType === 'TVSERIES'" class="update-season">
              Select season:
              <select id="pewa-update-season" v-model="status.season" required>
                <option v-for="(item, index) in 7" v-bind:value="item" v-bind:key="index" v-bind:selected="status.mediaSource">
                  {{ item }}
                  
                </option>
              </select>
            </div>
            <div class="update-comment">
              <textarea id="pewa-update-comment" cols="30" rows="10" v-model="status.comment" v-bind:placeholder="status.comment">
              </textarea>
            </div>
        </div>
        <div class="update-footer">            
            <button v-on:click="submitStatus" name="close" type="button">Submit</button>
            <button v-on:click="closeWindow" name="close" type="button">Cancel</button>
        </div>


    </div>  
</template>

<script>
export default {
  name: "pewa-update-window",
  props: {
    encounter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      status: {},
      addnew: true,
      selectMedia: [
        { id: "Cinema", val: "CINEMA" },
        { id: "Computer", val: "COMPUTER" },
        { id: "WebStream", val: "WEBSTREAM" },
        { id: "TV", val: "TV" },
        { id: "Video", val: "VIDEO" },
        { id: "DVD", val: "DVD" },
        { id: "BluRay", val: "BLURAY" },
        { id: "Book", val: "BOOK" },
        { id: "eBook", val: "EBOOK" },
        { id: "other", val: "OTHER" }
      ],
      rating: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  created() {
    console.log("create pewa update window")
    
    console.log(this.encounter);
    if (this.encounter != null) {
      this.status = this.encounter;
      var data = new Date(this.encounter.encounterDate)
        .toISOString()
        .slice(0, 10);
      this.status.encounterDate = data;
    }
    console.log(this.encounter.season);
  },
  computed: {
    formatEncounterDate: function() {
      var date;
      if (this.status != null) {
        date = new Date(this.status.encounterDate);
      }
      // return date.getFullYear() + '-' + date.getMonth() + '-' +date.getDate();
      return date.toISOString().slice(0, 10);
    }
  },
  methods: {
    closeWindow: function() {
      this.$emit("closeupdate", this.encounter);
    },
    submitStatus: function() {
      this.status.addedDate = "";
      this.$emit("submit", this.status);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0px;
}

.pewa-update-box {
  margin: 5px;
  left: 0%;
  top: 0%;
  height: 60%;
  width: 50%; 
  padding: 0px;
  /* background-color: #ccccb3; */
  /* opacity: 1; */
  /* border: 4px solid #b38600; */
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.update-header {
  background-color: #b38600;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  padding: 5px 0px 5px 0px;
}

.update-content {
  background-color: #8080ff;
}
</style>

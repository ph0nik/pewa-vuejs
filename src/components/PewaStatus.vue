<template>
<div class="status">
    <!-- status -->
    <div class="show-status">
      <div class="status-add-new">
        <button class="status-button" v-on:click="addStatus" name="addnew" type="button">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp
          add new
        </button>
      </div>            
      <!-- nagłówek -->
      <div v-for="(item, index) in encounters" v-bind:key="index">
        <div class="status-title">
          <!-- kiedy objerzany -->
          <div>
            <div>
            <i class="fa fa-calendar" aria-hidden="true">&nbsp</i>
             <span>{{ new Date(item.encounterDate).toLocaleDateString() }}</span>
            </div>
            <!-- źródło -->
            <div>
              &squf; source: <span>{{ item.mediaSource }}</span>
            </div>
            <!-- sezon -->
            <div v-if="itemObject.type === 'TVSERIES'">
              &squf; season: <span>{{ item.season }}</span>
            </div>
          </div>
          
          <!-- ocena -->
          <div class="rating">
              &squf; rated:&nbsp
              <span v-for="(index) of item.encounterRating" class="star" v-bind:key="index">
                <i class="fa fa-star"></i>
              </span>
              <span v-for="(index) of (10 - item.encounterRating)" class="staroff" v-bind:key="index">
                <i class="fa fa-star-o" aria-hidden="true"></i>
              </span>&nbsp
              <span>
                {{ item.encounterRating }}/10
              </span>
          </div>
        </div>
        <!-- recenzja -->
        <div class="status-text">
          <span>
            <i class="fa fa-comment-o" aria-hidden="true"></i>
            review:
          </span>
          <p>{{ item.comment }}</p>
        </div>
        <!-- stopka recenzji -->
        <div class="status-text-footer"> 
          <div>
            <!-- update button -->
            <button class="status-button" v-on:click="updateStatus(index)" name="update" type="button">
            <i class="fa fa-refresh" aria-hidden="true"></i>&nbsp
            update
            </button>

            <!-- delete button -->
            <button class="status-button" v-if="encounters.length > 1" v-on:click="deleteStatus(item)" name="delete" type="button">
              <i class="fa fa-trash" aria-hidden="true"></i>&nbsp
              delete
              </button> 
          </div>
          <div>
            added: <i>{{ new Date(item.addedDate).toUTCString() }}</i>
          </div>
        </div>
      </div>      
    </div>  
    <!-- stopka -->
    <div class="details-tv-footer-bar">
      <!-- dodane -->
      <div>
        show added: {{ new Date(itemObject.dbDatetime).toUTCString() }}
      </div>
      <!-- update -->
      <div>
        <button class="status-button" onclick="location.href='#'" name="update" type="button">
          back to top&nbsp
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
        </button>  
      </div>
    </div>        
</div>

</template>

<script>
export default {
  name: "pewa-status",
  props: {
    itemObject: {
      type: Object,
      required: true
    }
  },
  computed: {
    // watches prop data and reloads if updated
    encounters: function() {
      if (this.itemObject.type === "TVSERIES") {
        return this.itemObject.internalStatus;
      } else {
        return this.itemObject.status;
      }
    }
  },
  created() {
  },
  methods: {
    // update status
    updateStatus: function(encounterIndex) {
      console.log('update status');
      console.log(encounterIndex);
      // brak identyfikatora w obiekcie statusu - pozor!
      this.$emit("updatestatus", encounterIndex);
    },
    // delete status, possible only if there's more than one
    deleteStatus: function(item) {
      this.$emit("deletestatus", item.statusId);
    },
    // add new status
    addStatus: function() {
      let encounterId;
      switch (this.itemObject.type) {
        case "ANIME":
          encounterId = this.itemObject.idAnilist;
          break;
        case "MANGA":
          encounterId = this.itemObject.idAnilist;
          break;
        case "MOVIE":
          encounterId = this.itemObject.tmdbId;
          break;
        case "TVSERIES":
          encounterId = this.itemObject.tvMazeId;
          break;
        case "BOOK":
          encounterId = this.itemObject.externalBookId;
          break;
      }
      this.$emit("addstatus", encounterId);
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

.show-status {
  padding: 0px;
  margin: 0px;
}

.status-add-new {
  border: 0px;
  display: flex;
  justify-content: center;
}

.status-add-new > button {
  height: 30pt;
  width: 150pt;
  font-size: 18pt;
}

.status {
  padding: 1pt;
  margin: 0pt 5pt 5pt 5pt;
  background-color: #1c252e;
  color: #fff;
  /* border: 1pt solid red; */
}

.details-tv-footer-bar {
  border-top: 1px solid #b9b9b9;
  background-color: #3b444d;
  font-size: 11pt;
  color: #b9b9b9;
  padding: 0px 10pt 0px 10pt;
  display: flex;
  justify-content: space-between;
  margin: 10pt 0pt 0pt 0pt;
}

.details-tv-footer-bar > div {
  line-height: 20pt;
  padding: 0px;
  margin: 4pt;
  
}

.status-button {
  border: 0pt solid #b9b9b9;
  width: 90pt;
  height: 20pt;
  /* background-color: #404b56; */
  background-color: inherit;
  color: #979797;
  border-radius: 1pt;
}

.status-button:hover {
  cursor: pointer;
  border: 1pt solid #ffe140;
  /* border-color: #FFE140; */
  color: #FFE140;
}

.status-title {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #2e353c;
  color: #747474;
  font-size: 11pt;
  text-align: left;
  padding: 2pt 8pt 2pt 8pt;
  margin: 10pt 8pt 0pt 8pt;
}

.status-title span {
  color: #6B8FD4;
}

.status-text {
  /* border-bottom: 1px solid #2e353c; */
  margin: 0pt 8pt 0pt 8pt;
  padding: 2pt 8pt 2pt 8pt;
  background-color: #242424;
}

.status-text span {
  color: #747474;
  font-size: 11pt;
}

.status-text p {
  padding: 5pt 0pt;
  margin: 0px;
  font-size: 11pt;
  text-indent: 16pt;
  color: #d4d4d4;
  text-align: justify;
}

.status-text-footer {
  margin: 0pt 8pt 30pt 8pt;
  padding: 0pt 4pt;
  font-size: 10pt;
  line-height: 25pt;
  color: #747474;
  background-color: #363636;
  display: flex;
  justify-content: space-between;
}

.status-text-footer > div {
  /* line-height: 20pt; */
}

.rating {
  display: flex;
  flex-direction: row;
}

.rating > span {
  margin: 0pt 1pt 0px 0pt;
}

.rating > .star {
  color: #ffe140;
}

.rating > .staroff {
 color: #a68c00;
}



</style>

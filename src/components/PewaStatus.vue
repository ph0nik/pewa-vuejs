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
  padding: 4px;
  display: flex;
  justify-content: center;
}

.status-add-new > button {
  height: 1.5em;
  width: 7em;
  font-size: 1.8em;
}

.status {
  padding: 1px;
  margin: 0px 5px 5px 5px;
  background-color: #1c252e;
  color: #fff;
  width: 600px;
}

.details-tv-footer-bar {
  border-top: 1px solid #b9b9b9;
  background-color: #3b444d;
  font-size: 0.9em;
  color: #b9b9b9;
  padding: 0px 10px 0px 10px;
  display: flex;
  justify-content: space-between;
  margin: 10px 0px 0px 0px;
}

.details-tv-footer-bar > div {
  line-height: 2em;
  margin: 4px;
}

.status-button {
  border: none;
  width: 9.4em;
  height: 2.1em;
  /* background-color: #404b56; */
  background-color: inherit;
  color: #979797;
  border-radius: 1px;
}

.status-button:hover {
  cursor: pointer;
  border: 1px solid #ffe140;
  /* border-color: #FFE140; */
  color: #FFE140;
}

.status-title {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #2e353c;
  color: #747474;
  font-size: 0.9em;
  text-align: left;
  padding: 2px 8px 2px 8px;
  margin: 10px 8px 0px 8px;
}

.status-title span {
  color: #6B8FD4;
}

.status-text {
  /* border-bottom: 1px solid #2e353c; */
  margin: 0px 8px;
  padding: 2px 8px;
  background-color: #242424;
}

.status-text span {
  color: #747474;
  font-size: 0.9em;
}

.status-text p {
  padding: 5px 0px;
  margin: 0px;
  font-size: 0.9em;
  text-indent: 1.5em;
  color: #d4d4d4;
  text-align: justify;
}

.status-text-footer {
  margin: 0px 8px 30px 8px;
  padding: 0px 4px;
  font-size: 0.9em;
  line-height: 2.5em;
  color: #747474;
  background-color: #363636;
  display: flex;
  justify-content: space-between;
}

.rating {
  display: flex;
  flex-direction: row;
}

.rating > span {
  margin: 0px 1px 0px 0px;
}

.rating > .star {
  color: #ffe140;
}

.rating > .staroff {
 color: #a68c00;
}



</style>

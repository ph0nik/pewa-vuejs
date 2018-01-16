<template>
<div class="status">
    <!-- status -->
    <div class="show-status">
      <!-- nagłówek -->
      <div v-for="(item, index) in encounters" v-bind:key="index">
        <div class="status-title">
          <!-- kiedy objerzany -->
          <div>
             watched: <span>{{ new Date(item.encounterDate).toLocaleDateString() }}</span>
          </div>
          <!-- źródło -->
          <div>
            &squf; source: <span>{{ item.mediaSource }}</span>
          </div>
          <!-- sezon -->
          <div v-if="itemObject.type === 'TVSERIES'">
            &squf; season: <span>{{ item.season }}</span>
          </div>
          <!-- ocena -->
          <div>
            &squf; rating: {{ item.encounterRating }}/10
          </div>
        </div>
        <!-- recenzja -->
        <div class="status-text">
          <span>review:</span>
          <p>{{ item.comment }}</p>
        </div>
        <!-- stopka recenzji -->
        <div class="status-text-footer"> 
          <div>
            <button class="status-button" v-on:click="updateStatus(item)" name="update" type="button">update</button>
          </div>
          <div>
            <button class="status-button" v-if="notSingleElement" v-on:click="deleteStatus(item)" name="delete" type="button">delete</button> 
          </div>
          <div>
            added: <i>{{ new Date(item.addedDate).toUTCString() }}</i>
          </div>
        </div>
      </div>      
      <button class="status-button" v-on:click="addStatus" name="addnew" type="button">add new</button>
    </div>  
    <!-- stopka -->
    <div class="details-tv-footer-bar">
      <!-- dodane -->
      <div>
        show added: {{ itemObject.dbDatetime }}
      </div>
      <!-- update -->
      <div>
        <button class="status-button" onclick="location.href='#'" name="update" type="button">
          back to top
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
    encounters: function() {
      if (this.itemObject.type === "TVSERIES") {
        return this.itemObject.internalStatus;
      } else {
        return this.itemObject.status;
      }
    },
    notSingleElement: function() {
      if (this.encounters.length > 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    console.log("status created");
    console.log(this.itemObject);
  },
  methods: {
    // aktualizuj status
    updateStatus: function(item) {
      var i = 0;
      var status = {};
      let externalStatus;
      if (this.itemObject.type === "TVSERIES") {
        externalStatus = this.itemObject.internalStatus;
      } else {
        externalStatus = this.itemObject.status;
      }
      while (i < externalStatus.length) {
        if (externalStatus[i].statusId == item.statusId) {
          status = externalStatus[i];
          switch (this.itemObject.type) {
            case "ANIME":
              status.encounterId = this.itemObject.idAnilist;
              break;
            case "MANGA":
              status.encounterId = this.itemObject.idAnilist;
              break;
            case "MOVIE":
              status.encounterId = this.itemObject.tmdbId;
              break;
            case "TVSERIES":
              status.encounterId = this.itemObject.tvMazeId;
              break;
            case "BOOK":
              status.encounterId = this.itemObject.externalBookId;
              break;
          }

          i = externalStatus.length;
        } else {
          i++;
        }
      }
      this.$emit("updatestatus", status);
    },
    // usuń status
    deleteStatus: function(item) {
      this.$emit("deletestatus", item.statusId);
    },
    // dodaj nowy status
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
  margin: 4pt;
}

.status-button {
  border: 1pt solid #b9b9b9;
  width: 90pt;
  height: 15pt;
  background-color: #404b56;
  color: #b9b9b9;
  border-radius: 4pt;
}

.status-button:hover {
  cursor: pointer;
  border-color: #FFE140;
  color: #FFE140;
}

.status-title {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #2e353c;
  color: #747474;
  font-size: 11pt;
  text-align: left;
  margin: 6pt 8pt 0pt 8pt;
}

.status-title span {
  color: #6B8FD4;
}

.status-text {
  padding: 2pt 0pt 4pt 0pt;
  border-bottom: 1px solid #2e353c;
  margin: 10px;
  margin: 6pt 8pt 0pt 8pt;
}

.status-text span {
  color: #747474;
  font-size: 11pt;
}

.status-text p {
  padding: 0px;
  margin: 0px;
  color: #d4d4d4;
  text-justify: justify;
}

.status-text-footer {
  margin: 6pt 8pt 10pt 8pt;
  font-size: 10pt;
  color: #747474;
  display: flex;
  justify-content: space-between;

}


</style>

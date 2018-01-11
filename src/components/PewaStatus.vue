<template>
<div class="status">
    <!-- status -->
    <div class="show-status">
      <div v-for="(item, index) in encounters" v-bind:key="index">
        <p><b>Added:</b> {{ new Date(item.addedDate).toUTCString() }}</p>
        <span><b>Date:</b> {{ new Date(item.encounterDate).toLocaleDateString() }}</span>
        <span><b>Source:</b> {{ item.mediaSource }}</span>
        <span><b>Rating:</b> {{ item.encounterRating }}/10</span>
        <span v-if="itemObject.type === 'TVSERIES'">
          <b>Season: </b> {{ item.season }}
        </span>
        <br />
        <span><b>Comment:</b> {{ item.comment }}</span>  
        <button v-on:click="updateStatus(item)" name="update" type="button">update</button>
        <button v-if="notSingleElement" v-on:click="deleteStatus(item)" name="delete" type="button">delete</button>  
      </div>      
      <button v-on:click="addStatus" name="addnew" type="button">add new</button>
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
.status {
  margin: 5px;
  padding: 10px;
  background-color: white;
}
</style>

<template>
    <div class="confirm">
        <div class="header">
            {{ itemObject.title }}
        </div>
        <div class="action">            
          <div>
            {{ actionMessage }}
          </div>
          <div>
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>        
          </div>            
        </div>
        <div class="select">
            <div>
            <button class="update-button" v-on:click="submitStatus" name="close" type="button">
              <i class="fa fa-check" aria-hidden="true"></i>
              Proceed</button>
            </div>        
            <div>
            <button class="update-button" v-on:click="closeWindow" name="close" type="button">
              <i class="fa fa-times" aria-hidden="true"></i>
              Cancel</button>
          </div>   
        </div>
    </div>
</template>

<script>
export default {
  name: "pewa-confirm",
  props: {
    itemObject: {
      type: Object,
      required: true
    },
    statusManager: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {      
  },
  computed: {
    actionMessage: function() {
        let action = "";                
        if (this.statusManager.action.includes("deleteItem")) {
            action = "This element and all its encounters will be deleted permanently from your database, are you sure?";
        } else if (this.statusManager.action.includes("deleteStatus")) {
            action = "This encounter will be deleted permanently from your database, are you sure?";
        }
        return action;
    }
    
  },
  methods: {
    submitStatus: function() {
        this.$emit("proceed");
    },
    closeWindow: function() {
      this.$emit("closeconfirm");
    },
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0px;
  outline: none;
}

.confirm {
  position: absolute;
  cursor: pointer;
  width: 600px;
  padding: 0px;
  margin: 0px;
  top: 20%;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.header {
  font-size: 1.2em;
  border-radius: 10px 10px 0px 0px;
  background-color: #7c3204;
  color: #e7bca1;
  text-align: center;
  padding: 5px 0px 5px 0px;
}

.action {
  display: flex;
  justify-content: space-around;
  font-size: 1.5em;
  text-align: center;
  padding: 20px 10px;
  background-color: #bf6730;
  color: #dedede;
  border-bottom: 1px solid #401a02;
}

.action > div:nth-of-type(1) {
  width: 80%;
}

.action > div:nth-of-type(2) {
  font-size: 3em;
}

.select {
  height: 40px;
  padding: 0px;
  margin: 0px;
  border-radius: 0px 0px 10px 10px;
  border-top: 1px solid #401a02;
  background-color: #a63f00;
  background-color: #7c3204;
  color: #c7c7c7;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.update-button {
  font-size: 1em;
  border: none;
  width: 8em;
  height: 2em;
  background-color: inherit;
  font-weight: bold;
  color: #dedede;
  border-radius: 1px;
}

.update-button:hover {
  cursor: pointer;
  border: 1px solid #ffe140;
  color: #ffe140;
}
</style>
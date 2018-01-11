<template>
    <div class="switch-bar">
        <div class="switch-bar-title">
           <span>{{ itemObject.title.toLowerCase() }}</span> 
        </div>

        <div class="switch-bar-button-details">
            <button class="buttons">details</button>
            <div class="switch-bar-highlight">
            </div>

            <button class="buttons">episodes</button>
            <div class="switch-bar-highlight">
            </div>

            <button class="buttons">status</button>
            <div class="switch-bar-highlight">
            </div>
        </div>
        
    </div>

</template>

<script>
export default {
  name: "pewa-details-switch",
  props: {
    itemObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0px;
  outline: none;
}

.switch-bar {
  /* border: 1px solid purple; */
  border: none;
  margin: 5px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
}

.switch-bar-title {    
    color: #2f2f2f;
    /* margin: 2px; */
    border: none;
}

.switch-bar-title > span {
    position: relative;
    top: 0.7em;
    padding: 5px;
    /* font-weight: bold; */
}

.buttons {
  font-weight: bold;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  width: 70px;
  height: 30px;
  border-width: 0px 0px 4px 0px;
  border-style: solid;
  border-color: #666666;
  margin: 2px;
}

.buttons:hover {
  color: #fff;
  border-color: #F39C12;
  background-color: rgb(42, 42, 42);
}

.switch-bar-button-details {
  display: flex;
  justify-content: flex-end;
  margin-right: 2px;
}

.switch-bar-highlight {
  padding: 0px;
  height: 0px;
  background-color: red;
}
</style>


<template>
<div id="footer">
    <div class="footer-message">
      <span>
        Server message: {{ info.message }}
      </span>
    </div>
    <div class="footer-results">
      <span>
        Results found: {{ info.resultsFound }}
      </span>
    </div>
    <div class="footer-rows">
      <span>
        Affected rows: {{ info.rowsAffected }}
      </span>
    </div>
</div>
</template>

<script>
export default {
  name: "pewa-footer",
  props: {
    info: {
      type: Object,
      required: false
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 4px;
}

div#footer {
  background-color: #0066ff;
  width: 100%;
}
</style>
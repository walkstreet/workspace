<template>
  <div id="scroll" class="page-one">
    <div class="page-one-main">
      <input v-model="text">
      <img src="../assets/img/logo.png">
    </div>
  </div>
</template>
<script>
module.exports = {
  data(){
    return{
      text:''
    }
  },
  created: function(){
    this.config = require("../config");
    console.log(this.config);
    // POST /someUrl
    // this.$http.post(this.config.api, {}).then((response) => {

    //   // get status
    //   response.status;

    //   // get status text
    //   response.statusText;

    //   // get 'Expires' header
    //   response.headers.get('Expires');

    //   // set data on vm
    //   this.$set('someData', response.body);

    // }, (response) => {
    //   // error callback
    // });
  },
  methods:{
    onClick: function(e){
      console.log(e,this.config)
    },
    handler: function(e){
      console.log(e.target.scrollTop+e.target.offsetHeight);
    }
  },
  watch: {
    text(curVal,oldVal){
　　　console.log(curVal,oldVal);
　　}
  },
  mounted () {
    document.getElementById('scroll').addEventListener('scroll', this.handler);
  },
  destory(){
    document.getElementById('scroll').removeEventListener('scroll');
  }
}
</script>
<style lang="scss" scoped>
.page-one{
  height:100%;
  overflow-y: scroll;
  .page-one-main{
    height: 2000px;
  }
}
</style>
<style lang="scss" scoped>
  .page-one-main{
    input{
      display: block;
    }
    img{
      display: block;
    }
  }
</style>
<template>
  <div id="scroll" class="page-one">
    <div class="page-one-main">
      <input v-model="text">
      <img src="../assets/img/logo.png" @click="onClick">
    </div>
  </div>
</template>
<script>
import config from '../config';
module.exports = {
  data(){
    return{
      text:'placeholder1'
    }
  },
  created: function(){
    this.config = config;
    console.log(config,this.$route.params.id);
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
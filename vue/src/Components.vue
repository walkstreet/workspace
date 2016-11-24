<template>
    <ul>
        <li v-for="(item,index) in items" v-on:click="onClickLi">
            {{index+1}}
            <em>{{item.label}}</em>
            {{$route.params.id}}
        </li>
    </ul>
</template>
<script>
export default {
  data () {
    return {
      items: [
          {
              label:"a"
          },
          {
              label:"b"
          },
          {
              label:"c"
          }
      ]
    }
  },
  props: ['mymessage'],
  methods:{
      onClickLi: function(e){
          console.log(e.target.innerHTML);
      }
  }
}
</script>
<style lang="scss">
    ul{
        color:red;
    }
</style>

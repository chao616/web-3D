<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: ['msg'],
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.hello{
    overflow: hidden;
}
.hello h1{
    color: #42b983;
    margin: 10px;
}
</style>

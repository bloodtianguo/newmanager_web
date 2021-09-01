<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss" scoped>
#app{
  background-color: #FBFCFE;
  // background: #EAECF1
}
body .el-table th.gutter{
display: table-cell!important;
}
</style>

<template>
  <div class="export_main">
    <div class="export_title fonwei">{{title}}</div>
  </div>
</template>

<script>
export default {
    props:['title']
}
</script>

<style lang="scss" scoped>
.export_main{
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e1e6eb;
  margin-bottom: 10px;
  .export_title{
    font-size: 18px;
    line-height: 30px;
    padding-left: 8px;
    position: relative;
     &::before{
    content: "";
    height: 30px;
    position: absolute;
    left: 0;
    border: 1px solid #70b3c3;
  }
  }
}
</style>
<template>
  <div class="app-container">
    <el-row class="linkcard minhei400">
      <router-link
        :to="item.path"
        v-for="(item, index) in linkpath"
        :key="index"
      >
        <el-col class="linkcard_main" :span="12">
          <div class="linkcard_main_title">{{ item.title }}</div>
          <p class="linkcard_main_introduce">{{ item.introduce }}</p>
        </el-col>
      </router-link>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkpath: [
        { path: "/manage", title: "APP版本管理", introduce: 'APP版本管理介绍' },
        { path: "/navigationconfig", title: "导航资源配置", introduce: '导航资源配置介绍' },
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.linkcard {
  background-color: #fff !important;
  padding: 20px 20px 34px;
  .linkcard_main {
    padding: 15px 20px;
    border-right: 1px dashed #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: rgb(243, 243, 243);
    }
  }
  .linkcard_main:nth-child(2),
  .linkcard_main:first-child {
    border-bottom: 1px dashed #e6e6e6;
  }
}
</style>

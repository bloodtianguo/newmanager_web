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
        { path: "/videoContentManage/recreation", title: "娱乐视频", introduce: '娱乐视频介绍' },
        { path: "/videoContentManage/city", title: "城市名片", introduce: '城市名片介绍' },
        { path: "/videoContentManage/card", title: "打卡视频", introduce: '打卡视频介绍' },
        { path: "/videoContentManage/lostAndFound", title: "拾金不昧", introduce: '拾金不昧介绍' },
        { path: "/mark", title: "标签管理", introduce: '标签管理介绍' },
        { path: "/topicManage", title: "话题管理", introduce: '话题管理介绍' },
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

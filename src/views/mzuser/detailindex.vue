<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      router
      background-color="#fff"
      text-color="#478DE4"
    >
      <el-menu-item
        :index="item.routers"
        v-for="(item, index) in tablist"
        :key="index"
        :label="item.label"
      >
        <span class="label_wei">{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    if (
      this.$route.path.includes(
        "detail",
        "rechargeRecords",
        "givingRecods",
        "receptionRecord",
        "userResume",
        "rewardRecord",
        "starlightDetails"
      )
    ) {
      this.activeIndex = this.$route.path;
    }else{
      this.activeIndex= "/mzuser/detailindex/detail"
    }
  },
  data() {
    return {
      name: "", //用户名
      activeIndex: "/mzuser/detailindex/detail",
      tablist: [
        // 数据需要根据实际需求修改为真实数据
        { label: "基本信息", routers: "/mzuser/detailindex/detail" },
        { label: "充值记录", routers: "/mzuser/detailindex/rechargeRecords" },
        { label: "送礼记录", routers: "/mzuser/detailindex/givingRecods" },
        { label: "收礼记录", routers: "/mzuser/detailindex/receptionRecord" },
        { label: "用户简历", routers: "/mzuser/detailindex/userResume" },
        { label: "奖励记录", routers: "/mzuser/detailindex/rewardRecord" },
        { label: "星光明细", routers: "/mzuser/detailindex/starlightDetails" }
      ]
    };
  }
};
</script>

<style lang="sass" scoped></style>

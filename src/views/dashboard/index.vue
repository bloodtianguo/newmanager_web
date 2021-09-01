<template>
  <div class="dashboard-container">
    <div class="dataShow">
      <h2>数据展示</h2>
      <div id="cardmain">
        <el-card
          shadow="hover"
          :body-style="{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }"
          v-for="item in dataPresen"
          :key="item.name"
          :class="item.classname"
        >
          <span class="content_name">
            <p>{{ item.number }}</p>
            {{ item.name }}
          </span>
        </el-card>

        <el-card
          shadow="hover"
          :body-style="{
            padding: '0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }"
          class="cardBgc_fr"
        >
          <div slot="header"><span>全部公会收益</span></div>
          <div class="content">
            <p>￥{{ notWithdrawalAmount }}</p>
            <p>待提现金额</p>
          </div>
          <div class="content">
            <p>￥{{ withdrawalAmount }}</p>
            <p>已提现金额</p>
          </div>
        </el-card>
      </div>
    </div>
    <div class="Columnar">
      <Columnar />
    </div>
    <el-row :gutter="24">
      <el-col :span="12" :offset="0">
        <Guildrank />
      </el-col>
      <el-col :span="12" :offset="0">
        <Anchor />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import EchartsTree from "@/components/echartsPage/echartsTree";
import Columnar from "@/components/echartsPage/Columnar";
import Guildrank from "@/views/table/Guildrank";//公会获取打赏找票（未分账）排名
import Anchor from "@/views/table/Anchor";//公会主播获取打赏找票（未分账）排名
import { dataDisplay } from '@/api/guild/dashboard'
export default {
  created() {
    // 获取数据
    this.getdata()
  },
  components: {
    Columnar,
    Guildrank,
    Anchor,
  },
  // name: 'Dashboard',
  computed: {
    // ...mapGetters([
    //   'name'
    // ])
  },
  data() {
    return {
      notWithdrawalAmount: 0,
      withdrawalAmount: 0,
      // anchorNums	integer($int32) 公会主播总数量
      // guildNums	integer($int32) 平台工会总数量
      // notWithdrawalAmount	number 待提现金额
      // totalJBalance	number 公会总获取打赏找票
      // withdrawalAmount	number 已提现金额

      // Reward 打赏 GuildBig 公会 anchorBig 主播
      dataPresen: [
        { name: "平台公会数量", number: 0, classname: "cardBgc_one", iconName: "Reward" },
        { name: "公会主播总数", number: 0, classname: "cardBgc_two", iconName: "GuildBig" },
        { name: "公会总获取打赏找票(未分账)", number: 0, classname: "cardBgc_three", iconName: "anchorBig" },
        // { name: "全部公会收益",number:0,classname:"cardBgc_fr",iconName:"anchorBig" },
      ],
    }
  },
  methods: {
    getdata() {
      dataDisplay().then(response => {
        if (response.code == "0") {
          this.dataPresen[0].number = response.data.guildNums
          this.dataPresen[1].number = response.data.anchorNums
          this.dataPresen[2].number = response.data.totalJBalance
          this.notWithdrawalAmount = response.data.notWithdrawalAmount
          this.withdrawalAmount = response.data.withdrawalAmount
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
#cardmain {
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.el-card__body {
  display: flex !important;
  justify-content: space-around !important;
  align-items: center !important;
}
.el-card {
  border-radius: 20px;
  color: #fff;
  font-weight: 900;
}

.cardBgc_one {
  width: 19%;
  height: 150px;
  background-image: linear-gradient(
    50deg,
    #fd5783 0%,
    #b25fef 50%,
    #7599f6 100%
  );
}
.cardBgc_two {
  width: 19%;
  height: 150px;
  background-image: linear-gradient(
    50deg,
    #5b3cd7 0%,
    #c976a0 50%,
    #f1beb7 100%
  );
}
.cardBgc_three {
  width: 19%;
  height: 150px;
  background-image: linear-gradient(
    50deg,
    #f3b6ec 0%,
    #ee93fa 50%,
    #7e91f0 100%
  );
}
.cardBgc_fr {
  width: 19%;
  height: 150px;
  background-image: linear-gradient(
    50deg,
    #5f5c5c 0%,
    #f595f8 50%,
    #84e1f9 100%
  );
}
.Columnar {
  margin-top: 40px;
}
.content_name,
.svg-container {
  display: inline-block;
}
.content_name {
  flex: 8;
  line-height: 30px;
}
.content {
  flex: 8;
  line-height: 20px;
}
.svg-container {
  flex: 2;
  font-size: 48px;
}
.Withdra_box {
  display: flex;
}
</style>

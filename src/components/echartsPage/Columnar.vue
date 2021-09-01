<template>
  <div id="Columnar_box"></div>
</template>

<script>
// 所有echarts根据实际做修改
import * as echarts from 'echarts';
import { guildStatisticsChart } from '@/api/guild/columnarechart'
export default {
  created() {
    this.getdata()
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      // 根据需求修改
      option: {
        title: {
          text: '平台收益总额统计(近一年)'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '收益',
            type: 'bar',
            barWidth: '60%',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]//数据
          }
        ],
        // backgroundColor: '#2c343c'
      }
    }
  },
  methods: {
    init() {
      var Columnar_box = echarts.init(document.getElementById("Columnar_box"))
      Columnar_box.setOption(this.option);
      window.onresize = Columnar_box.resize;
    },
    // 月份排序
    sortarr(arr2) {
      if(arr2.length<1)return false
      var len = arr2.length - 1
      var fornum = 0;//执行了几次
      var forsur = 12 - arr2[len].month;
      var forsurmon = 13;
      // 月份
      for (let i = arr2[len].month+1; i > 0; i--) {
        fornum++
        var forsurmonup = `${i}月`
        this.option.xAxis[0].data.push(forsurmonup)
      };
      for (let j = 1; j < forsur; j++) {
        forsurmon--
        var fortit = `${forsurmon}月`
        this.option.xAxis[0].data.push(fortit)
      }
      // 数据
      arr2.forEach((item, index) => {
        this.option.series[0].data[index] = item.nums
      });
    },
    // 获得数据封装
    getdata() {
      guildStatisticsChart().then(response => {
        if (response.code == "0") {
          this.sortarr(response.data)
          this.option.xAxis[0].data.reverse()
          this.option.series[0].data.reverse()
          this.init()
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#Columnar_box {
  width: 100%;
  height: 500px;
  margin: 0 auto;
}
</style>

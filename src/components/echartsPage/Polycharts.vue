<template>
  <div id="Polycharts"></div>
</template>

<script>
// 所有echarts根据实际做修改
import * as echarts from 'echarts';
export default {
  created () {
    this.getdata()
  },
  mounted () {
    this.init()
  },
  data () {
    return {
      // 需修改
      option: {
        title: {
          text: '近30天注册走势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['男士', '女士',]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0,
              color: '#4C84FF'
            }, {
              offset: 1,
              color: '#F07AAD'
            }],
            globalCoord: false
          },
          type: 'category',
          boundaryGap: false,
          data: []//日期
        },
        yAxis: {
          type: 'value'
        },
        color: ['#61A5E8', '#e77c8e'],
        series: [
          {
            name: '男士',
            type: 'line',
            stack: '总量',
            data: []//数量
          },
          {
            name: '女士',
            type: 'line',
            stack: '总量',
            data: []//数量
          },
        ]
      }
    }
  },
  methods: {
    init () {
      var Polycharts = echarts.init(document.getElementById("Polycharts"))
      Polycharts.setOption(this.option);
      window.onresize = Polycharts.resize;
    },
    // 获取相关数据
    getdata(){

    }
  }
}
</script>

<style lang="less" scoped>
#Polycharts {
  width: 100%;
  height: 500px;
}
</style>

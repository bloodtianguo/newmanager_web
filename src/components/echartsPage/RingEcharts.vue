<template>
  <div id="Ringcharts"></div>
</template>
<script>
import { Privatechat } from '@/API/apis'
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
      // 获取数据
      option: {
        title: {
          text: '近30天数据占比'
        },
        color: ['#61A5E8', '#e77c8e'],
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: ['男士', '女士']
        },
        series: [
          {
            name: '私聊占比',
            type: 'pie',
            radius: ['40%', '60%'],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,

              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: [
              { value: 0, name: '男士' },
              { value: 0, name: '女士' },
            ]
          }
        ]
      }
    }
  },
  methods: {
    init () {
      var Ringcharts = echarts.init(document.getElementById("Ringcharts"))
      Ringcharts.setOption(this.option);
      window.onresize = Ringcharts.resize;
    },
    getdata () {
    }
  }
}
</script>

<style lang="less" scoped>
#Ringcharts {
  width: 100vh;
  height: 500px;
}
</style>

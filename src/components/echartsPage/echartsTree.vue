<template>
  <div id="mycharts_tree"></div>
</template>

<script>
import * as echarts from 'echarts';
import treeData from "./treeData.json";//假数据需删除
export default {
  mounted () {
    this.init()
  },
  created () {
    // this.getdata(treeData)
  },
  data () {
    return {
      autoHeight: 600,
      treeData,
      option: {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',

            data: [treeData],

            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',

            symbolSize: 7,

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 9
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            emphasis: {
              focus: 'descendant'
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
    }
  },
  methods: {
    init () {
      this.getdata();
      var mycharts_tree = echarts.init(document.getElementById("mycharts_tree"));
      mycharts_tree.setOption(this.option);
      this.autoHeight = this.treeData.children.length * 40 + 50;
      mycharts_tree.resize({ height: this.autoHeight });
      window.onresize = mycharts_tree.resize;
      // console.log(this.autoHeight)//动态修echarts的高度
    },
    getdata () {
      // 模拟获取数据需对接正式接口
      var treeNum = 0//数组对象最后一层所有对象的个数
      let arr = this.treeData.children
      arr.map(item => {
        item.children.map(items => {
          if (items.children) {
            items.children.map(itemtr => {
              if (items.children) {
                 treeNum+=items.children.length
                 console.log(treeNum);//需要按实际需求修改 只算展开的
              }
            })
          }

        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#mycharts_tree {
  width: 100vh;
  height: 600px;
  background-color: red($color: #fd0606);
}
</style>

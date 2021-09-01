<template>
    <div>
        <head-title :title="'数据统计'" />
        <div class="tj_tit showbg">
            数据统计
            <el-popover
            placement="top-start"
            width="427"
            trigger="hover"
            popper-class="tj_popover"
            >
                <div>
                    <strong>数据统计(实时更新数据)</strong>  <br />
                    观看人次：观看直播用户人次；<br />
                    直播打赏人次：直播间打赏用户人次；<br />
                    直播打赏数额：平台个人主播直播间获得打赏总数额；<br />
                    开播场次：平台个人主播累计开播场次；<br />
                    平台主播数：平台个人主播总数量<br />
                    打赏数据：直播间用户打赏数据统计
                </div>
                <span class="moe" slot="reference"></span> 
            </el-popover>
        </div>
        <div class="top-data">
            <div>
                <p>观看人次</p>
                <p>{{count.countWatchPersonTime ? count.countWatchPersonTime :'0'}} <span>(人)</span></p>
            </div>
            <div>
                <p>直播打赏人次</p>
                <p>{{count.countRewardPersonTime ? count.countRewardPersonTime :'0'}} <span>(人)</span></p>
            </div>
            <div>
                <p>直播打赏数额(找票)</p>
                <p>{{count.countRewardAmount?count.countRewardAmount:'0'}} <span>(个)</span></p>
            </div>
            <div>
                <p>开播场次</p>
                <p>{{count.countLievRecord?count.countLievRecord:'0'}} <span>(次)</span></p>
            </div>
            <div>
                <p>平台主播数</p>
                <p>{{count.countPlatAnchor?count.countPlatAnchor:'0'}} <span>(人)</span></p>
            </div>
            
            
            
            
        </div>
        <div class="reward-title">
            打赏数据
            <el-radio-group v-model="radio1" @change="radioChangeHandle">
                <el-radio-button label="1">全部</el-radio-button>
                <el-radio-button label="2">昨日</el-radio-button>
            </el-radio-group>
        </div>
        <!-- 表格 -->
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                height="541"
                border
                cell-class-name="t-cell"
                header-cell-class-name="t-cell h-cell"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                v-loading="loading"
                element-loading-text="数据加载中"
                
                >
                <el-table-column
                prop="imgUrl"
                label="头像"
                class-name="head-icon"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <img class="icon" :src="scope.row.imgUrl"  />
                    </template>
                </el-table-column>

                <el-table-column
                prop="nickName"
                
                label="用户昵称"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="userId"
                
                label="用户ID"
                show-overflow-tooltip
                >
                </el-table-column>
                
                <el-table-column
                prop="money"
                :formatter="NumFormart"
                label="打赏金额"
                class-name='right-line'
                show-overflow-tooltip
                >
                </el-table-column>

               <el-table-column
                prop="imgUrl2"
                class-name="head-icon"
                label="头像"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <img class="icon" :src="scope.row.imgUrl2"  />
                    </template>
                </el-table-column>

                <el-table-column
                prop="nickName2"
                
                label="用户昵称"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="userId2"
                
                label="用户ID"
                show-overflow-tooltip
                >
                </el-table-column>
                
                <el-table-column
                prop="money2"
                :formatter="NumFormart"
                label="打赏金额"
                show-overflow-tooltip
                >
                </el-table-column>

               
            </el-table>
        </div>

        <!-- 分页 -->
        <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align: left; margin-top: 10px"
        :total="total"
        :page-size="params.limit"
        :current-page="params.page"
        @current-change="currentChange($event)"
        @size-change="sizeChange($event)"
        ></el-pagination>
    </div>
    </div>
</template>

<script>
import {
    statisticsAPI,
    dataCountAPI,
} from "@/api/platformAnchor/platformAnchor";
import HeadTitle from "../../components/headtitle.vue";
export default {
    components: {
        HeadTitle,
    },
    data() {
        return {
            radio1: "2",
            tableData: [],
            total: 0,
            params: {
                linit: 10,
                page: 1,
            },
            loading: false,

            // 头部总计统计
            count: {
                countLievRecord: 0,
                countPlatAnchor: 0,
                countRewardAmount: 0,
                countRewardPersonTime: 0,
                countWatchPersonTime: 0,
            },
        };
    },
    mounted() {
        this.getCountData();
        this.getData();
    },
    beforeDestroy() {},
    methods: {
        //#region   分页功能方法

        currentChange(e) {
            this.params.page = e;
            this.getData();
        },
        sizeChange(e) {
            this.params.linit = e;
            this.getData();
        },
        //#endregion

        // 获取数据
        async getData() {
            let params = {
                page: this.params.page,
                row: this.params.linit,
                type: this.radio1,
            };
            let res = await statisticsAPI(params);

            if (res.code == 0) {
                this.total = res.data.total;
                this.tableData = [];
                let arr = res.data.records;
                for (let i = 0; i < arr.length; i += 2) {
                    let obj = {};
                    if (i + 1 < arr.length) {
                        obj = {
                            imgUrl2: arr[i + 1].imgUrl,
                            nickName2: arr[i + 1].nickName,
                            userId2: arr[i + 1].userId,
                            money2: arr[i + 1].money,
                        };
                    }
                    this.tableData.push({
                        ...arr[i],
                        ...obj,
                    });
                }
            }
        },

        // 获取统计
        async getCountData() {
            let res = await dataCountAPI();
            if (res.code == 0) {
                if (res.data) {
                    this.count = res.data;
                }
            }
        },

        // 单选切换事件
        radioChangeHandle(val) {
            this.params.page = 1;
            this.getData();
        },

        // 数字格式化显示
        NumFormart(row, clum, cellValue, index) {
            let num = row[clum.property];
            if (num == undefined) return;
            return (
                (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") +
                "找票"
            );
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin bagc($index){
    div:nth-child(#{$index}) {
        background-image:  url('../../assets/images/platformAnchor/stat'+$index+'.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        p:nth-child(1)::before{
            background-image:url('../../assets/images/platformAnchor/icon'+$index+'.png');
        }
    }
} 
.tj_tit {
    display: flex;
    align-items: center;
    font-size: 22px;
    margin: 25px 0 38px 0;
    span.moe {
        display: inline-block;
        margin-left: 10px;
        background-image: url("../../assets/images/userdata/mark.png");
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
        background-size: contain;
        cursor: pointer;
    }
}
.top-data {
    display: flex;
    justify-content: space-between;
    & > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 19%;
        height: 160px;
        min-width: 310px;
        padding-left: 65px;
        & > p:nth-child(1) {
            font-size: 22px;
            color: #fff;
            margin-bottom: 20px;
        }
        & > p:nth-child(2) {
            font-size: 34px;
            color: #fff;
            display: flex;
            span {
                display: inline-block;
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #fff;
                margin: 21px 0 0 5px;
            }
        }
        p{
            position: relative;
        }
        p:nth-child(1)::before{
            position: absolute;
            top: 2px;
            left: -35px;
            display: block;
            content: '';
            width: 31px;
            height: 23px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        
        
    }

    @include bagc(1);
    @include bagc(2);
    @include bagc(3);
    @include bagc(4);
    @include bagc(5);
    
}

.reward-title {
    display: flex;
    justify-content: space-between;
    margin: 33px 0 22px 0;
    font-size: 22px;
}
::v-deep .el-radio-group span{
    width: 100px;
    font-size: 16px;
    padding: 11px 20px;
}
::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #1C223E;
    border-color: #1C223E;
    box-shadow: none;
}
.table {
    ::v-deep.t-cell {
        text-align: center;
    }

    ::v-deep td[class*="right-line"] {
        border-right: 1px solid rgba(175, 173, 173, 0.658);
    }
    ::v-deep td[class*="head-icon"] {
        padding: 0;
        div {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    ::v-deep.h-cell .cell {
        height: 34px;
        line-height: 34px;
    }
    .icon {
        max-height: 46px;
    }
}

</style>
<style lang="scss">
.tj_popover {
    background-color: rgba(0, 0, 0, 0.6) !important;
    color: #fff;
    border: 0;
    .popper__arrow::after {
        border-top-color: rgba(0, 0, 0, 0.6) !important;
        border-bottom-color: rgba(0, 0, 0, 0.6) !important;
    }
}
</style>
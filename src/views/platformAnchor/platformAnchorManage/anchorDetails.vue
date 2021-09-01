<template>
    <div>
        <head-title :title="'主播详情'" />
        <div class="head">
            <div class="photo">
                <el-avatar :src="anchor.portrait" :size="140"></el-avatar>
                <div class="nickname">{{anchor.nickName}}</div>
                <div class="anchorid">ID:{{anchor.userId}}</div>
            </div>
            <div class="message">
                <p>性别：{{anchor.gender == 0 ?'男':'女'}}</p>
                <p>绑定手机：{{anchor.phone}}</p>
                <p>生日：{{anchor.birthday}}</p>
                <p>地区：{{anchor.region}}</p>
                <div>
                    <p style="width:70px">个人简介：</p>
                    <el-popover
                    placement="top-start"
                    title="个人简介："
                    width="427"
                    trigger="hover"
                    :disabled="introIsShow"
                    :content="anchor.sign"
                    >
                        <p id="intro" class="intro" slot="reference" style="width:465px">{{anchor.sign?anchor.sign:'--'}}</p> 
                    </el-popover>
                </div>
            </div>
            <div class="board">
                <div>
                    <p>粉丝数</p>
                    <p><span>{{ NumFormart(anchor.totalFuns)}}</span> 个</p>
                </div>
                <div>
                    <p>本月直播找票收益</p>
                    <p><span> {{NumFormart(anchor.monthJBalance)}}</span> 找票(￥{{anchor.reflectMonthMoney}})</p>
                </div>
                <div>
                    <p>本月在播时长</p>
                    <p><span>{{liveTimeFomart[0]}}</span>时<span>{{liveTimeFomart[1]}}</span>分<span>{{liveTimeFomart[2]}}</span>秒</p>
                    
                </div>
                <div>
                    <p>账户余额</p>
                    <p><span>{{NumFormart( anchor.jbalance)}}</span> 找票(￥{{ anchor.reflectMoney}})</p>
                </div>

            </div>
        </div>

        <div class="search">
            <div class="title">历史直播</div>
            <el-date-picker
                @change="timeChange"
                class="picker-time"
                v-model="date"
                align="right"
                type="datetimerange"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </div>

        <!-- 表格 -->
        <div class="table">
            <el-table
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
            @sort-change="changeSort"
            >

                <el-table-column
                prop="beginTime"
                label="开播时间"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{changedata(scope.row.beginTime)}}
                    </template>
                </el-table-column>

                <el-table-column
                prop="endTime"
                label="结束时间"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                       <span v-if="scope.row.endTime">{{changedata(scope.row.endTime)}}</span>
                       <span v-else>--</span> 
                    </template>
                </el-table-column>

                <el-table-column
                prop="jbalance"
                label="直播收益"
                sortable="custom"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{NumFormart(scope.row.jbalance) + '找票 (￥'+ scope.row.reflectMoney +')'}}
                    </template>
                </el-table-column>
                
                <el-table-column
                prop="watchNum"
                label="观看人数"
                sortable="custom"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{NumFormart(scope.row.watchNum)}}
                    </template>
                </el-table-column>

               <el-table-column
                prop="watchTimes"
                label="观看人次"
                sortable="custom"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{NumFormart(scope.row.watchTimes)}}
                    </template>
                </el-table-column>

                <el-table-column
                prop="funsRate"
                label="转粉率"
                sortable="custom"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.endTime">{{scope.row.funsRate  + '%'}}</span> 
                        <span v-else>--</span>
                    </template>
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
</template>

<script>
function NumFormart(num){
    return  (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
import { liveBroadcastInfoDetailsAPI,liveHistoryAPI } from  '@/api/platformAnchor/platformAnchor'
import HeadTitle from '@/components/headtitle.vue'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{
            anchor:{
                
            },
            date:[],

            tableData:[],
            loading:false,
            sortField:'', // 排序字段 j_balance:直播收益 watch_num：观看人数 watch_times：观看人次 funs_rate：转粉率(例：0.12)
            sortType:'', // 排序类型 asc: 升序 desc: 降序
            startTime:'',
            endTime:'',

            total:0,
            params:{
                linit:10,
                page:1
            },

            // 简介提示
            introIsShow:true,
        }
    },
    created(){
        this.NumFormart = NumFormart
    },
    mounted(){
        this.getInfoData()
        this.getData()
    },
    methods:{
        // 获取主播信息
        async getInfoData(){
            let params = {
                userId:this.$route.query.id
            }
            let res = await liveBroadcastInfoDetailsAPI(params)
            
            if(res.code ==0){
                this.anchor = res.data
                
                // this.anchor.sign = '排序字段 j_balance:直播收益 watch_num：观看人数 watch_times：观看人次 funs_rate：转粉率(例：0.12)排序字段 j_balance:直播收益 watch_num：观看人数 watch_times：观看人次 funs_rate：转粉率(例：0.12)排序字段 j_balance:直播收益 watch_num：观看人数 watch_times：观看人次 funs_rate：转粉率(例：0.12)排序字段 j_balance:直播收益 watch_num：观看人数 watch_times：观看人次 funs_rate：转粉率(例：0.12)'
            }

        },

        // 直播记录
        async getData(){
            let params = {
                userId:this.$route.query.id,
                page:this.params.page,
                rows:this.params.linit,
                sortField:this.sortField,
                sortType:this.sortType,
                startTime:this.startTime,
                endTime:this.endTime
            }
            let res = await liveHistoryAPI(params)
            if(res.code == 0){
                this.tableData = res.data.records
                this.total = res.data.total
                
            }
        },

        // 简介文字溢出开启popover
        setPopover(){
            let p = document.querySelector('#intro')
            if(p.scrollHeight > p.offsetHeight){
                this.introIsShow = false
            }
        },

        //#region  分页
        currentChange(e){
            this.params.page = e
            this.getData()
        },
        sizeChange(e){
            this.params.linit = e
            this.getData()
        },
        //#endregion

        //#region 点击排序
        changeSort({prop,order}){
           
            
            // ascending 升序   descending 降序

            if(prop == 'jbalance'){
                prop = 'j_balance'
            }
            if(prop == 'watchNum'){
                prop = "watch_num"
            }
            if(prop == 'watchTimes'){
                prop = "watch_times"
            }
            if(prop == 'funsRate'){
                prop = "funs_rate"
            }

            if(order == 'ascending'){
                order = 'asc'
            }
            if(order== 'descending'){
                order = 'desc'
            }

           this.sortField = prop
           this.sortType = order

           this.getData()
           
        },
        //#endregion

        timeChange(val){
            // 点击清除日期时 date 会赋值为null
            if(val == null){
                this.date = ['','']
            }
            this.params.page = 1
            this.startTime = this.date[0]
            this.endTime = this.date[1]
            console.log(this.date);
            // 发送数据请求...
            this.getData()
        }
    },

    watch:{
        'anchor.sign':{
            handler(){
                this.$nextTick(()=>{
                    this.setPopover()
                })
            },
            immediate:true
        }
        
    },
    computed:{
        liveTimeFomart(){
            
            let t = this.anchor.monthLiveTime
            if(t == null || t == undefined || isNaN(parseInt(t))) return ['00','00','00']
            let h = Math.floor( t / 60 / 60)
            let m =  Math.floor( t % (60 * 60) / 60) 
            let s =  t % (60*60) % 60 

            // h == 0 && (h = '00')
            // m == 0 && (m = '00')
            // s == 0 && (s = '00')
             h < 10 && (h = '0' + h)
             m < 10 && (m = '0' + m)
             s < 10 && (s = '0' + s)

            return [h,m,s]
        }
    }
    
}
</script>

<style lang="scss" scoped>
.head{
    display: flex;
    justify-content: flex-start;
    height: 288px;
    background-color: #fff;
    &>div{
        padding: 20px 0;
    }
    .photo{
        width: 20%;
        // border: 1px solid #ebeef5;
        .el-avatar{
            display: block;
            margin: 0 auto;
            border: 1px solid #e4e7ed;
        }
        &>div{
            text-align: center;
            margin-top: 10px;
        }
        .nickname{
            font-size: 24px;
            color: #333;
        }
        .anchorid{
            font-size: 18px;
            color: #666;
        }
        ::v-deep .el-avatar{
            border-width: 8px;
        }
        
        
    }
    .message{
        width: 615px;
        p{
            padding: 6px 0;
            margin: 0 0 15px 0;
            font-size: 14px;
            font-family: PingFang-SC-Medium, PingFang-SC;
        }
        &>div{
            display: flex;
        }
        .intro{
            /* 多余内容省略号处理-多行 */
            padding-bottom: 0;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box; 
            -webkit-box-orient: vertical; 
            -webkit-line-clamp: 2; 
            overflow: hidden;
        }
    }
    .board{
        width: 50%;
        display: flex;
        justify-content: space-evenly;
        align-content: space-between;
        flex-wrap: wrap;
        &>div{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            width: 320px;
            height: 115px;
            box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, .16);
            border-radius: 4px;
            font-size: 18px;
            p:nth-child(1){
                font-size: 22px;
                color: #666;
            }
            p:nth-child(2) span{
                font-size: 24px;
                color: #333;
            }
        }
        div:nth-child(1){
            background-color: #FFF2F0;
        }
        div:nth-child(2){
            background-color: #FFF1F7;
        }
        div:nth-child(3){
            background-color: #F8ECFF;
        }
        div:nth-child(4){
            background-color: #EDEFFF;
        }
    }
}
.search{
    display: flex;
    justify-content: space-between;
    margin: 33px 0 22px 0;
    .picker-time{
        margin-right: 20px;
        ::v-deep input{
            font-size: 12px !important;
        }
    }
}
.title{
    font-size: 22px;
}
.table{
    ::v-deep.t-cell{
        text-align: center;
    }
    ::v-deep.h-cell .cell{
        height: 34px;
        line-height: 34px;
    }
}
</style>
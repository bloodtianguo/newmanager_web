<template>
    <div>
        <head-title :title="'主播管理'" />
        <div class="head">
            <div>
                <span>主播昵称: </span>
                <el-input v-model="searchNickName" placeholder="请输入主播昵称"
                 class="search-value" clearable></el-input>
            </div>
            <div>
                <span>主播ID: </span>
                <el-input v-model="searchId" placeholder="请输入主播ID"
                 @input="changeSeID"
                 class="search-value" clearable></el-input>
            </div>
            <div>
                <span>直播状态：</span> 
                <el-select v-model="liveStatus" clearable  >
                    <el-option
                    v-for="item in liveStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>账号状态：</span> 
                <el-select v-model="accountStatus" clearable >
                    <el-option
                    v-for="item in accountStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-search"  @click="searchHandle">查询</el-button>
                <el-button  @click="resetSearch">重置</el-button>
            </div>
        </div>
        

        <!-- 表格 -->
        <div class="table">
            <el-table
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
            height="591"
            border
            cell-class-name="t-cell"
            header-cell-class-name="t-cell h-cell"
            :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
            v-loading="loading"
            element-loading-text="数据加载中"
            @sort-change="changeSort"
            >

                <el-table-column
                prop="nickName"
                label="主播昵称"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="userId"
                label="主播ID"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="totalJBalance"
                width="180"
                label="直播总收益"
                sortable="custom"
                :formatter="NumFormart"
                show-overflow-tooltip
                >
                </el-table-column>
                
                <el-table-column
                prop="totalOnlineTimeFromMat"
                width="180"
                label="总在线时长"
                sortable="custom"
                class-name='right-line'
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.totalOnlineTimeFromMat ? scope.row.totalOnlineTimeFromMat : '00时00分00秒'}}
                    </template>
                </el-table-column>

               <el-table-column
                prop="totalNum"
                label="总开播次数"
                sortable="custom"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="createTime"
                label="入驻时间"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.createTime">{{changedatano(scope.row.createTime)}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                prop="status"
                label="直播状态"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '0'" style="color:#409eff">休息中</span>
                        <span v-else style="color:#67C23A">直播中</span>
                    </template>
                </el-table-column>

                <el-table-column
                prop="accountStatus"
                label="账号状态"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.accountStatus == '0' ? '禁播':'正常'}}
                    </template>
                </el-table-column>

                <el-table-column
                label="操作"
                fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button  type="danger" size="mini" @click="openDialog(scope.row.userId)" v-if="scope.row.accountStatus == '1'">禁播</el-button>
                        <el-button  type="primary" size="mini" @click="openDialog1(scope.row)" v-else>解禁</el-button>
                        <el-button  type="primary" size="mini" @click="goAnchorDetails(scope.row.userId)">查看详情</el-button>
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
        <!-- 禁播和解禁弹窗自定义组件 -->
        <live-dialog ref="dialog" @banLive="banLiveHandle" @removeBan="removeBanHandle"/>

    </div>
</template>

<script>
import { liveBroadListAPI,banLiveAPI,relieveLiveAPI } from '@/api/platformAnchor/platformAnchor'
import HeadTitle from '@/components/headtitle.vue'
import LiveDialog from '@/components/platformAnchor/liveDialog.vue'
export default {
    components:{
        HeadTitle,
        LiveDialog
    },
    data(){
        return{
            liveStatus:'', // 直播状态
            liveStatusOptions:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'直播中',
                    value:'1'
                },
                {
                    label:'休息中',
                    value:'0'
                },
            ],
            accountStatus:'', // 账号状态
            accountStatusOptions:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'正常',
                    value:'1'
                },
                {
                    label:'禁播',
                    value:'0'
                },
            ],
            searchId:'', // 主播ID
            searchNickName:'', // 主播昵称

            total:0,
            params:{
                linit:10,
                page:1
            },

            tableData:[],
            loading:false,

            sortField:'', // 排序字段 total_j_balance:直播总收益 total_online_time：总在线时长 total_num：总开播次数
            sortType:'',  // asc: 升序 desc: 降序

            currentId:'', //  禁播、解禁操作时的主播id
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        async getData(){
            let params = {
                page:this.params.page,
                rows:this.params.linit,
                sortField:this.sortField,
                sortType:this.sortType,
                status:this.liveStatus,
                accountStatus:this.accountStatus,
                nickName:this.searchNickName,
                userId:this.searchId
            }
            let res = await liveBroadListAPI(params)
            
            if(res.code == 0){
                this.total = res.data.total
                this.tableData = res.data.records
            }
        },
        // 查询
        searchHandle(){
            this.params.page = 1
            this.getData()
        },
        changeSeID(){
            let value = this.searchId
            if(value.length ==1){
                this.searchId=value.replace(/[^0-9]/g,'')
            }else{
                this.searchId=value.replace(/\D/g,'')
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

        // 数字格式化显示
        NumFormart(row,clum,cellValue, index){
            let num = row[clum.property]
            
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '找票 (￥'+ row.reflectMoney +')'
        },


        //#region 点击排序
        changeSort({prop,order}){
            console.log(prop,order);
            
            // ascending 升序   descending 降序

            if(prop == 'totalJBalance'){
                prop = 'total_j_balance'
            }
            if(prop == 'totalOnlineTimeFromMat'){
                prop = "total_online_time"
            }
            if(prop == 'totalNum'){
                prop = "total_num"
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


        // 点击禁播操作
        openDialog(id){
            this.$refs.dialog.openDialog()
            this.currentId = id
        },

        // 禁播接口操作 cab 回调函数，接口操作完成后自动关闭弹窗
        async banLiveHandle(data,cab){
            console.log('禁播接口操作');
            console.log(data);
            let params = {
                banReason:data.ban,
                type:data.time,
                userId:this.currentId
            }
            let res = await banLiveAPI(params)
            
            if(res.code == 0){
                cab()
                this.getData()
                this.Success('操作成功！')
            }else{
                cab()
                this.Warning(res.msg)
            }

            
        },

        // 点击解禁操作
        openDialog1(row){
            let data = {
                reason:row.banReason,
                remain:row.liftBanTimeFormat
            }
            this.$refs.dialog.openDialog1(data)
            this.currentId = row.userId
        },

        // 解除禁播接口操作
        async removeBanHandle(cab){
            
            let res = await relieveLiveAPI({userId:this.currentId})
            if(res.code == 0){
                cab()
                this.getData()
                this.Success('操作成功！')
            }else{
                cab()
                this.Warning(res.msg)
            }
        },

        // 重置搜索条件
        resetSearch(){  
            this.liveStatus = '',
            this.accountStatus = '',
            this.searchId = '',
            this.searchNickName = ''
            this.getData()
        },

        goAnchorDetails(id){
            console.log(id);
            this.$router.push({path:'/platformAnchor/platformAnchorManage/anchorDetails',query:{id}})
        }

    }
}
</script>

<style lang="scss" scoped>
  .head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 0;
    & > div {
      margin:  10px;
      &>span{
        font-weight: 700;
        font-size: 14px;
        color: #606266;
      }
    }
    .el-select {
      width: 140px;
    }
    .search-value {
      width: 185px;
        
    }
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
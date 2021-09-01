<template>
    <div>
        <head-title title="直播间管理" />
        <div class="title">
            直播场次
        </div>

        <!-- 表格 -->
        <div class="table">
            <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                height="591"
                cell-class-name="t-cell"
                header-cell-class-name="t-cell h-cell"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                v-loading="loading"
                element-loading-text="数据加载中"
                border
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
                prop="beginTime"
                width="180"
                label="开播时间"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.beginTime && changedata(scope.row.beginTime)}}
                    </template>
                </el-table-column>
                
                <el-table-column
                prop="endTime"
                width="180"
                label="结束时间"
                class-name='right-line'
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.endTime ? changedata(scope.row.endTime) : '--'}}
                    </template>
                </el-table-column>

               <el-table-column
                prop="realWatchNum"
                label="实时观看量"
                :formatter="NumFormart"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="watchNum"
                
                label="观看人数"
                :formatter="NumFormart"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="watchTimes"
                
                label="观看人次"
                :formatter="NumFormart"
                show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column
                prop="jbalance"
                
                label="打赏收益"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ (scope.row.jbalance || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '找票'}}
                    </template>
                </el-table-column>
                
                <el-table-column
                prop="funsRate"
                label="转粉率"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.funsRate != null && scope.row.endTime ? scope.row.funsRate  + '%' :'--'}}
                    </template>
                </el-table-column>

                <el-table-column
                prop="liveStatus"
                
                label="直播间状态"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <!-- 直播间状态：0-直播中 1-整改中 2-已（正常）结束3-禁播结束 -->
                        <span v-if="scope.row.liveStatus == 0" style="color:#409eff">直播中</span>
                        <span v-if="scope.row.liveStatus == 1" style="color:#E6A23C">整改中</span>
                        <span v-if="scope.row.liveStatus == 2" style="color:#67C23A">已结束</span>
                        <span v-if="scope.row.liveStatus == 3" style="color:#f56c6c">已禁播</span>
                    </template>
                </el-table-column>

                <el-table-column
                prop="status"
                label="账号状态"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.status == 0 ? '禁播' : '正常'}} </span>
                    </template>
                </el-table-column>

                <el-table-column
                prop="reward"
                
                label="操作"
                fixed="right"
                >
                    <template slot-scope="scope">
                        <div v-if="!scope.row.endTime">
                            <el-button class="el-btn-mini" type="primary" size="mini" @click="openDialog1(scope.row)" v-if="scope.row.status == 0">解禁</el-button>
                            <el-button class="el-btn-mini" type="danger" size="mini" @click="openDialog(scope.row.userId)" v-else>禁播</el-button>
                        </div>
                        <div v-else style="height:28px">--</div>
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
import { liveEventsListAPI,banLiveAPI,relieveLiveAPI } from '@/api/platformAnchor/platformAnchor'
import HeadTitle from '../../components/headtitle.vue'
import LiveDialog from '@/components/platformAnchor/liveDialog.vue'
export default {
    components:{
        HeadTitle,
        LiveDialog
    },
    data(){
        return{
            loading:false,
            tableData:[],
            total:0,
            params:{
                linit:10,
                page:1
            },

            currentId:'',
            
        }
    },
    mounted(){
        
        this.getData()
    },
    methods:{

        async getData(){
            let params = {
                page:this.params.page,
                row:this.params.linit,
            }
            let res  = await liveEventsListAPI(params)
            console.log(res);
            if(res.code == 0){
                this.total = res.data.total
                this.tableData = res.data.records
                
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
            // console.log(cellValue);
            // console.log(clum.label);
            
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        },

        // 点击禁播操作
        openDialog(id){
            this.$refs.dialog.openDialog()
            console.log(id);
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

    }
}
</script>

<style lang="scss" scoped>
.title{
    font-size: 22px;
    margin: 33px 0 22px 0;
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
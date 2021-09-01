<template>
    <div class="contanier">
        <selectexeport
        :filetext="filetext"
        :filename="filename"
        :multipleSelection="multipleSelection"
        :tHeader="tHeader"
        :filterVal="filterVal"
        />
        <div class="head">
            <div class="tiem">
                <span>时间：</span>
                <el-date-picker
                    class="picker-time"
                    v-model="date"
                    type="daterange"
                    range-separator="~"
                    
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div>
                <span>用户ID：</span>
                <el-input clearable v-model="searchUserId" placeholder="输入用户ID进行搜索" 
                @input="changeSeID"
                 class="search-value" ></el-input>
            </div>
            <!-- <div>
                <span>视频ID：</span>
                <el-input clearable v-model="searchVideoId" placeholder="输入视频ID进行搜索" oninput="value=value.replace(/[^\d]/g, '')"
                 class="search-value" ></el-input>
            </div> -->
            <div>
                <span>话题ID：</span>
                <el-input clearable v-model="searchTopicId" placeholder="输入话题ID进行搜索" 
                @input="changeSeID"
                 class="search-value" ></el-input>
            </div>
            <div>
                <span>话题名称：</span>
                <el-input clearable v-model="searchTopicName" placeholder="输入话题名称进行搜索" 
                 class="search-value" ></el-input>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-search"  @click="searchHandle">查询</el-button>
                <el-button type="primary" icon="el-icon-folder-opened"  @click="batchHandle">批量下架</el-button>
                
            </div>
        </div>

        <!-- 主体表格 -->
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                height="700"
                border
                cell-class-name="t-cell"
                header-cell-class-name="t-cell"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                v-loading="loading"
                element-loading-text="数据加载中"
                @sort-change="changeSort"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                fixed="left"
                type="selection"
                width="55">
                </el-table-column>

                <el-table-column
                prop="id"
                label="话题id"
                width="120">
                    <template slot-scope="scope">
                        <el-link type="primary" :underline="false" @click="openDialog(scope.row)">{{scope.row.id}}</el-link>
                    </template>
                </el-table-column>

                <el-table-column
                prop="topicName"
                width='150'
                label="话题标题"
                show-overflow-tooltip
                >
                </el-table-column>
                
                
                
                <el-table-column
                label="话题封面"
                width="180">
                    <template slot-scope="scope">
                        <img class="topic-cover" :src="scope.row.topicCover" >
                    </template>
                </el-table-column>

                <el-table-column
                prop="categoryKey"
                label="类别"
                width="150">
                </el-table-column>

                <el-table-column
                prop="startingUser"
                label="首发用户ID"
                show-overflow-tooltip
                width="120">
                </el-table-column>

                <el-table-column
                prop="playNum"
                label="播放量"
                sortable="custom"
                width="120">
                </el-table-column>

                <el-table-column
                prop="worksNum"
                label="作品量"
                sortable="custom"
                show-overflow-tooltip
                min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.worksNum ? scope.row.worksNum :'0'}}
                    </template>
                </el-table-column>

                <el-table-column
                prop="likeNum"
                label="点赞量"
                sortable="custom"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>

                <el-table-column
                prop="favoriteNum"
                label="收藏量"
                sortable="custom"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>
                
                <el-table-column
                prop="shareNum"
                label="分享量"
                sortable="custom"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>

                <el-table-column
                prop="createTime"
                label="发布时间"
                sortable="custom"
                show-overflow-tooltip
                min-width="180">
                </el-table-column>

                <el-table-column
                prop="topicProperty"
                label="话题属性"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>

                <el-table-column
                prop="delReason"
                label="下架原因"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>

                <el-table-column
                label="操作"
                fixed="right"
                min-width="180"
                >
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.type==0" class="el-btn-mini" type="primary" size="mini" @click="outOfBind(scope.row)">解绑</el-button>
                      <el-button v-if="scope.row.type==1"  class="el-btn-mini" type="primary" size="mini" @click="bindOffical(scope.row)">绑定官方</el-button>

                      <el-button  class="el-btn-mini" type="danger" size="mini" @click="openDialog1(scope.row)">下架</el-button>
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
        :page-sizes="[10,20,50,100,1000,5000]"
        :page-size="params.limit"
        :current-page="params.page"
        @current-change="currentChange($event)"
        @size-change="sizeChange($event)"
        ></el-pagination>
        
        <!-- 视频弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" destroy-on-close class="video-mark">
            <video :src="vieoUrl" muted controls></video>
            <div class="foot">
                <el-button type="primary" size="small" @click="closeDialog">确定</el-button>
            </div>
        </el-dialog>
        <!-- 下架操作弹窗 -->
        <el-dialog :title="'信息'" :visible.sync="dialogTableVisible1" destroy-on-close class="revocation-mark">
            <div class="title">确认下架此视频吗？</div>
            <el-input
            type="textarea"
            placeholder="输入100字内的反馈"
            show-word-limit
            :maxlength ="100"
            v-model="textareaB">
            </el-input>
            <div class="foot">
                <el-button type="primary" size="small" @click="submitRevocation">确定</el-button>
                <el-button plain size="small" @click="dialogTableVisible1 = false">取消</el-button>
            </div>
        </el-dialog>
        
       
    </div>
</template>

<script>

import { topicListAPI,removeTopicAPI,bindOfficalAPI,outOfBindAPI } from '../../api/content/topicManage'
import SelectMark from '../../components/selectMark.vue'
export default {
    components:{
        SelectMark
    },
    name:'Recreation',
    data(){
        return{
           
            
            // 时间
            date:[],
            // 搜索关键字
            searchUserId:'',
            searchTopicName:'',
            searchVideoId:'',
            searchTopicId:'',
            sortField:'',
            sortType:'',
            loading:true,
            // 表格数据
            tableData:[ ],
            multipleSelection: [],
            total:0,
            params:{
                linit:10,
                page:1
            },
            
            
            
            //视频弹窗
            dialogTableVisible : false,
            dialogTitle : '', // 弹窗标题
            vieoUrl:'', // 弹窗中视频url


            // 下架弹窗
            dialogTableVisible1:false,
            textareaB:'', // 下架理由
            removeTopics:[], // 下架话题数据
            

            

            // 导出组件设置
            filetext:'话题管理',
            filename:'话题管理',
            tHeader:['话题id','话题标题','话题封面','类别','首发用户ID','播放量','作品量','点赞量','收藏量','分享量','发布时间','话题属性','下架原因'],
            filterVal:['id','topicName','topicCover','categoryKey','startingUser','playNum','worksNum','likeNum','favoriteNum','shareNum','createTime','topicProperty','delReason'],
        }
    },
   
    mounted(){
        this.getData()
    },
    methods:{
        // 获取话题列表
        async getData(){
            this.loading = true
            let params = {
                startTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[0] + ' 00:00:00' : '',
                endTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[1] + ' 00:00:00': '',
                userId:this.searchUserId,
                topicName:this.searchTopicName,
                topicId:this.searchTopicId,
                videoId:this.searchVideoId,
                page:this.params.page,
                rows:this.params.linit,
                field:this.sortField,
                rankType:this.sortType,
            }
            let res = await topicListAPI(params)
            
            if(res.code == 0){
                res.data.records.forEach(e=>{
                    e.createTime && (e.createTime = this.changedata(e.createTime))
                    if(e.category == ''||e.category == 0 || e.category == null){
                        e.categoryKey = '综合'
                    }else if(e.category ==1){
                        e.categoryKey = '招聘'
                    }else if(e.category ==2){
                        e.categoryKey = '房产'
                    }else if(e.category ==3){
                        e.categoryKey = '城市名片'
                    }else if(e.category ==4){
                        e.categoryKey = '娱乐'
                    }else if(e.category ==5){
                        e.categoryKey = '拾金不昧'
                    }else if(e.category ==20){
                        e.categoryKey = '美食'
                    }else if(e.category ==21){
                        e.categoryKey = '酒店'
                    }else if(e.category ==22){
                        e.categoryKey = '景点'
                    }else if(e.category ==23){
                        e.categoryKey = '找车'
                    }else if(e.category ==24){
                        e.categoryKey = '寻人启事'
                    }else if(e.category ==25){
                        e.categoryKey = '寻物启事'
                    }else if(e.category ==26){
                        e.categoryKey = '招领启事'
                    }
                    if(e.type == 0){
                        e.topicProperty = '官方'
                    }else if(e.type == 1){
                        e.topicProperty = '普通'
                    }else if(e.type == 2){
                        e.topicProperty = '热门'
                    }
                })
                this.tableData = res.data.records
                this.total = res.data.total
            }
            this.loading = false
            
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        currentChange(e){
            this.params.page = e
            this.getData()
        },
        sizeChange(e){
            this.params.linit = e
            this.getData()
        },
        

        // 查询
        async searchHandle(){
            this.params.page = 1
           this.getData()
        },
        
        // 打开视频弹窗
        openDialog(item){
            
            this.dialogTitle = item.topicName
            this.vieoUrl = item.videoUrl
            this.dialogTableVisible = true
        },
        // 关闭视频弹窗
        closeDialog(){
            this.dialogTableVisible = false
        },
        /*-------------------------------下架操作------------------------------------*/
        // 打开下架弹窗
        openDialog1(item){
            
            this.textareaB = ''
            this.removeTopics = []
            this.removeTopics.push(item)
            this.dialogTableVisible1 = true
            this.isBatch = false
        },
        // 弹窗确认下架
        async submitRevocation(){
            
            let data = this.removeTopics.map(e=>{
                return {
                    removeReason:this.textareaB,
                    title:e.topicName,
                    topicId:e.id,
                    userId:e.startingUser
                }
            })
            let res = await removeTopicAPI(data)
            if(res.code == 0){
                this.dialogTableVisible1 = false
                this.Success('下架成功')
                this.getData()
            }else{
                this.Success(res.msg)
            }
        },
        // 批量下架打开下架弹窗
        batchHandle(){
            if(this.multipleSelection.length == 0){
                this.Success('至少选定一个视频')
                return
            }
            this.textareaB = ''
            this.removeTopics = []
            this.removeTopics = this.multipleSelection

            this.dialogTableVisible1 = true
            
        },
        /*-------------------------------------------------------------------*/
        // 导出完成清空multipleSelection
        clearmultiple(){
            this.multipleSelection = []
        },

        // 话题绑定官方
        async bindOffical({id}){
            
            let res
            try {
                res = await bindOfficalAPI({topicId:id})
            } catch (error) {
                return
            }
            
            if(res.code == 0){
                this.Success('绑定成功')
                this.getData()
            }
        },
        // 话题解绑
        async outOfBind({id}){
            
            let res
            try {
                res = await outOfBindAPI({topicId:id})
            } catch (error) {
                return
            }
            
            if(res.code == 0){
                this.Success('解绑成功')
                this.getData()
            }
        },

        changeSeID(){
            let value = this.searchUserId
            let value1 = this.searchTopicId
            if(value.length ==1){
                this.searchUserId=value.replace(/[^0-9]/g,'')
            }else{
                this.searchUserId=value.replace(/\D/g,'')
            }
            if(value1.length ==1){
                this.searchTopicId=value1.replace(/[^0-9]/g,'')
            }else{
                this.searchTopicId=value1.replace(/\D/g,'')
            }
        },

        changeSort({prop,order}){
            
            // ascending 升序   descending 降序

            if(prop == 'playNum'){
                prop = 'play_num'
            }
            if(prop == 'worksNum'){
                prop = "video_num"
            }
           
            if(prop == 'likeNum'){
                prop = "like_num"
            }
            // favoriteNum   shareNum   createTime 
            if(prop == 'favoriteNum'){
                prop = 'favorite_num'
            }
            if(prop == 'shareNum'){
                prop = "share_num"
            }
            
            if(prop == 'createTime'){
                prop = "create_time"
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

    }
}
</script>

<style lang="scss" scoped>
.contanier{
    padding: 10px 20px 20px 20px;
    .head{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px 0;
        &>div{
            margin: 10px;
            &>span{
                font-weight: 700;
                font-size: 14px;
                color: #606266;
            }
        }
        .el-select{
            width: 150px;
        }
        .picker-time{
            width: 260px;
        }
        .search-value{
            width: 195px;
        }
        .export_main{
            display: none;
            
        }
    }
    .el-input{
        display: inline-block;
        width: auto;
    }
    .table{
        ::v-deep.t-cell{
            text-align: center;
        }
        .el-btn-mini{
            padding: 4px;
        }
        .topic-cover{
            height: 60px;
        }
    }
    .video-mark{
        ::v-deep.el-dialog{
            width: 338px;
            video{
                width: 290px;
                height: 457px;
            }
            .foot{
                margin-top: 10px;
                text-align: right;
            }
        }
    }
    .revocation-mark{
        ::v-deep.el-dialog{
            width: 450px;
            .el-dialog__body{
                padding: 10px;
            }
            .title{
                text-align: center;
                margin-bottom: 10px;
            }
            
            textarea{
                height: 150px;
                resize: none;
            }

           

            .foot{
                margin-top: 10px;
                text-align: right;
            }
        }
    }
}
</style>
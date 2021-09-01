<template>
<div>


    <div class="recreation-container" v-if="currentPageIsShow">
        <div class="exeport">
            <selectexeport
            :filetext="filetext"
            :filename="filename"
            :multipleSelection="multipleSelection"
            :tHeader="tHeader"
            :filterVal="filterVal"
            />
            <div class="ert-btn">
                <el-button type="success" icon="el-icon-folder-add" @click="addOfficalVideo">添加官宣视频</el-button>
            </div>
        </div>

        <div class="head">
             <div>
                <span>类别：</span>
                <el-select v-model="category" placeholder="请选择" clearable  style="width:106px">
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>类型：</span>
                <el-select v-model="category1" clearable  placeholder="请选择" style="width:130px">
                    <el-option
                    v-for="item in category1Options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>上架状态：</span>
                <el-select v-model="status" clearable  placeholder="请选择" >
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
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
                <!--  oninput="value=value.replace(/[^\d]/g, '')" -->
                <el-input clearable v-model.trim="searchUserId" placeholder="输入用户ID"
                 @input="changeSeID"
                 class="search-value" ></el-input>
            </div>
            <div>
                <span>视频标题：</span>
                <el-input clearable v-model="searchVideoTitle" placeholder="输入视频标题"
                 class="search-value" ></el-input>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-search"  @click="searchHandle">查询</el-button>


            </div>
            <div>

                <el-button type="primary" icon="el-icon-folder-opened"  @click="batchHandle">批量下架</el-button>
            </div>

        </div>

        <!-- 表格 -->
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                height="600"
                max-height="600"
                border
                cell-class-name="t-cell"
                header-cell-class-name="t-cell"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                v-loading="loading"
                element-loading-text="数据加载中"
                @sort-change="changeSort"
                @selection-change="handleSelectionChange">
                <el-table-column
                fixed="left"
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="videoId"
                label="短视频ID"
                width="120">
                    <template slot-scope="scope" >
                        <el-link type="primary" :underline="false" @click="openDialog(scope.row)">{{scope.row.videoId}}</el-link>
                    </template>
                </el-table-column>
                 <el-table-column
                prop="name"
                label="类别"
                width="120">
                </el-table-column>
                 <el-table-column
                prop="type"
                label="类型"
                width="120">
                </el-table-column>
                <el-table-column
                prop="userId"
                label="用户ID"
                width="120">
                    <template slot-scope="scope">
                        <el-link type="primary" :underline="false" @click="goUserDetails(scope.row)">{{scope.row.userId}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column
                prop="nickName"
                width='120'
                label="用户昵称"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="title"
                label="短视频标题"
                show-overflow-tooltip
                width="120">
                </el-table-column>
                <el-table-column
                prop="reward"
                label="被打赏数"

                sortable="custom"

                width="120">
                    <template slot-scope="scope" >
                        {{scope.row.reward ? scope.row.reward : 0  }}
                    </template>
                </el-table-column>
                <el-table-column
                prop="likeNum"
                label="被点赞数"
                sortable="custom"
                width="120">
                    <template slot-scope="scope" >
                        {{scope.row.likeNum ? scope.row.likeNum : 0  }}
                    </template>
                </el-table-column>
                <!-- <el-table-column
                prop="tags"
                label="视频标签"
                show-overflow-tooltip
                width="180">
                    <template slot-scope="scope">
                        {{scope.row.tags && scope.row.tags.replace(/,/g, '/')}}
                    </template>
                </el-table-column> -->
                <el-table-column
                prop="createTimeFormat"
                label="发布时间"
                sortable
                show-overflow-tooltip
                width="180">
                </el-table-column>
                <el-table-column
                prop="score"
                label="内容得分"
                sortable="custom"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>
                <el-table-column
                prop="shelvesStatusKey"
                label="上下架状态"
                sortable="custom"
                width="120">
                </el-table-column>
                <el-table-column
                prop="mark"
                label="下架原因"
                show-overflow-tooltip
                width="180" >
                </el-table-column>
                <el-table-column
                label="操作"
                fixed="right"
                min-width="200"
                >
                    <template slot-scope="scope">
                        <el-button  class="el-btn-mini" type="primary" size="mini" @click="goVideoDetails(scope.row)">详情</el-button>
                        <el-button v-if="scope.row.shelvesStatus == 0"  class="el-btn-mini" type="danger" size="mini" @click="openDialog1(scope.row.videoId)">下架</el-button>
                        <el-button v-if="scope.row.shelvesStatus == 1"  class="el-btn-mini" type="danger" size="mini" @click="added(scope.row.videoId)">重新上架</el-button>
                          <el-button class="el-btn-mini" type="success" size="mini" @click="changecover(scope.row.videoId)">修改封面</el-button>
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
        <!-- 标签弹框 -->
        <select-mark
        v-if="isShowMark"
        ref="selectMark"
        :videoID="videoId"
        :tags="tags"
        @suerClick="getData"
        />
           <!--修改视频封面-->
        <uploadcover :videoid="videocoverid" :coverVisible="coverVisible" @coverClose="coverClose"/>
    </div>
    <router-view />
</div>
</template>

<script>
import SelectMark from '@/components/selectMark.vue'
import uploadcover from '@/components/uploadVideocover.vue'
import { lostAndFoundVideoListAPI,updateShelvesAPI,batchUpdateShelvesAPI, addOfficealVideoAPI } from '@/api/content/recreation'
export default {
    components:{
        SelectMark,
        uploadcover
    },
    data(){
        return{
                 //修改封面
      coverVisible:false,
      videocoverid:0,
            // 当前页面内容在进入子路由后不显示
            currentPageIsShow:true,
            // 类别
            category:'',
            categoryOptions:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'招领启事',
                    value:'26'
                },
                {
                    label:'找物',
                    value:'25'
                },
                {
                    label:'找人',
                    value:'24'
                },
            ],
            // 类型   钥匙   宠物   钱包   数码产品   手袋/包   衣物/鞋帽    首饰/挂饰   文件/书籍   行李/包裹   卡类/证件
            category1:'',
            category1Options:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'找钥匙',
                    value:'钥匙',
                },
                {
                    label:'找宠物',
                    value:'宠物'
                },
                {
                    label:'找钱包',
                    value:'钱包',
                },
                {
                    label:'找数码产品',
                    value:'数码产品',
                },
                {
                    label:'找手袋/包',
                    value:'手袋/包',
                },
                {
                    label:'找衣物/鞋帽',
                    value:'衣物/鞋帽',
                },
                {
                    label:'找首饰/挂饰',
                    value:'首饰/挂饰',
                },
                {
                    label:'找文件/书籍',
                    value:'文件/书籍',
                },
                {
                    label:'找行李/包裹',
                    value:'行李/包裹',
                },
                {
                    label:'找卡类/证件',
                    value:'卡类/证件',
                },
                {
                    value:'找娃娃'
                },
                {
                    value:'找亲人'
                },
                {
                    value:'找同学'
                },
                {
                    value:'找战友'
                },
                {
                    value:'找老乡'
                },
                {
                    label:'找其它',
                    value:'其它'
                },

            ],
            // 上架状态
            status:'',
            statusOptions:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'上架中',
                    value:'0'
                },
                {
                    label:'已下架',
                    value:'1'
                },
            ],
            // 时间选择
            date:[],
            searchUserId:'',
            searchVideoTitle:'',
            sortField:'',
            sortType:'',
            // 表格
            tableData:[],
            loading:true,
            multipleSelection: [],
            // 分页
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
            revocationVideoId:'', // 下架视频id
            isBatch:false, // 是否是批量下架

            // 标签
            isShowMark:false,
            videoId:'',
            tags:'', // 已有标签

            // 导出组件设置
            filetext:'拾金不昧',
            filename:'拾金不昧',
            tHeader:['短视频ID','类别','类型','用户ID','用户昵称','短视频标题','被打赏数','被点赞数','发布时间','内容得分','上下架状态','下架原因'],
            filterVal:['videoId','name','type','userId','nickName','title','reward','likeNum','createTimeFormat','score','shelvesStatusKey','mark'],
        }
    },
    mounted(){
        this.currentPageHandle()
        if(this.currentPageIsShow) this.getData()
    },
    methods:{
          //修改封面部分
    changecover(id){
      this.videocoverid=id
      this.coverVisible=true
    },//打开视频封面
    coverClose(val){
      this.coverVisible=val
    },
        // 获取数据
        async getData(){
            this.loading = true
            let params = {
                categoryId:this.category,
                type:this.category1,
                page:this.params.page,
                rows:this.params.linit,
                shelvesStatus:this.status,
                startTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[0] : '',
                endTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[1] : '',
                userId:this.searchUserId,
                videoTitle:this.searchVideoTitle,
                sortField:this.sortField,
                sortType:this.sortType
            }
            let res = await lostAndFoundVideoListAPI(params)

            if(res.code == 0){
                this.total = res.data.total
                res.data.records.forEach(e=>{
                    e.createTime && (e.createTimeFormat = this.changedata(e.createTime))
                    if( e.shelvesStatus == 0){
                        e.shelvesStatusKey = '上架中'
                    }
                    if( e.shelvesStatus == 1){
                        e.shelvesStatusKey = '已下架'
                    }
                    if(!e.reward){
                        e.reward = 0
                    }
                    if(!e.likeNum){
                        e.likeNum = 0
                    }

                })
                this.tableData = res.data.records
            }
            this.loading = false
        },
        // 查询
        searchHandle(){
            this.params.page = 1
            this.getData()
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
        // 打开视频弹窗
        openDialog(item){

            this.dialogTitle = item.title
            this.vieoUrl = item.videoUrl
            this.dialogTableVisible = true
        },
        // 关闭视频弹窗
        closeDialog(){
            this.dialogTableVisible = false
        },

        // 打开下架弹窗
        openDialog1(id){

            this.textareaB = ''
            this.revocationVideoId = id
            this.dialogTableVisible1 = true
            this.isBatch = false
        },
        // 弹窗确认下架
        async submitRevocation(){
            let res
            if(this.isBatch){
                let params = {
                    ids:this.revocationVideoId,
                    message:this.textareaB
                }
                res = await batchUpdateShelvesAPI(params)

            }else{
                let params = {
                    videoId:this.revocationVideoId,
                    message:this.textareaB,
                    status:1
                }
                res =await updateShelvesAPI(params)
            }

            if(res.code == 0){
                this.dialogTableVisible1 = false
                this.Success('下架成功')
                this.getData()
            }else{
                this.Warning(res.msg)
            }
        },

        // 重新上架
        async added(id){
            let params = {
                videoId:id,
                message:'',
                status:0
            }
            let res = await updateShelvesAPI(params)

            if(res.code == 0){
                this.Success('上架成功')
                this.getData()
            }else{
                this.Warning(res.msg)
            }
        },

        // 批量下架打开下架弹窗
        batchHandle(){
            if(this.multipleSelection.length == 0){
                this.Warning('至少选定一个视频')
                return
            }
            let ids = this.multipleSelection.map(e=>e.videoId).join(',')
            this.textareaB = ''
            this.revocationVideoId = ids
            this.dialogTableVisible1 = true
            this.isBatch = true
        },
        // 导出完成清空multipleSelection
        clearmultiple(){
            this.multipleSelection = []
        },

        // 绑定为官方视频
        async addOfficalVideo(){
            if(this.multipleSelection.length !=1){
                this.Warning('请选定一个视频')
                return
            }
            let params = {
                userId:this.multipleSelection[0].userId,
                videoId:this.multipleSelection[0].videoId
            }
            try {
                let res = await addOfficealVideoAPI(params)

                if(res.code == 0){
                    this.Success('绑定成功')
                }
            } catch (error) {

            }
        },

        // 打开标签弹框
        openSelectMark(item){
            this.isShowMark = true
            this.videoId = item.videoId + ''
            this.tags = item.tags
            setTimeout(() => {
                this.$refs.selectMark.dialogFormVisible = true
            }, 0)
        },

        // 点击用户id 跳转 用户详情页面
        goUserDetails(item){

        },

        // 跳转视频详情页面
        goVideoDetails({videoId}){

            this.$router.push({path:'/videoContentManage/lostAndFound/videoDetails',query:{videoId}})
        },

        changeSort({prop,order}){

            // ascending 升序   descending 降序

            if(prop == 'createTimeFormat'){
                prop = 'createTime'
            }
            if(prop == 'shelvesStatusKey'){
                prop = "shelves_status"
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

        changeSeID(){
            let value = this.searchUserId
            if(value.length ==1){
                this.searchUserId=value.replace(/[^0-9]/g,'')
            }else{
                this.searchUserId=value.replace(/\D/g,'')
            }
        },

        currentPageHandle(){
            this.currentPageIsShow = this.$route.path == '/videoContentManage/lostAndFound'
        }

    }
}
</script>

<style lang="scss" scoped>
.recreation-container{
    padding: 10px 20px 20px 20px;

    .ert-btn{
        position: absolute;
        top: 10px;
        right: 160px;
        button{
            border: 0;
        }
    }
    .head{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        padding: 10px 0;
        &>div{
            margin:  10px;
            &>span{
                font-weight: 700;
                font-size: 14px;
                color: #606266;
            }
        }
        .el-select{
            width: 100px;
        }
        .picker-time{
            width: 260px;
        }
        .search-value{
            width: 180px;
        }
    }
    .table{
        ::v-deep.t-cell{
            text-align: center;
        }
        .el-btn-mini{
            padding: 4px;
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

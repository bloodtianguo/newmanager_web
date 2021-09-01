<template>
    <div>
        
        <div class="contanier"  v-if="currentPageIsShow">
        <head-title title="拾金不昧审核" />
        <div class="head">
            <div class="status">
                <span>申请状态：</span> 
                <el-select v-model="status" clearable  >
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div>
                <span>类别：</span> 
                <el-select v-model="category" clearable >
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            

            <div>
                <span>信息状态：</span> 
                <el-select v-model="messageStatus" clearable >
                    <el-option
                    v-for="item in messageStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div >
                <span>申请时间：</span>
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
                <span>用户ID: </span>
                <el-input v-model="searchUserId" placeholder="输入用户ID进行搜索" 
                 @input="changeSeID"
                 class="search-value"  clearable></el-input>
            </div>
            <div>
                <span>视频ID: </span>
                <el-input v-model="searchVideoId" placeholder="输入视频ID进行搜索"
                 @input="changeSeID"
                 class="search-value" clearable></el-input>
            </div>

            <div>
                <el-button type="primary" icon="el-icon-search"  @click="queryHandle">查询</el-button>
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
                
                >
                
                <el-table-column
                prop="videoId"
                label="短视频ID"
                width="120">
                </el-table-column>
                <el-table-column
                prop="nickName"
                width='140'
                label="用户名称"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="userId"
                label="用户ID"
                width="120">
                </el-table-column>
                <el-table-column
                prop="categoryName"
                label="类别"
                show-overflow-tooltip
                width="140">
                </el-table-column>
                <el-table-column
                prop="videoTitle"
                label="标题"
                show-overflow-tooltip
                width="140">
                </el-table-column>
               
               
                <el-table-column
                label="申请时间"
                width="180">
                    <template slot-scope="scope">
                        {{changedata(scope.row.createTime)}}
                    </template>
                </el-table-column>
                
                <el-table-column
                label="审核状态"
                width="120">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.checkStatus == 1">待审核</span>
                        <span  v-if="scope.row.checkStatus == 3">已通过</span>
                        <span  v-if="scope.row.checkStatus == 2">未通过</span>
                        <span  v-if="scope.row.checkStatus == 4">阿里云审核中</span>
                    </template>
                </el-table-column>

                <el-table-column
                label="信息状态"
                width="120">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.messageStatus == 2">审核中</span>
                        <span  v-if="scope.row.messageStatus == 3">审核失败</span>
                        <span  v-if="scope.row.messageStatus == 4">发布中</span>
                        <span  v-if="scope.row.messageStatus == 5">已过期</span>
                        <span  v-if="scope.row.messageStatus == 6">已完成</span>
                    </template>
                </el-table-column>
                <el-table-column
                label="处理时间"
                width="180">
                    <template slot-scope="scope">
                        {{ scope.row.processTime && changedata(scope.row.processTime)}}
                    </template>
                </el-table-column>

                <el-table-column
                prop="reason"
                label="处理意见"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>
                <el-table-column
                label="操作"
                fixed="right"
                width="120"
                >
                    <template slot-scope="scope">
                      <el-button class="el-btn-mini" type="primary" size="mini" @click="goLostAndFoundDetails(scope.row)">查看详情</el-button>
                      
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

        </div>
        <router-view />
    </div>
</template>

<script>
import HeadTitle from '../../components/headtitle.vue'
import { getLostFoundList } from '../../api/audity/lostAndFound'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{
            // 当前页面内容在进入子路由后不显示
            currentPageIsShow:true,

            // 申请状态
            status:'',
            statusOptions:[
                {
                    value:'',
                    label:'全部'
                },
                {
                    value:'1',
                    label:'待审核'
                },
                {
                    value:'2',
                    label:'未通过'
                },
                {
                    value:'3',
                    label:'已通过'
                },
            ],
            // 类别
            category:'',
            categoryOptions:[
                {
                    value:'',
                    label:'全部'
                },
                {
                    value:'1',
                    label:'寻人启事'
                },
                {
                    value:'2',
                    label:'寻物启事'
                },
                {
                    value:'3',
                    label:'失物招领'
                },
            ],
            
            // 信息状态
            messageStatus:'',
            messageStatusOptions:[
                {
                    value:'',
                    label:'全部'
                },
                {
                    value:'2',
                    label:'审核中'
                },
                {
                    value:'3',
                    label:'审核失败'
                },
                {
                    value:'4',
                    label:'发布中'
                },
                {
                    value:'5',
                    label:'已过期'
                },
                {
                    value:'6',
                    label:'已完成'
                },
            ],
            // 申请时间
            date:[],
            searchUserId:'',
            searchVideoId:'',
            // 表格数据
            tableData:[],
            total:0,
            params:{
                linit:10,
                page:1
            },
        }
    },
    mounted(){
        this.currentPageHandle()
        if(this.currentPageIsShow){
            this.searchHandle()
        }
    },
    methods:{
        async searchHandle(){
            let params = {
                
                page:this.params.page,
                rows:this.params.linit,
                status:this.status,
                category:this.category,
                messageStatus:this.messageStatus,
                startTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[0] : '',
                endTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[1] : '',
                userId:this.searchUserId,
                videoId:this.searchVideoId
            }
            let res = await getLostFoundList(params)
            
            if(res.code== 0){
                this.total = res.data.total
                this.tableData = res.data.records
                
            }
        },
        currentChange(e){
           
            this.params.page = e
            this.searchHandle()
        },
        sizeChange(e){
            
            this.params.linit = e
            this.searchHandle()
        },
        goLostAndFoundDetails({id}){
            sessionStorage.setItem('lostAndFoundDetailsId',id)
            this.$router.push({name:'lostAndFoundDetails'})
        },
        queryHandle(){
            this.params.page = 1
            this.searchHandle()
        },
        changeSeID(){
            let value = this.searchUserId
            let value1 = this.searchVideoId
            if(value.length ==1){
                this.searchUserId=value.replace(/[^0-9]/g,'')
            }else{
                this.searchUserId=value.replace(/\D/g,'')
            }
            if(value1.length ==1){
                this.searchVideoId=value1.replace(/[^0-9]/g,'')
            }else{
                this.searchVideoId=value1.replace(/\D/g,'')
            }
        },
        currentPageHandle(){
            this.currentPageIsShow = this.$route.path == '/videoManage/lostAndFound'
        }
    },
    watch:{
    //    $route(to,from){
    //        console.log(this.$route);
    //        console.log(to);
    //     //    console.log(from);
    //    }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/audity/recreation.scss';
</style>
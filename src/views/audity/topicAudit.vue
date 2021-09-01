<template>
    <div class="contanier">
        <head-title title="话题审核" />
        <div class="head">
            <div class="status">
                <span>类别：</span> 
                <el-select v-model="category" clearable  placeholder="请选择" >
                    <el-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div >
                <span>状态：</span> 
                <el-select v-model="status" clearable  placeholder="请选择" >
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

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
            <div>
                <span>话题标题：</span>
                <el-input clearable v-model="searchTopicName" placeholder="输入话题标题进行搜索" 
                 class="search-value" ></el-input>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-search"  @click="searchHandle">查询</el-button>
                
                
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
               
                >
                <el-table-column
                prop="startingUser"
                label="用户ID"
                width="150">
                </el-table-column>
                <el-table-column
                prop="nickName"
                width='150'
                label="用户昵称"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="topicName"
                label="话题标题"
                show-overflow-tooltip
                width="150">
                </el-table-column>
                <el-table-column
                label="话题内容"
                width="150">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="lookVideo(scope.row)">点击查看</el-link>
                    </template>
                </el-table-column>
                <el-table-column
                label="话题封面"
                width="180">
                    <template slot-scope="scope">
                        <img class="topic-cover" :src="scope.row.topicCover" >
                    </template>
                </el-table-column>
                <el-table-column
                prop="category"
                label="类别"
                width="150">
                </el-table-column>
                <el-table-column
                label="发布时间"
                show-overflow-tooltip
                width="180">
                    <template slot-scope="scope">
                        {{changedata(scope.row.createTime)}}
                    </template>
                </el-table-column>

                <el-table-column
                label="审核状态"
                width="120">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.status == 0">待审核</span>
                        <span  v-if="scope.row.status == 1">已通过</span>
                        <span  v-if="scope.row.status == 2">未通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="auditReason"
                label="处理意见"
                show-overflow-tooltip
                min-width="120">
                </el-table-column>
                
                <el-table-column
                label="操作"
                fixed="right"
                min-width="120"
                >
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.status == 0" class="el-btn-mini" type="primary" size="mini" 
                      @click="auditOne(scope.row)">审核</el-button>
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
        :page-sizes="[10,20,50,100,1000,5000]"
        :page-size="params.limit"
        :current-page="params.page"
        @current-change="currentChange($event)"
        @size-change="sizeChange($event)"
        ></el-pagination>
        <!-- 弹框 -->
        <el-dialog :title="lookVideoItem.title" :visible.sync="dialogTableVisible" class="mark">
            <video :src="lookVideoItem.videoUrl" muted controls></video>
        </el-dialog>
        
        <!-- 审核弹框 -->
        <el-dialog title="审核" :visible.sync="dialogTableVisibleAudit" class="mark-audit">
            <div class="title">
                审核：
                <el-radio-group v-model="radioAudit" @change="radioHandle">
                    <el-radio label="1">通过</el-radio>
                    <el-radio label="2">不通过</el-radio>
                </el-radio-group>
            </div>
            <div class="body" v-if="radioAudit == 2">
                <el-select size="mini" v-model="rejectB.value" placeholder="请选择原因" @change="auditSelectChange">
                    <el-option
                    v-for="item in rejectB.options"
                    :key="item.value"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div v-if="rejectB.value == '自定义'" class="text">
                    <el-input
                    type="textarea"
                    placeholder="请输入拒绝原因"
                    v-model="rejectB.textarea">
                    </el-input>
                </div>
            </div>

            <div class="foot">
                <el-button type="primary" size="small" @click="comitAudit">确认</el-button>
                <el-button type="info" size="small" @click="cancleHandle">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { topicAuditAPI,topicAuditListAPI } from '../../api/audity/topicAudit'
import HeadTitle from '../../components/headtitle.vue'
export default {
    components:{
        HeadTitle
    },
    name:'Recreation',
    data(){
        return{
            // 视频类别
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
                 {
                    label:'找车',
                    value:'23'
                },
                 {
                    label:'景点',
                    value:'22'
                },
                 {
                    label:'酒店',
                    value:'21'
                },
                 {
                    label:'美食',
                    value:'20'
                },
                 {
                    label:'房产',
                    value:'2'
                },
                 {
                    label:'娱乐',
                    value:'4'
                },
            ],
            // 视频状态
            status:'', // 0.待审核   1.已通过 2.已拒绝  
            statusOptions:[
                 {
                    label:'全部',
                    value:''
                },
                 {
                    label:'待审核',
                    value:'0'
                },
                 {
                    label:'已通过',
                    value:'1'
                },
                 {
                    label:'未通过',
                    value:'2'
                },
            ],
            // 时间
            date:[],
            // 搜索关键字
            searchUserId:'',
            searchTopicName:'',
            // 表格数据
            tableData:[ ],
            total:0,
            params:{
                linit:10,
                page:1
            },
            dialogTableVisible:false,
            // 审核弹框控制
            dialogTableVisibleAudit:false,
            auditItem:null,
            radioAudit:'1', // 1.通过  2.不通过
            rejectB:{
                value:'画面不清晰',
                options:[
                    {
                        value:'画面不清晰',
                    },
                    {
                        value:'含有第三方logo',
                    },
                    {
                        value:'低俗色情',
                    },
                    {
                        value:'血腥恐怖暴力',
                    },
                    {
                        value:'违反国家法律法规',
                    },
                    {
                        value:'含有敏感信息',
                    },
                    {
                        value:'抄袭',
                    },
                    {
                        value:'其它',
                    },
                    // {
                    //     value:'自定义',
                    // },
                ],
                textarea:'' // 自定义拒绝原因
            },
            // 查看视频
            lookVideoItem:{
                title:'',
                videoUrl:''
            },
        }
    },
   
    mounted(){
        this.getData()
    },
    methods:{
        // 获取话题列表
        async getData(){
            let params = {
                category:this.category,
                status:this.status,
                userId:this.searchUserId,
                startTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[0] + ' 00:00:00' : '',
                endTime:( Array.isArray(this.date) && this.date.length > 0 ) ? this.date[1] + ' 00:00:00': '',
                userId:this.searchUserId,
                topicName:this.searchTopicName,
                page:this.params.page,
                rows:this.params.linit
            }
            let res = await topicAuditListAPI(params)
            
            if(res.code == 0){
                res.data.records.forEach(e=>{
                    e.createTime && (e.createTime = this.changedata(e.createTime))
                })
                this.tableData = res.data.records
                this.total = res.data.total
            }
            
        },

       
        currentChange(e){
            this.params.page = e
            this.getData()
        },
        sizeChange(e){
            this.params.linit = e
            this.getData()
        },
        // 查看视频
        lookVideo(item){
            
            this.lookVideoItem = item
            this.dialogTableVisible = true
        },
       
        /*-------------------------------------------------------------------*/
        // 单独一个审核,打开审核弹框
        auditOne(item){
            
            this.radioAudit = '1'
            this.rejectB.value = '画面不清晰'
            this.rejectB.textarea = ''
            this.dialogTableVisibleAudit = true
            this.auditItem = item
        },
        // 单选改变时触发
        radioHandle(){
           
        },
        //  下拉框改变时
        auditSelectChange(){
            
        },
        // 关闭审核弹窗
        cancleHandle(){
            this.dialogTableVisibleAudit = false
        },
        // 提交审核
        async comitAudit(){
            
            let params = {
                reason: this.radioAudit == '1'? '' : this.rejectB.value == '自定义' ? this.rejectB.textarea : this.rejectB.value,
                status:this.radioAudit,
                id:this.auditItem.id
            }
            let res = await topicAuditAPI(params)
            
            if(res.code == 0){
                this.cancleHandle()
                this.getData()
                this.Success('审核完成')
            }
        },
        /*-------------------------------------------------------------------*/

        // 查询
        async searchHandle(){
            this.params.page = 1
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
        padding: 10px 0;
        &>div{
            margin: 0 10px;
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
            width: 175 clearablepx;
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
    .mark{
        ::v-deep.el-dialog__header span{
            display: inline-block;
            width: 400px;
            overflow: hidden;
        }
        video{
            display: block;
            width: 900px;
            height: 500px;
            margin: 0 auto;
        }
    }
    .mark-audit{
        ::v-deep.el-dialog{
            width: 500px;
        }
        ::v-deep.el-dialog__body{
            position: relative;
            height: 350px;
        }
        .title{
            text-align: center;
        }
        .body{
            text-align: center;
            padding-top: 10px;
            .text{
                width: 300px;
                
                margin: 10px auto;
                ::v-deep textarea{
                    height: 180px;
                    resize: none;
                }
            }

        }
        .foot{
            position: absolute;
            bottom: 0;
            left: 0;
            margin: 20px;
            width: 100%;
            text-align: center;
        }
    }
}
</style>
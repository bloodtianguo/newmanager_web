<template>
    <div class="inform-container">
        <head-title :title="'举报审核'" />

        <div class="head">
            <div>
                <span>举报来源：</span> 
                <el-select v-model="informOrigin" clearable >
                    <el-option
                    v-for="item in informOriginOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>举报状态：</span> 
                <el-select v-model="informStatus" clearable >
                    <el-option
                    v-for="item in informStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            
            <div>
                <span>举报ID: </span>
                <el-input v-model="searchId" placeholder="输入举报ID"
                 @input="changeSeID"
                 class="search-value" clearable></el-input>
            </div>
            <div>
                <span>被举报ID: </span>
                <el-input v-model="searchReportedId" placeholder="输入被举报ID"
                 @input="changeSeID"
                 class="search-value" clearable></el-input>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-search"  @click="getData">查询</el-button>
            </div>
        </div>

        <!-- 表格 -->
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                height="591"
                cell-class-name="t-cell"
                header-cell-class-name="t-cell h-cell"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                v-loading="loading"
                element-loading-text="数据加载中"
                >
                
                <el-table-column
                prop="nickName"
                label="举报人昵称"
                show-overflow-tooltip
                >
                </el-table-column>
                 <el-table-column
                prop="userId"
                label="举报人ID"
                >
                </el-table-column>
                <el-table-column
                prop="objId"
                label="被举报ID"
                >
                </el-table-column>
                <el-table-column
                prop="informOrigin"
                label="举报来源"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="createTimeFormat"
                label="举报时间"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="reportReason"
                label="举报理由"
                >
                </el-table-column>
                <el-table-column
                prop="statusFormat"
                label="状态"
                >
                </el-table-column>
                <el-table-column
                prop="handleSuggest"
                label="处理意见"
                show-overflow-tooltip
                >
                </el-table-column>

                </el-table-column>
                <el-table-column
                prop="enterTime"
                label="举报内容"
                >
                    <template slot-scope="scope" >
                        <el-link type="primary" :underline="false" @click="openDetailsDailog(scope.row.id)">点击查看</el-link>
                    </template>
                </el-table-column>

                </el-table-column>
                <el-table-column
                label="操作"
                fixed="right"
                >
                    <template slot-scope="scope">
                      <el-button  class="el-btn-mini" type="primary" size="mini" 
                      v-if="scope.row.status == 0"
                      @click="openAuditDialog(scope.row)">审核</el-button>
                      <span style="height:28px;display:block;" v-else>--</span>
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

        <!-- 举报内容弹框 -->
        <el-dialog
        title="举报详情"
        :visible.sync="dialogVisible"
        width="500px"
        class=""
        >
            <div class="content">
                <div>
                    <span>举报人ID：</span>
                    <el-input :value="userId" readonly />
                </div>
                <div>
                    <span>举报内容：</span>
                    <el-input :value="content" readonly />
                </div>
                <div>
                    <span :class="{'pic-text':pics.length>0}">举报图片:</span>
                    <div class="pics">
                        <img v-for="(i,idx) in pics" :src="i" :key="idx" @click="openInnerDailog(idx)">
                    </div>
                </div>
                <div>
                    <span>被举报ID：</span>
                    <el-input :value="reportedId" readonly />
                </div>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            <!-- 内层弹框 -->
            <el-dialog
            class="inner"
            width="30%"
            title="图片"
            :visible.sync="innerVisible"
            append-to-body>
                <img :src="src" >
            </el-dialog>
        </el-dialog>

        <!-- 审核弹框 -->
        <el-dialog title="审核" :visible.sync="auditDialog" width="500px">
            <div class="audit-conten">
                <el-radio v-model="radio" label="1">有效举报且反馈举报人</el-radio>
                <el-radio v-model="radio" label="2">无效举报</el-radio>
                <el-select v-model="feedback" placeholder="请选择" size="mini" width="250px" v-if="radio == '1'">
                    <el-option
                    v-for="item in feedbackOptions"
                    :key="item.value"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                v-if="radio == '1'"
                type="textarea"
                resize="none"
                :maxlength="100"
                show-word-limit
                :rows="4"
                placeholder="请输入100字内的反馈"
                v-model="textarea">
                </el-input>
                <div v-if="type == '1' && radio == '1'" style="margin:10px 0 0 0">
                    <span style="margin-right:10px">对被举报人惩罚</span>
                    <el-select v-model="penalty" placeholder="请选择" size="mini" width="250px" >
                        <el-option
                        v-for="item in penaltyOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="auditDialog = false">取 消</el-button>
                <el-button type="primary" @click="auditHandle">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { informListAPI,informDetailsAPI,auditReportAPI } from '@/api/audity/inform'
import HeadTitle from '@/components/headtitle.vue'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{

            tableData:[],
            loading:false,
            informOrigin:'', // 举报来源 0-视频 1-个人 2-评论 3-话题 4-聊天 5-店铺 6-直播
            informOriginOptions:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'短视频',
                    value:'0'
                },
                {
                    label:'用户',
                    value:'1'
                },
                {
                    label:'评论',
                    value:'2'
                },
                {
                    label:'话题',
                    value:'3'
                },
                {
                    label:'聊天',
                    value:'4'
                },
                {
                    label:'店铺',
                    value:'5'
                },
                {
                    label:'直播间',
                    value:'6'
                },
            ],
            informStatus:'', // 举报状态 : 0未处理 1有效举报 2无效举报
            informStatusOptions:[
                {
                    label:'全部',
                    value:''
                },
                {
                    label:'未处理',
                    value:'0'
                },
                {
                    label:'有效举报',
                    value:'1'
                },
                {
                    label:'无效举报',
                    value:'2'
                },
            ],
            searchId:'', // 举报ID
            searchReportedId:'',// 被举报人ID
            // 分页
            total:0,
            params:{
                linit:10,
                page:1
            },

            // 表格
            tableData:[],
            multipleSelection: [],

            // 举报弹框
            dialogVisible:false,
            userId:'', // 举报人id
            content:'', // 举报内容
            reportedId:'', // 被举报id
            pics:[], // 举报截图
            // 内层弹框
            innerVisible:false,
            src:'',// 内层弹框中img的src

            // 审核弹窗
            auditDialog:false,
            radio:'1',
            feedback:'违反国家法律法规', // 有效举报反馈
            feedbackOptions:[
                {
                    value:'违反国家法律法规'
                },
                {
                    value:'低俗色情'
                },
                {
                    value:'含有敏感信息'
                },
                {
                    value:'违反公序良俗、社会价值观'
                },
                {
                    value:'出现危险行为和危险动作'
                },
                {
                    value:'泄露和曝光个人隐私或个人信息'
                },
                {
                    value:'其它'
                },
            ],
            textarea:'', 
            type:'', // 举报来源
            penalty:7, // 对被举报人惩罚
            penaltyOptions:[
                {
                    label:'禁用7天',
                    value:7
                },
                {
                    label:'禁用14天',
                    value:14
                },
                {
                    label:'禁用30天',
                    value:30
                },
                {
                    label:'禁用6个月',
                    value:180
                },
                {
                    label:'永久禁用',
                    value:99999
                },
            ],
            item:{}, // 当前审核弹框所审核的项
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
                reportedId:this.searchReportedId,
                userId:this.searchId,
                status:this.informStatus,
                type:this.informOrigin
            }
            let res
            try {
                res = await informListAPI(params)
            } catch (error) {
                console.log(error);
            }
            if(res.code == 0){
                this.total = res.data.total
                res.data.records.forEach(e=>{
                    for (const item of this.informOriginOptions) {
                        if(item.value != '' && item.value == e.type){
                            e.informOrigin = item.label
                            break
                        }
                    }
                    e.createTimeFormat = this.changedata( e.createTime)
                    e.statusFormat = e.status == 0 ? '待审核' :e.status == 1 ? '已通过' :'未通过'
                })
            
                this.tableData = res.data.records

            } 
        },


        // 打开详情弹框
        async openDetailsDailog(id){
            let res = await informDetailsAPI({id})
            if(res.code==0){
                this.userId = res.data.user_id
                this.content = res.data.content
                this.pics = res.data.pics ? res.data.pics : []
                this.reportedId = res.data.reportedId
            }

            this.dialogVisible = true
        },

        // 打开内层弹框
        openInnerDailog(idx){
            this.src = this.pics[idx]
            this.innerVisible = true
        },

        // 打开审核弹窗
        openAuditDialog(data){
            console.log(data);
            this.auditDialog = true
            this.radio = '1',
            this.feedback = '违反国家法律法规'
            this.textarea = ''
            this.penalty = 7
            this.type = data.type
            this.item = data
        },

        // 审核接口操作
        async auditHandle(){
            let params = {
                banDay:this.radio == '2' || this.type!= 1 ? 0 : this.penalty,
                userId:this.item.userId,
                reportedId:this.item.objId,
                suggest:this.radio == '2' ? '' : this.feedback,
                id:this.item.id,
                type:this.item.type,
                reason:this.textarea
            }
            
            let res = await auditReportAPI(params)
            
            if(res.code == 0){
                this.auditDialog = false
                this.Success('操作成功')
                this.getData()
            }else{
                this.Warning(res.msg)
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

        

        changeSeID(){
            let value = this.searchId
            let value1 = this.searchReportedId
            if(value.length ==1){
                this.searchId=value.replace(/[^0-9]/g,'')
            }else{
                this.searchId=value.replace(/\D/g,'')
            }
            if(value1.length ==1){
                this.searchReportedId=value1.replace(/[^0-9]/g,'')
            }else{
                this.searchReportedId=value1.replace(/\D/g,'')
            }
        },

       

        

        
    }
}
</script>
<style lang="scss" scoped>
.inform-container{
    padding: 10px 20px 20px 20px;
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
    ::v-deep.el-dialog{
        .content{
            &>div{
                display: flex;
                justify-content:center;
                align-items: center;
                margin: 3px 0;
                min-height: 40px;
                .pics,
                .el-input{
                    width: 300px;
                }
                .pic-text{
                    align-self: flex-start;
                }
                .pics{
                    margin-left: 10px;
                }
                img{
                    width: 50px;
                    vertical-align: top;
                    margin-right: 2px;
                }
            }
        }
       
    }

    .audit-conten{
        height: 200px;
        .el-radio{
            display: block;
            margin-bottom: 10px;
        }
        .el-select{
            min-width: 250px;
            margin-bottom: 10px;
        }
       
    }


}
 ::v-deep.inner{
            img{
                display: block;
                margin: 0 auto;
                max-width: 300px;
            }
        }
</style>
<template>
<div>
    
    <div class="lost-and-found-details" v-if="currentPageIsShow">
        <head-title title="拾金不昧详情" />
        <div class="topbody">
            <div class="title">
                基本信息
            </div>
            <table v-if="details">
                <tr>
                    <td>用户昵称</td>
                    <td>{{details.nickName}}</td>
                    <td>用户id</td>
                    <td>{{details.userId}}</td>
                </tr>
                <tr>
                    <td>用户类型</td>
                    <td>{{details.userType}}</td>
                    <td>启事类型</td>
                    <td>{{details.category == 1 ? '寻人启事' : details.category == 2 ? '寻物启事' :'招领启事'}}</td>
                </tr>
                <tr>
                    <td>审核状态</td>
                    <td>
                        <span v-if="details.checkStatus == 1">待审核</span>
                        <span v-if="details.checkStatus == 2">未通过 {{details.remark}}</span>
                        <span v-if="details.checkStatus == 3">已通过</span>
                        <span v-if="details.checkStatus == 4">阿里云审核中</span>
                    </td>
                    <td>提交时间</td>
                    <td>{{details.createTime }}</td>
                    
                    
                </tr>
                <tr v-if="details.processTime">
                    <td>处理时间</td>
                    <td>{{details.processTime }}</td>
                </tr>
            </table>

            <div class="title">
                启事信息
            </div>
            <table v-if="details">
                <tr>
                    <td>类型</td>
                    <td>{{details.type}}</td>
                    <td>标题</td>
                    <td>{{details.videoTitle}}</td>
                </tr>
                <tr>
                    <td>日期</td>
                    <td>{{details.createTime.substr(0,11)}}</td>
                    <td>地区</td>
                    <td>{{details.cityName}}</td>
                </tr>
                <tr>
                    <td>地点</td>
                    <td> {{details.addressDetails}}</td>
                    <td>联系人</td>
                    <td>{{details.contactPerson }}</td>
                </tr>
                <tr>
                    <td>联系微信号</td>
                    <td> {{details.wechatNum}}</td>
                    <td>详情描述</td>
                    <td>
                        <!-- {{details.describeDetails }} -->
                        <span class="look" @click="openDailog('详情描述')">[查看]</span> 
                    </td>
                </tr>
                <tr>
                    <td>物品图片</td>
                    <td> 
                        <!-- {{details.pics}} -->
                         <span class="look" @click="openDailog('查看图片')">[查看]</span> 
                    </td>
                    <td>信息有效期至</td>
                    <td>{{details.expireTime }}</td>
                </tr>
            </table>

            <div class="title">
                视频信息
            </div>
            <table v-if="details">
                <tr>
                    <td>视频id</td>
                    <td>{{details.videoId}}</td>
                    <td>视频状态</td>
                    <td>
                        <span v-if="details.checkStatus == 1">待审核</span>
                        <span v-if="details.checkStatus == 2">未通过</span>
                        <span v-if="details.checkStatus == 3">已通过</span>
                        <span v-if="details.checkStatus == 4">阿里云审核中</span>
                    </td>
                </tr>
                <tr>
                    <td>视频标题</td>
                    <td>{{details.videoTitle}}</td>
                    <td>参与话题</td>
                    <td>{{details.topics}}</td>
                </tr>
                <tr>
                    <td>视频详情</td>
                    <td>
                         <!-- {{details.videoUrl}} -->
                        <span class="look" @click="openDailog('播放视频')">[查看]</span> 
                    </td>
                    
                </tr>
               
            </table>
        </div>


        <!-- 申请记录 -->
        <div class="content">
            <div class="title">
                申请记录
            </div>
            
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                
                border
                cell-class-name="t-cell"
                header-cell-class-name="t-cell"
                :header-cell-style="{background:'#f2f2f2',fontWeight:600,color:'#333'}"
                size="small"
                >
                
                <el-table-column
                prop="createTime"
                label="申请时间"
                >
                </el-table-column>
                <el-table-column
                prop="type"
                label="类别"
                >
                </el-table-column>
                <el-table-column
                label="申请结果"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.checkStatus == 1">待审核</span>
                        <span v-if="scope.row.checkStatus == 2">未通过 {{scope.row.remark}}</span>
                        <span v-if="scope.row.checkStatus == 3">已通过</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="processTime"
                label="处理时间"
                >
                </el-table-column>
                <el-table-column
                label="操作"
                fixed="right"
                
                >
                    <template slot-scope="scope">
                      <el-button class="el-btn-mini" type="primary" size="mini" @click="applicationRecord(scope.row.id)">查看详情</el-button>
                      
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="foot" v-if="details && details.checkStatus == 1">
            <el-button type="primary" @click="passAudit('3')">同意</el-button>
            <el-button type="danger" @click="passAudit('2')">拒绝</el-button>
        </div>

        <!-- 弹框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" class="mark" :class="{smallmark:dialogTitle == '详情描述'||dialogTitle == '拒绝原因'}" >
            <div v-if="dialogTitle == '详情描述'">
                <el-input
                type="textarea"
                :rows="2"
                readonly
                :value="details.describeDetails">
                </el-input>
            </div>
            <div v-if="dialogTitle == '查看图片'">
                <img v-for="(item,i) in details.pics" :src="item" >
            </div>
            <div v-if="dialogTitle == '播放视频'">
                <video :src="details.videoUrl" muted controls></video>
            </div>
            <div v-if="dialogTitle == '拒绝原因'" style="text-align: center;">
                <el-select v-model="rejectB" size="small">
                    <el-option
                    v-for="item in rejectBOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                v-if="rejectB=='自定义'"
                type="textarea"
                maxlength="100"
                show-word-limit
                v-model="customRejectB">
                </el-input>
                <div>
                    <el-button style="margin-top:10px" type="primary" size="mini" @click="comitAudit('2')">确定</el-button>

                </div>
            </div>
        </el-dialog>
    </div>
    <router-view />
</div>
</template>


<script>
import HeadTitle from '../../components/headtitle.vue'
import { getDetailsById, getFoundHistory , foundAudit } from '../../api/audity/lostAndFound'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{
            // 当前页面内容在进入子路由后不显示
            currentPageIsShow:true,
            tableData: [],
            details:null,
            dialogTableVisible:false,
            dialogTitle:'',
            rejectB:'视频内容不能含有个人联系方式', // 拒绝原因
            rejectBOptions:[
                {
                    value:'视频内容不能含有个人联系方式'
                },
                {
                    value:'视频内容不能涉及隐私内容'
                },
                {
                    value:'视频发布类型不符'
                },
                {
                    value:'失物类型和视频不符'
                },
                {
                    value:'地址描述不够详细'
                },
                {
                    value:'自定义'
                },
            ],
            customRejectB:'',  // 自定义拒绝原因
        }
    },
    mounted(){
        this.currentPageHandle()
        if(this.currentPageIsShow){
            this.getDetails()
        }
    },
    methods:{
        async getDetails(){
            let id = sessionStorage.getItem('lostAndFoundDetailsId')
            let res = await getDetailsById({id})
            
            if(res.code == 0){
                
                res.data.createTime && ( res.data.createTime = this.changedata(res.data.createTime))
                res.data.processTime && ( res.data.processTime = this.changedata(res.data.processTime))
                this.details = res.data
                
            }
            let result = await getFoundHistory({id})
            
            if(result.code == 0){
                result.data.forEach(e=>{
                  e.createTime &&  (e.createTime = this.changedata(e.createTime))
                  e.processTime &&  (e.processTime = this.changedata(e.processTime))
                  e.updateTime &&  (e.updateTime = this.changedata(e.updateTime))
                })
                this.tableData = result.data
                
            }
        },
        openDailog(title){
            this.dialogTitle = title
            this.dialogTableVisible = true
        },
        
        passAudit(status){
            if(status == '2'){
                this.dialogTableVisible = true
                this.dialogTitle = '拒绝原因'
                this.rejectB = '视频内容不能含有个人联系方式',
                this.customRejectB = ''
            }else{
                this.comitAudit(status)
            }
        },
        async comitAudit(status){
            let params = {
                id:this.details.id,
                reason: status == '3' ? '' : this.rejectB != '自定义' ? this.rejectB : this.customRejectB,
                status
            }
            let res
            try {
                res = await foundAudit(params)
            } catch (error) {
                return
            }
            if(res.code == 0){
                this.getDetails()
                this.Success('提交成功')
            }
            this.dialogTableVisible = false
        },
        // 申请记录
        applicationRecord(id){

            
            this.$router.push({name:'lostAndFoundHistory',query:{id}})
        },

        currentPageHandle(){
            this.currentPageIsShow = this.$route.path == '/videoManage/lostAndFound/lostAndFoundDetails'
        }
    },
   
}
</script>
<style lang="scss" scoped>
.lost-and-found-details{
    padding: 10px 20px 20px 20px;
    .title{
        height: 43px;
        line-height: 43px;
        border-bottom: 1px solid #EBEEF5;
    }
    .topbody{
        td{
            border: 1px solid #e6e6e6;
            padding: 9px 15px;
            color: #666;
            &:nth-child(odd){
                width: 15%;
                font-weight: 600;
            }
            &:nth-child(even){
                width: 35%;
            }
        }
        table{
            margin: 10px 0;
            width: 100%;
        }
        tr{
            transition: all .3s;

        }
        tr:hover{
            background: #f2f2f2;
        }
        .look{
            color: red;
            cursor: pointer;
        }
    }
    .content{
        ::v-deep.t-cell{
            text-align: center;
        }
    }
    .foot{
        margin: 15px 0;
        text-align: center;
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
        ::v-deep.el-textarea__inner{
            width: 400px;
            height: 100px;
            margin: 10px auto;
            resize: none;
        }
        img{
            max-width: 200px;
        }
        ::v-deep.el-input--suffix .el-input__inner{
            width: 300px;
        }
    }
    .smallmark{
        ::v-deep.el-dialog{
            width: 500px;
        }
    }
}
</style>
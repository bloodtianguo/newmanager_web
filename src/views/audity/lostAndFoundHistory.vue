<template>
    <div class="lost-and-found-details">
        <head-title title="申请历史记录" />
        <div class="topbody">
            <div class="title">
                基本信息
            </div>
            <table v-if="details">
               
                <tr>
                    
                    <td>启事类型</td>
                    <td>{{details.category == 1 ? '寻人启事' : details.category == 2 ? '寻物启事' :'招领启事'}}</td>

                    
                    <td>提交时间</td>
                    <td>{{details.createTime }}</td>
                    
                </tr>
                <tr>
                    <td>审核状态</td>
                    <td>
                        <span v-if="details.checkStatus == 1">待审核</span>
                        <span v-if="details.checkStatus == 2">未通过 {{details.remark}}</span>
                        <span v-if="details.checkStatus == 3">已通过</span>
                        <span v-if="details.checkStatus == 4">阿里云审核中</span>
                    </td>
                    
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


       

        <!-- 弹框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" class="mark" :class="{smallmark:dialogTitle == '详情描述'||dialogTitle == '拒绝原因'}">
            <div v-if="dialogTitle == '详情描述'">
                <el-input
                type="textarea"
                :rows="2"
                readonly
                :value="details.describeDetails">
                </el-input>
            </div>
            <div v-if="dialogTitle == '查看图片'">
                <img v-for="(item,i) in details.pictureUrl.split(',')" :src="item" >
            </div>
            <div v-if="dialogTitle == '播放视频'">
                <video :src="details.videoUrl" muted controls></video>
            </div>
            
          
        </el-dialog>
    </div>
</template>


<script>
import HeadTitle from '../../components/headtitle.vue'
import { getHistoryDetails } from '../../api/audity/lostAndFound'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{
            details:null,
            dialogTitle:'',
            dialogTableVisible:false,
        }
    },
    mounted(){
        
        this.getHistoryDetails()
    },
    methods:{
        // 获取申请记录详情
        async getHistoryDetails(){
            let res = await getHistoryDetails({id:this.$route.query.id})
            
            if(res.code ==0){
                res.data.createTime && ( res.data.createTime = this.changedata(res.data.createTime))
                res.data.processTime && ( res.data.processTime = this.changedata(res.data.processTime))
                this.details = res.data
            }
        },
        openDailog(title){
            this.dialogTitle = title
            this.dialogTableVisible = true
        },
    } 
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
    }
    .smallmark{
        ::v-deep.el-dialog{
            width: 500px;
        }
    }
}
</style>
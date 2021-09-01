<template>
    <div class="video-details">
        <head-title title="视频详情" />
        <div class="content">
            <div class="title">基本信息</div>
            <div class="title basc" v-if="videoInfo">
                <span>视频ID：{{videoInfo.videoId}}</span>
                <span>视频状态：{{videoInfo.status == 0 ? '上架中' : videoInfo.status == 1?'已下架':''}}</span>
                <span>用户ID: {{videoInfo.userId}}</span>
                <span>用户昵称: {{videoInfo.nickName}}</span>
                <span>视频发布时间: {{ changedata(videoInfo.createTime)}}</span>
            </div>
            <div class="title">视频信息</div>
            <table v-if="videoInfo">
                <tr>
                    <td>视频封面</td>
                    <td>
                        <video :src="videoInfo.videoUrl" muted controls></video>
                    </td>
                    <td>视频标题</td>
                    <td>{{videoInfo.title}}</td>
                    <td>参与话题</td>
                    <td>{{videoInfo.topics}}</td>
                </tr>
                <tr>
                    <td>短视频类别</td>
                    <td>{{videoInfo.name}}</td>
                    <td>子类别</td>
                    <td>{{videoInfo.sonType}}</td>
                    <td>视频定位</td>
                    <td>{{videoInfo.city}}</td>
                </tr>
                <tr>
                    <td>点赞数</td>
                    <td>{{videoInfo.likeNum}}</td>
                    <td>评论数</td>
                    <td>
                        <div  class="info">
                            <span>{{videoInfo.commentNum}}</span>
                            <el-link type="primary" :underline="false" >[详情]</el-link>
                        </div>
                        
                    </td>
                    <td>播放数</td>
                    <td>{{videoInfo.playNum}}</td>
                </tr>
                <tr>
                    <td>打赏数</td>
                    <td >
                        <div class="info">
                            <span>{{videoInfo.reward ? videoInfo.reward : '暂无打赏'}}</span>
                            <el-link type="primary" :underline="false" v-if="videoInfo.reward > 0" >[详情]</el-link>
                        </div>
                    </td>
                    <td>分享数</td>
                    <td>{{videoInfo.shareNum}}</td>
                    <td>内容得分</td>
                    <td >
                        <div class="info">
                            <span>{{videoInfo.score}}</span>
                            <el-link type="primary" :underline="false" @click="openDialog">[详情]</el-link>

                        </div>
                    </td>
                </tr>
                <tr>
                    <td>被举报次数</td>
                    <td >
                        <div class="info">
                            <span>{{videoInfo.reportNum}}</span>
                            <el-link type="primary" :underline="false"  @click="openReportDialog">[详情]</el-link>

                        </div>
                    </td>
                    <td>绑定店铺ID</td>
                    <td>{{videoInfo.shopId}}</td>
                    <td>是否为官宣视频</td>
                    <td>{{videoInfo.isnot}}</td>
                </tr>
                <tr>
                    <td>官宣城市</td>
                    <td>{{videoInfo.cityName}}</td>
                    <td>启事信息</td>
                    <td v-if="videoInfo.isLost == 0">--</td>
                    <td v-if="videoInfo.isLost == 1" style="text-align:right;">
                        <el-link type="primary" :underline="false"  @click="openLostDialog">[查看详情]</el-link>
                    </td>
                    <td v-if="!foundInfo">视频标签</td>
                    <td v-if="!foundInfo">{{videoInfo.tags}}</td>
                </tr>
            </table>
        </div>

        <!-- 修改弹窗 -->
        <el-dialog :title="'信息'" :visible.sync="editScoreDialog" destroy-on-close class="revocation-mark">
            <div class="title">目前内容得分：{{videoInfo && videoInfo.score}}</div>
            <div class="score">
                请输入您修改的分数
                <el-input v-model="editScore" size="mini"> </el-input>
            </div>
            <div class="foot">
                <el-button type="primary" size="small" @click="submitRevocation">确定</el-button>
                <el-button plain size="small" @click="editScoreDialog = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 举报弹窗 -->
        <el-dialog :title="'信息'" :visible.sync="reportDialog" destroy-on-close class="report-dialog">
            <div class="table">
                <el-table
                :data="tableData"
                border
                size="small"
                height="450"
                tooltip-effect="dark"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="举报编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="nickName"
                        label="举报人名称"
                        show-overflow-tooltip
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="userId"
                        label="举报人ID">
                    </el-table-column>
                    <el-table-column
                        prop="createTimeKey"
                        show-overflow-tooltip
                        label="举报时间">
                    </el-table-column>
                    <el-table-column
                        prop="objId"
                        label="短视频ID">
                    </el-table-column>
                    <el-table-column
                        prop="reportReason"
                        show-overflow-tooltip
                        label="举报理由">
                    </el-table-column>

                </el-table>

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
            <div class="foot">
                <el-button plain size="small" @click="reportDialog = false">确定</el-button>
            </div>
        </el-dialog>

        <!-- 启事信息弹框 -->
        <el-dialog :title="'信息'" :visible.sync="lostDialog" destroy-on-close class="report-dialog">
            <div class="table content">
                <table v-if="foundInfo">
                    <tr>
                        <td>类型：</td>
                        <td>{{foundInfo.lowerContent}}</td>
                    </tr>
                    <tr>
                        <td>有效期：</td>
                        <td>{{foundInfo.endDate}}</td>
                    </tr>
                    <tr>
                        <td>日期：</td>
                        <td>{{foundInfo.startDate}}</td>
                    </tr>
                    <tr>
                        <td>地区：</td>
                        <td>{{foundInfo.countyName}}</td>
                    </tr>
                    <tr>
                        <td>地点：</td>
                        <td>{{foundInfo.addressDetails}}</td>
                    </tr>
                    <tr>
                        <td>联系描述：</td>
                        <td>{{foundInfo.describeDetails}}</td>
                    </tr>
                    <tr>
                        <td>物品图片：</td>
                        <td>
                            <div v-if="foundInfo.pictures">
                                <img class="td-img" v-for="(item,idx) in foundInfo.pictures" :key="idx" :src="item" >
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="foot">
                <el-button plain size="small" @click="lostDialog = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import HeadTitle from '../../components/headtitle.vue'
import { detailsAPI, updateScoreAPI,reportDetailAPI } from '../../api/content/videoDetails'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{
            videoInfo:null,
            editScoreDialog:false,
            editScore:0,
            // 举报弹窗
            reportDialog:false,
            total:0,
            params:{
                linit:10,
                page:1
            },
            tableData:[],
            // 启事信息弹框
            lostDialog:false,
            foundInfo:{}, 
        }
    },
    mounted(){
        this.getData()
        this.getReportData()
        
    },
    methods:{
        async getData(){
           let res = await detailsAPI(this.$route.query) 
           
           if(res.code == 0){
               this.videoInfo = res.data.videoInfo
               this.foundInfo = res.data.foundInfo
           }
        },
        async submitRevocation(){
            let params = {
                score:this.editScore,
                videoId:this.videoInfo.videoId
            }
            let res = await updateScoreAPI(params)
            if(res.code == 0){
                this.editScoreDialog = false
                this.Success('修改完成')
                this.getData()
            }
        },
        openDialog(){
            this.editScoreDialog = true
            this.editScore = this.videoInfo.score
        },
        // 打开举报弹窗
        openReportDialog(){
            this.reportDialog = true
            
        },
        // 获取举报数据
        async getReportData(){
            let params = {
                page:1,
                rows:10,
                videoId:this.$route.query.videoId
            }
            let res = await reportDetailAPI(params)
            
            if(res.code == 0){
                this.total = res.data.total
                res.data.records.forEach(e=>{
                    e.createTime && (e.createTimeKey = this.changedata(e.createTime) )
                })
                this.tableData = res.data.records
            }
        },

        currentChange(e){
            this.params.page = e
            this.getReportData()
        },
        sizeChange(e){
            this.params.linit = e
            this.getReportData()
        },


        // 打开启事信息弹框
        openLostDialog(){
            this.lostDialog = true
        }
    }
}
</script>

<style lang="scss" scoped>
.video-details{
    padding: 10px 20px 20px 20px;
     .content{
        .title{
            padding-left: 20px;
            height: 43px;
            line-height: 43px;
            border-bottom: 1px solid #EBEEF5;
        }
        .title.basc{
            span{
                margin-right: 50px;
                color: #333;
                font-size: 14px;
            }
        }
        td{
            border: 1px solid #e6e6e6;
            padding: 9px 15px;
            color: #666;
            
            video{
                width: 168px;
                height: 300px;
            }
        }
        .info{
            display: flex;
            justify-content: space-between;
        }
        table{
            margin: 10px 0;
            width: 100%;
            border-collapse: collapse;
        }
        tr{
            transition: all .3s;
            td:nth-child(2){
                max-width: 100px;
            }
        }
        tr:hover{
            background: #f2f2f2;
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
            
            .score{
                .el-input{
                    display: inline-block;
                    width: 200px;
                }
            }

           

            .foot{
                margin-top: 10px;
                text-align: right;
            }
        }
    }
    .report-dialog{
        ::v-deep.el-dialog{
            .el-dialog__body{
                padding: 10px;
            }
        }
        .table{
            height: 500px;
            overflow-y: auto;
        }
        .foot{
            margin-top: 10px;
            text-align: center;
        }
    }
    .td-img{
        max-width: 100px;
    }

}
</style>
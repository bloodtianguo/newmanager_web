<template>
    <div>
        <selectexeport
        :filetext="filetext"
        :filename="filename"
        :multipleSelection="multipleSelection"
        :tHeader="tHeader"
        :filterVal="filterVal"
        />

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
                <el-button type="primary" icon="el-icon-search"  @click="searchHandle">查询</el-button>
                <el-button  @click="resetSearch">重置</el-button>
            </div>
        </div>

        <!-- 表格 -->
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;"
                height="541"
                border
                cell-class-name="t-cell"
                header-cell-class-name="t-cell h-cell"
                :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
                v-loading="loading"
                element-loading-text="数据加载中"
                @selection-change="handleSelectionChange">
                <el-table-column
                fixed="left"
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="nickName"
                label="主播昵称"
                >
                </el-table-column>
                 <el-table-column
                prop="userId"
                label="主播ID"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="真实姓名"
                >
                </el-table-column>
                <el-table-column
                prop="idCard"
                
                label="身份证号"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.idCard.substr(0,6) + '********' + scope.row.idCard.substr(14)}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="gender"
                label="性别"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.gender == 1 ? '女' : '男'}}
                    </template>
                </el-table-column>
                <el-table-column
                prop="region"
                label="地区"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="phone"
                label="手机号码"
                >
                </el-table-column>
                <el-table-column
                prop="inTheTime"
                label="入驻时间"
                show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{scope.row.inTheTime!=null ? changedatano(scope.row.inTheTime):''}}
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
</template>

<script>
import { anchorInfoListAPI } from '@/api/platformAnchor/platformAnchor'
import HeadTitle from '@/components/headtitle.vue'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{

            tableData:[],
            loading:false,

            searchId:'', // 主播ID
            searchNickName:'', // 主播昵称

            // 分页
            total:0,
            params:{
                linit:10,
                page:1
            },

            // 表格
            tableData:[],
            multipleSelection: [],
            
            // 导出组件设置
            filetext:'主播信息',
            filename:'主播信息',
            tHeader:['主播昵称','主播ID','真实姓名','身份证号','性别','地区','手机号码','入驻时间'],
            filterVal:['nickName','userId','name','idCard','sex','address','phone','enterTime'],
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
                nickName:this.searchNickName,
                userId:this.searchId
            }
            let res = await anchorInfoListAPI(params)
            console.log(res);
            if(res.code == 0){
                this.total = res.data.total
                res.data.records.forEach(e=>{
                    e.gender!= null && e.gender!= undefined && (e.sex = e.gender==1?'女':'男')
                    e.inTheTime!=null && (e.enterTime = this.changedatano(e.inTheTime))
                })
                this.tableData = res.data.records
            }
            console.log(this.tableData);
        },

        searchHandle(){
            this.params.page = 1
            this.getData()
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

        // 导出完成清空multipleSelection
        clearmultiple(){
            this.multipleSelection = []
        },

        changeSeID(){
            let value = this.searchId
            if(value.length ==1){
                this.searchId=value.replace(/[^0-9]/g,'')
            }else{
                this.searchId=value.replace(/\D/g,'')
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        // 重置搜索条件
        resetSearch(){  
            this.searchId = '',
            this.searchNickName = ''
            this.getData()
        },
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
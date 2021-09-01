<template>
    <div>
        <!-- 禁播弹框 -->
        <el-dialog
        title="禁播"
        :visible.sync="dialogVisible"
        width="30%"
        @close="resetForm('ruleForm')"
        >
            <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="直播状态：">
                        <el-radio v-model="radio" label="1">禁播</el-radio>
                    </el-form-item>
                    <el-form-item label="禁播原因：" prop="ban">
                        <el-select v-model="ruleForm.ban" placeholder="请选择" size="mini">
                        <el-option label="色情" value="色情"></el-option>
                        <el-option label="版权" value="版权"></el-option>
                        <el-option label="反动" value="反动"></el-option>
                        <el-option label="暴恐" value="暴恐"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="禁播时间：" prop="time">
                        <el-select v-model="ruleForm.time" placeholder="请选择" size="mini">
                        <el-option label="本次" value="0"></el-option>
                        <el-option label="1天" value="1"></el-option>
                        <el-option label="7天" value="2"></el-option>
                        <el-option label="30天" value="3"></el-option>
                        <el-option label="永久" value="-1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="text-align: right;margin-bottom:0">
                        <el-button @click="resetForm('ruleForm')" size="mini">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!-- 解禁弹框 -->
        <el-dialog
        title="解禁"
        :visible.sync="dialogVisible1"
        width="30%"
        >
            <el-form>
                <el-form-item label="直播状态：">
                    <el-radio v-model="radio" label="1">禁播</el-radio>
                    <el-radio v-model="radio" label="2">解禁</el-radio>
                </el-form-item>
                <el-form-item label="禁播原因：" v-show="radio == 1">
                    {{reason}}
                </el-form-item>
                <el-form-item label="禁播时间：" v-show="radio == 1">
                    {{'距离解禁还剩' + remain}}
                </el-form-item>
                <el-form-item v-show="radio == 2">
                    {{'解禁后直播状态将恢复正常！'}}
                </el-form-item>
                <el-form-item style="text-align: right;margin-bottom:0">
                        <el-button @click="dialogVisible1 = false" size="mini">取消</el-button>
                        <el-button type="primary" @click="removeHandle" size="mini">确定</el-button>
                    </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'LiveDialog',
    data(){
        return{
            //#region 禁播
            dialogVisible:false,
            radio:'1',
            ruleForm:{
                ban:'', // 禁播原因
                time:'' // 禁播时间
            },
            reason:'',
            remain:'',
            rules:{
                ban:[
                    {required: true, message: '请选择原因', trigger: 'change'}
                ],
                time:[
                    {required: true, message: '请选择时间', trigger: 'change'}
                ]
            },
            //#endregion
            

            // 解禁
            dialogVisible1:false
        }
    },
    methods:{
        //#region 禁播弹框逻辑
        // 打开禁播弹窗
        openDialog(){
            this.dialogVisible = true
            this.radio = '1'
            this.ruleForm.ban = ''
            this.ruleForm.time = ''
        },
        // 禁播弹窗确定逻辑
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 验证通过后在这里发送接口请求
                    let data = {
                        ban:this.ruleForm.ban,
                        time:this.ruleForm.time
                    }
                    this.$emit('banLive',data,()=>{
                        this.dialogVisible = false
                    }); 
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 取消
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false
        },
        
        //#endregion

        // 解禁确定按钮逻辑
        removeHandle(){
            if(this.radio == 2) {
                // 调用解除禁播接口 ... 
                this.$emit('removeBan',()=>{
                   this.dialogVisible1 = false
               }); 
            }else{
                this.dialogVisible1 = false
            }
        },
        // 打开解禁弹框
        openDialog1(data){
            this.reason = data.reason
            this.remain = data.remain
            this.dialogVisible1 = true
            this.radio = '1'
        }
    },
    watch:{
       
    }
}
</script>
<style lang="scss" scoped>
.el-form-item{
    padding-left: 120px;
}
</style>
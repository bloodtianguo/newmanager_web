<template>
    <div class="user-container">
        <head-title title="用户详情"/>

        <div class="content">
            <div class="title">基本信息</div>
            <table>
                <tr>
                    <td rowspan="7" style="width:200px">
                        <div class="avatar-box">
                            <img id="avatar-img" src="https://meizhao.oss-cn-shanghai.aliyuncs.com/202106/1ccf8ec0ccf94e55a7ab34f1f4a88eaf.jpg">
                            <div class="avatar-lv-box">
                                <div class="avatar-lv">LV1</div>
                            </div>
                        </div>
                    </td>
                    <td>用户昵称</td>
                    <td>{{}}</td>
                    <td>用户ID</td>
                    <td>{{}}</td>
                    <td>用户等级</td>
                    <td>{{}}</td>
                    <td>绑定手机号</td>
                    <td>{{}}</td>
                </tr>
                <tr>
                    <td>注册时间</td>
                    <td>{{}}</td>
                    <td>地区</td>
                    <td>{{}}</td>
                    <td>性别</td>
                    <td>{{}}</td>
                    <td>年龄</td>
                    <td>{{}}</td>
                </tr>
                <tr>
                    <td>邀请码</td>
                    <td>3</td>
                    <td>上级用户ID</td>
                    <td>5</td>
                    <td>上级邀请码</td>
                    <td>7</td>
                    <td>账户类型</td>
                    <td>9</td>
                </tr>
                <tr>
                    <td>用户类型</td>
                    <td>3</td>
                    <td>店铺类型</td>
                    <td>5</td>
                    <td>店铺id</td>
                    <td>7</td>
                    <td>店铺名称</td>
                    <td>9</td>
                </tr>
                <tr>
                    <td>商家id</td>
                    <td>3</td>
                    <td>商家名称</td>
                    <td>5</td>
                    <td>商家会员等级</td>
                    <td>7</td>
                    <td>提现费率</td>
                    <td>9</td>
                </tr>
                <tr>
                    <td>粉丝</td>
                    <td>3</td>
                    <td>关注用户</td>
                    <td>5</td>
                    <td></td>
                    <td></td>
                    <td>被举报次数</td>
                    <td>9</td>
                </tr>
                <tr>
                    <td>个人简介</td>
                    <td>3</td>
                </tr>
            </table>

            <div class="title">账户信息</div>
            <table>
                <tr>
                    <td>找币余额</td>
                    <td>2</td>
                    <td>找票余额</td>
                    <td>4</td>
                    <td>星光余额</td>
                    <td>6</td>
                    <td>重置总金额(元)</td>
                    <td>8</td>
                </tr>
                <tr>
                    <td>消费总找币</td>
                    <td>2</td>
                    <td>提现总找票数</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import HeadTitle from '../../components/headtitle.vue'
export default {
    components:{
        HeadTitle
    },
    data(){
        return{




            
        }
    }
}
</script>

<style lang="scss" scoped>
.user-container{
    padding: 10px 20px 20px 20px;

    .content{
        .title{
            padding-left: 20px;
            height: 43px;
            line-height: 43px;
            border-bottom: 1px solid #EBEEF5;
            
        }
        td{
            border: 1px solid #e6e6e6;
            padding: 9px 15px;
            color: #666;
            
        }
        table{
            margin: 10px 0;
            width: 100%;
            .avatar-box {
                width: 106px;
                height: 156px;
                margin: auto;
                border-radius: 5px;
                #avatar-img {
                    width: 106px;
                    height: 106px;
                    max-width: 106px;
                    border-radius: 5px;
                }
                .avatar-lv-box {
                    width: 100%;
                    height: 50px;
                    text-align: center;
                    color: white;
                    .avatar-lv {
                        margin: auto;
                        width: 41px;
                        height: 20px;
                        border-radius: 22px;
                        background-color: #1E9FFF;
                        margin-top: 17px;
                    }
                }
            }
        }
        tr{
            transition: all .3s;

        }
        tr:hover{
            background: #f2f2f2;
        }
    }
}
</style>
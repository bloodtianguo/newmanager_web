<template>
        <div class="upload-container">
                     <!-- :action="ITEMS_UP_IMG" -->
                     <!-- :headers="myHeaders" -->
          <el-upload class="avatar-uploader"
                     :action="ITEMS_UP_IMG"
                     :on-progress="uploadVideoProcess"
                     :on-success="handleVideoSuccess"
                     :before-upload="beforeUploadImg"
                     :on-error="uperror"
                     :show-file-list="false">
            <img v-if="videoForm.showVideoPath !='' && !videoFlag"
                 :src="videoForm.showVideoPath"
                 class="avatar">
            <i v-else-if="videoForm.showVideoPath =='' && !videoFlag"
               class="iconfont icon-shangchuantupian avatar-uploader-icon"></i>
            <el-progress v-if="videoFlag == true"
                         type="circle"
                         v-bind:percentage="videoUploadPercent"
                         style="margin-top:25px;"></el-progress>
          </el-upload>
        </div>
      <!-- <p class="Upload_pictures">
        <span></span>
        <span>只能上传png/jpg/jpeg格式图片</span>
      </p> -->
</template>

<script>
// var token = localStorage.getItem('token')
import * as imageConversion from 'image-conversion';
// import { imgzips } from '@/utils/imgzip'
// import { ITEMS_UP_IMG } from '@/API/apis';
export default {
  data () {
    return {
      // myHeaders: { token: token },
      // ITEMS_UP_IMG: ITEMS_UP_IMG,
      ITEMS_UP_IMG:"http://www.520you.vip:8888/saveCommonFile",
      videoFlag: false,
      //是否显示进度条
      playTime: "",
      videoUploadPercent: "",
      audioDuration: "",
      isShowUploadVideo: false,
      videoForm: {
        showVideoPath: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',//需修改
        fileId: ""
      }
    }
  },
  methods: {
    //上传前回调
    beforeUploadImg (file) {
      const isImage = ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) == -1
      // 获取时长
      if (isImage == true) {
        this.$message.error("只支持上传'png','jpg','jpeg'格式图片!");
        this.fileList = [];
      } else {
        imgzips(file, imageConversion)
      }
      this.isShowUploadVideo = false;
      return !isImage
    },
    //进度条
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    //上传成功回调
    handleVideoSuccess (res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      //后台上传地址
      if (res.code == 200) {
        this.videoForm.showVideoPath = res.data.url;
        this.videoForm.fileId = res.data.fileId;//需要传递的值
        this.ESpass()
      } else {
        this.$message.error("图片上传失败!");
      }
    },
    uperror (err, file, fileList) {
      console.log(err, file, fileList)
      this.$message.error("图片上传失败!");
    },
    // 点击向父级传值
    ESpass () {
      this.$emit('getimFileId', this.videoForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  display: block !important;
}
</style>

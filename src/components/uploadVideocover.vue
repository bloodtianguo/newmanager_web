<template>
  <div>
        <el-dialog
        title="修改封面"
        :visible.sync="coverVisible"
        width="400px"
        :close-on-click-modal="false"
        :before-close="coverClose"
        @closed="coverclosed"
      >
  <el-upload class="avatar-uploader"
                ref="uploadCover"
               :action="UPDATE_VIDEO_COVER"
               :on-progress="imgprogress"
               :on-success="handleVideoSuccess"
               :before-upload="beforeUploadImg"
               :on-error="uperror"
               :multiple="false"
               :headers="myHeaders"
               :data="myData"
               :auto-upload="false"
               :limit="1"
               drag
               :on-change="imgsaveTourl"
               :show-file-list="false">
       <img v-if="imgUrl" :src="imgUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip"
            class="el-upload__tip marginle10">只支持jpg/png格式文件，文件不超过2M</div>
    </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="coverClose">取 消</el-button>
          <el-button type="primary" @click="submitUpload()" :loading="subloding"
            >{{subtext}}</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { UPDATE_VIDEO_COVER } from "@/utils/request";
import { Success, Infos, Warning } from '@/utils/tools/message.js'
export default {
  name:"uploadcover",
  props:{
    videoid:{
      type: Number,
      default: 0
    },
    coverVisible:{
      tyep:Boolean,
      default: false
    }
  },
  created () { },
  data () {
    return {
      subtext:"上传",
      subloding:false,
      myHeaders: { token: getToken() },
      myData:{videoId :this.videoid },
      imgUrl: "",
      UPDATE_VIDEO_COVER: UPDATE_VIDEO_COVER,
    };
  },
  methods: {
      coverClose(){
        this.$nextTick(()=>{
            this.imgUrl=""
        })
      this.$refs.uploadCover.clearFiles()//清空
      this.$emit("coverClose", false)
      this.subloding=false
    },
    coverclosed(){
      this.$refs.uploadCover.clearFiles()//清空
    },
    //转换用于预览
    imgsaveTourl(event){
      var URL = null;
      if (window.createObjectURL != undefined) {
        URL = window.createObjectURL(event.raw);
      } else if (window.URL != undefined) {
        URL = window.URL.createObjectURL(event.raw);
      } else if (window.webkitURL != undefined) {
        URL = window.webkitURL.createObjectURL(event.raw);
      }
      this.imgUrl = URL;
    },
    //点击上传
    submitUpload(){
      this.$refs.uploadCover.submit()
    },
    //文件开始上传时
    imgprogress(){
      this.subloding=true
    },
    // 上传成功时函数
    handleVideoSuccess (res, file) {
      if (res.code == "0") {
        this.imgUrl=res.data
        Success("上传成功!")
        this.$refs.uploadCover.clearFiles()//清空
        this.coverClose()
      } else {
        this.$message.error("上传失败!");
      }
    },
    // 上传前函数
    beforeUploadImg (file) {
      const isImage = ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.type) == -1
      if (isImage == true) {
        this.$message.error("只支持上传'png','jpg','jpeg'格式图片!");
        this.fileList = [];
      }
      return !isImage
    },
    uperror (err, file, fileList) {
      this.$message.error("图片上传失败!");
    },
  },
  watch: {
     subloding: {
      handler(newValue) {
        if(newValue){
          this.subtext="上传中"
        }else{
          this.subtext="上传"
        }
      },
      deep: true
    },
         videoid: {
      handler(newValue) {
        if(newValue){
          this.myData.videoId=this.videoid
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-dragger{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    height: 300px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    height: 300px;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
   ::v-deep  .avatar-uploader-icon {
    display: flex;
    justify-content: center;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 300px;
    line-height: 300px;
    text-align: center;
    margin: 0 auto;
  }
  .el-upload__tip{
    text-align: center;
  }
  .avatar {
    height: 300px;
    margin: 0 auto;
    display: block;
  }
</style>

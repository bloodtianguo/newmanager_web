<template>
  <div>
    <el-upload class="upload-demo"
               :action="ITEMS_UP_IMG"
               :on-success="handleVideoSuccess"
               :before-upload="beforeUploadImg"
               :on-error="uperror"
               :headers="myHeaders"
               :show-file-list="false">
      <el-button style="margin-left: 10px;"
                 size="small"
                 type="success">上传</el-button>
      <span slot="tip"
            class="el-upload__tip marginle10">只支持jpg/png/gif格式文件，文件不超过2M</span>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { ITEMS_UP_IMG } from '@/api/table'
import { Success, Infos, Warning } from '@/utils/tools/message.js'
export default {
  data () {
    return {
      myHeaders: { token: getToken() },
      imgUrl: "",
      ITEMS_UP_IMG: ITEMS_UP_IMG,
    };
  },
  methods: {
    // 上传成功时函数
    handleVideoSuccess (res, file) {
      //后台上传地址
      if (res.code == "0") {
        console.log(res)
        this.imgUrl=res.data
        this.ESpass()
        Success("上传图片成功!")
      } else {
        this.$message.error("图片上传失败!");
      }
    },
    // 上传前函数
    beforeUploadImg (file) {
      console.log(file);
      const isImage = ['image/png', 'image/jpg', 'image/jpeg','image/gif'].indexOf(file.type) == -1
      if (isImage == true) {
        this.$message.error("只支持上传'png','jpg','jpeg'格式图片!");
        this.fileList = [];
      }
      return !isImage
    },
    uperror (err, file, fileList) {
      console.log(err, file, fileList)
      this.$message.error("图片上传失败!");
    },
    // 点击向父级传值
    ESpass () {
      this.$emit('getimgUrl', this.imgUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

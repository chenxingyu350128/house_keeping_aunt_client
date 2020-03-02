<template>
  <div class="feedBack-cpnt feedBack white">
    <iHeader @hide="$emit('hide')" text="意见反馈"/>
    <v-textarea
      class="mt-4 subtitle-2"
      v-model="desc"
      label="我要反馈 ："
      auto-grow
      autofocus
    ></v-textarea>  
    <v-textarea
      class="mt-4 subtitle-2"
      v-model="phone"
      label="联系方式 ："
      height="50"
      auto-grow
    ></v-textarea>  
    <!-- 图片上传 -->
    <div class="white subtitle-2 pa-4 mb-3">
      <div class="subtitle-1 primary--text pb-2">
        相关图片<span class="grey--text overline">（选填）</span>
      </div>
      <v-divider></v-divider>
      <v-row class="mx-0 my-2 pb-2 d-flex align-center"> 
        <v-col class="pa-1" cols="3">
            <v-img @click="addImgBtnClick" contain src="../../assets/img/imgUpload.png"></v-img>
        </v-col>
        <v-col class="pa-1" cols="3" v-for="(item,i) in uploadImgs" :key="i">
          <v-img :aspect-ratio="1/1" :src="item">
            <div class="d-flex justify-end">
              <v-icon @click="deleteImg(i)" color="blue accent-2">mdi-close-box</v-icon>
            </div>
          </v-img>
        </v-col>
        <v-col class="subtitle-2 grey--text" v-if="!uploadImgs.length" cols="9">请上传相关图片</v-col>
      </v-row>
      <v-footer fixed bottom class="pa-0">
        <v-btn @click="action" block dark large tile depressed color="primary">提交</v-btn>
      </v-footer>          
    </div>   
    <!-- 图片来源 -->
    <v-bottom-sheet persistent v-model="showImgChoice">
      <v-sheet class="text-center pa-4">
        <v-btn @click="chooseImgs(1)" class="mt-4" block depressed color="primary" dark>拍照</v-btn>
        <v-btn @click="chooseImgs" class="mt-4" block depressed color="primary" dark>从相册中选取</v-btn>
        <v-btn @click="showImgChoice=false" class="mt-4" block outlined color="primary" dark>取消</v-btn>
      </v-sheet>
    </v-bottom-sheet>       
  </div>
</template>

<script>
import iHeader from '../public/header'
export default {
  name: '',
  components: {iHeader},
  data: ()=> ({
    desc: '',
    uploadImgs: [],
    phone: '',
    showImgChoice: false,
    uploadEnv: true,

  }),
  computed: {
    imgsString(){
      if(!this.uploadImgs.length){
        return ''
      }else{

        return this.uploadImgs.reduce((x,y)=>{
          return x+','+y
        })
      }
    }
  },  
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)
  },
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
  },  
  methods: {
    addImgBtnClick(){
      if(this.uploadImgs.length>=3){
        this.$toast.error('最多上传3张图片')
        return
      }
      if(this.uploadEnv){

        this.showImgChoice = true
      }
    },
    runBack(){
      this.$emit('hide')
    },
    deleteImg(i){
      console.log(i)
      this.uploadImgs.splice(i,1)
    },    
    chooseImgs(i){
      const that = this
      this.showImgChoice = false
      navigator.camera.getPicture(
        function(img){
          that.uploadEnv = false
          that.uploadImages(img)
        },
        function(err){
          that.msg = "error: because" + err
        },
        {
          quality: 100,
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true,
          targetWidth: 100,
          sourceType: i==1?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY
        }
      )            
    },
    uploadImages(avatar){
      let that = this
      let ft = new FileTransfer()
      let opt = new FileUploadOptions()
　    //对应后台的字段
      opt.fileKey = 'file'
      opt.headers = {'token': this.$store.state.user.token}
      let uri = 'http://192.168.1.101:8092/housewife/home/real/fileUpload'
      ft.upload(
        avatar,
        encodeURI(uri),
        msg=>{
          console.log('success',msg);
          this.uploadImgs.push(JSON.parse(msg.response).obj.url)
          this.uploadEnv = true
        },
        err=>{
          that.uploadEnv = true
          console.log('fail',err);
        },
        opt
      )
    },
    checkPhone(e){
      if(!(/^1[3456789]\d{9}$/.test(e))){ 
          return true; 
      }   
    },    
    async action(){
      if(!this.desc){
        this.$toast.error('请填写反馈内容')
        return
      }

      if(!this.phone){
        this.$toast.error('请填写您的手机号码')
        return
      }
      if(this.checkPhone(this.phone)){
        this.$toast.error('手机号格式有误，请重填')
        return
      }


      const data = {
        auntId: this.$store.state.user.auntId,
        matter: this.desc,
        phone: this.phone,
        feedbackImg: this.imgsString
      }
      let res = await this.$http.post('/other/addFeedback', data)
      if(res.data.success){
        this.$toast.success(res.data.msg)
        this.$emit('hide')
      }
    }     
  }
}
</script>

<style  lang="scss">
.feedBack-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.feedBack{
  >.v-input{
    margin-top: 0;
    padding-top: 0;
    .v-input__control{
      .v-input__slot{
        margin-bottom: 0;
        padding: 5px 5%;
        .v-text-field__slot{
          height: 100%;
          >label{
            font-size: 16px;
          }
          >textarea{
            height: 100%!important;
          }
        }
        .v-text-field__prefix{
          min-width: 5em;
          text-align-last:justify!important;
          text-align:justify;
        }
      }
      .v-text-field__details{
        display: none;
      }
    }
  }
}
</style>

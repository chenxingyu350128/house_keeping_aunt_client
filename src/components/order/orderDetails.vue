<template>
  <div class="orderDetails-cpnt grey lighten-3 pb-11">
    <iHeader @hide="$emit('hide')" text="订单详情"/>
    <div class="white subtitle-2 pa-4 mb-3">
      <div>
        <span class="grey--text">服务项目：</span>
        {{goodsName}}
      </div>
      <div class="pt-2">
        <span class="grey--text">预约时间：</span>
        {{serviceTime}}
      </div>
      <div class="pt-2">
        <span class="grey--text">服务地址：</span>
        {{address}}
      </div>
      <div class="pt-2">
        <span class="grey--text">备注：</span>
        {{remark}}
      </div>
    </div>
    <div class="white subtitle-2 pa-4 mb-3">
      <div>
        <span class="grey--text">客户姓名：</span>
        {{customer}}
      </div>
      <div class="pt-2">
        <span class="grey--text">联系电话：</span>
        {{phone}}
      </div>
    </div>
    <div class="white subtitle-2 pa-4 mb-3">
      <div>
        <span class="grey--text">服务价格：</span>
        ￥{{totalMoney}}
      </div>
      <div class="pt-2">
        <span class="grey--text">订单编号：</span>
        {{orderNum}}
      </div>
      <div class="pt-2">
        <span class="grey--text">下单时间：</span>
        {{createTime}}
      </div>
    </div>     
    <!-- 清洁结果 -->
    <div class="white subtitle-2 pa-4 mb-3">
      <div class="subtitle-1 primary--text pb-2">
        清除结果<span class="grey--text overline">（选填）</span>
      </div>
      <v-divider></v-divider>
      <textarea
        :readonly="attemperStatus!=2"
        v-model="cleanResult"
        class="textIndent"
        placeholder="若清洁中遇到异常情况，请具体写明"
      ></textarea>       
    </div>     
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
              <v-icon v-if="attemperStatus==2" @click="deleteImg(i)" color="blue accent-2">mdi-close-box</v-icon>
            </div>
          </v-img>
        </v-col>
        <v-col class="subtitle-2 grey--text" v-if="!uploadImgs.length" cols="9">请上传相关截图</v-col>
      </v-row>
      <v-footer fixed bottom class="pa-0">
        <v-btn @click="action" block dark large tile depressed :color="attemperStatus>2?'grey':'primary'">{{commitText}}</v-btn>
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
  props: {
    orderNumber: {
      type: Number,
      required: true
    }
  },
  components: {iHeader},
  data: ()=> ({
    attemperStatus: 3,
    address: "海西佰悦城二期15栋601",
    phone: "",
    createTime: "",
    orderNum: "",
    totalMoney: 0,
    cleanResult: "很干净",
    remark: "",
    goodsName: "深度清洁",
    serviceTime: "2018-11-9（周日）10:00-12:00",
    customer: "",
    uploadImgs: [
      // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577340583205&di=7609d142c5031fef918af9933d5e30fc&imgtype=0&src=http%3A%2F%2Fcimg2.163.com%2Flady%2F2007%2F7%2F27%2F200707271548438080e.jpg',
      // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577340467408&di=3b8b0001044f4fd843068d45dac16cfa&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Ff2deb48f8c5494ee363cf7d12cf5e0fe98257ed8.jpg',
      // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577935374&di=2eb40c06ef43d6e4fe164e18dbd57a59&imgtype=jpg&er=1&src=http%3A%2F%2Ft-1.tuzhan.com%2Fcf4fcd8349af%2Fc-2%2Fl%2F2014%2F12%2F15%2F00%2F5962d22c5475438ead4925aebe044f33.jpg'

    ],
    uploadEnv: true,
        showImgChoice: false,


  }),
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
  },
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)
    this.init()
  },
  computed: {
    imgsString(){
      return this.uploadImgs.reduce((x,y)=>{
        return x+','+y
      })
    },
    commitText(){
      let str = ''
      switch(this.attemperStatus){
        case 1:
          return '开始服务'
        case 2:
          return '确认完成'
        case 3:
          return '已完成'
        case 4:
          return '客户已取消'
      }
    },
    businType(){
      return this.$store.state.user.businType
    }    
  },
  methods: {
    runBack(){
      this.$emit('hide')
    },
    async init(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        orderNum: this.orderNumber
      }
      const url = this.businType==1?'/aunt/order/findDetails':'/aunt/order/findFoodDetails'
      let res = await this.$http.get(url, {params})
      if(res.data.success){
        let obj = res.data.obj
        for(let x in obj){
          this[x] = obj[x]
        }
      }
    },
    async action(){
      if(this.attemperStatus>2){
        return
      }
      const data = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        orderNum: this.orderNumber,
        attemperStatus: this.attemperStatus+1
      }
      if(this.uploadImgs.length){
        data.cleanImage = this.imgsString
      }    
      if(this.cleanResult){
        data.cleanResult = this.cleanResult
      }    
      let res = await this.$http.post('/aunt/order/updataServe',data)
      if(res.data.success){
        this.$toast.success(res.data.msg)
        this.$emit('hide','Yo!')
      }  
    },
    addImgBtnClick(){
      if(this.attemperStatus!==2){
        return
      }
      if(this.uploadImgs.length>=3){
        this.$toast.error('最多上传3张图片')
        return
      }
      if(this.uploadEnv){

        this.showImgChoice = true
      }
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
  }
}
</script>

<style  lang="scss">
.orderDetails-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
  .textIndent{
  text-indent: 2em!important;
  width: 100%;
}
}
</style>

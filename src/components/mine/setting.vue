<template>
  <div class="setting-cpnt white">
    <iHeader @hide="$emit('hide')" text="个人设置"/>
    <div class="d-flex flex-column align-center justify-center py-6">
      <v-avatar
        size="21.33vw"
      >
        <v-img  @click="showImageSelect=true" max-height="21.33vw" max-width="21.33vw" :src="avatar||defaultAvatar"></v-img>
      </v-avatar>
      <span class="caption grey--text mt-2">点击修改头像</span>
    </div>
    <div @click="showBindPhone=true" class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>绑定手机号</span>

      <div class="d-flex align-center caption">
        <span>{{userName}}</span>
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
    <v-divider></v-divider>    
    <div @click="showWxbind=true" class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>微信授权</span>

      <div  class="d-flex align-center caption">
        <span :class="{'primary--text': !wechatType}">{{wechatType?'已绑定':'未绑定'}}</span>
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
    <v-divider></v-divider>    
    <div class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>清空缓存</span>

      <div class="d-flex align-center caption">
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
    <v-divider></v-divider>   
    <div @click="showAboutUs=true" class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>关于我们</span>

      <div class="d-flex align-center caption">
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
    <v-footer fixed bottom class="white pa-0">
      <v-btn @click="preLogout=true;showWxbind=true" tile dark depressed block color="primary">退出登录</v-btn>
    </v-footer>
    <alertBox @cancel="showWxbind = false" @certain="alertBoxCertain" :showIt="showWxbind" :title="preLogout?'是否确认退出登录？': wechatType?'确定要解绑微信吗？':'确定要绑定微信吗？'"/>
    <!-- 底部弹窗 -->
    <v-bottom-sheet persistent  v-model="showImageSelect">
      <v-sheet class="text-center pa-4">
        <v-btn @click="getImage(1)" class="mt-4" block depressed color="primary" dark>拍照</v-btn>
        <v-btn @click="getImage(0)" class="mt-4" block depressed color="primary" dark>从相册中选取</v-btn>
        <v-btn @click="showImageSelect=false" class="mt-4" block outlined color="primary" dark>取消</v-btn>
      </v-sheet>
    </v-bottom-sheet>   
    <!-- 全屏弹窗  -->
    <v-dialog
      v-model="showBindPhone"
      fullscreen 
      persistent
    > 
      <div class="fill-height white v-pt45">

        <iHeader @hide="showBindPhone=false" text="手机号换绑"/>
            <!-- 表单填写 -->
        <div class="mx-8">
          <v-text-field
            v-if="unBind"
            placeholder="请输入要绑定的手机号"
            prefix="新手机号"
            v-model="newUserName"
            type="tel"
          ></v-text-field>
          <v-text-field
            v-else
            readonly
            placeholder="请输入手机号"
            prefix="当前手机号"
            v-model="userName"
            type="number"
          ></v-text-field>

          <v-text-field
            placeholder="请输入短信验证码"
            v-model="vCode"
            prefix="验证码"
            class="vCode"
            type="tel"
          >
            <template v-slot:append>
                <v-btn v-show="seconds" x-small dark color="#06C1AE">{{seconds}}s</v-btn>
                <v-btn v-show="!seconds" @click="getCode" x-small dark outlined color="primary">获取</v-btn>
            </template>      
          </v-text-field> 
          <v-btn @click="btnCertain" tile block dark depressed color="#06C1AE" class="subtitle-2 mb-4">{{unBind?'确认绑定':'下一步'}}</v-btn>    
        </div>
      </div>

    </v-dialog>
    <aboutUs @hide="showAboutUs=false" v-if="showAboutUs"/>
  </div>
</template>

<script>
import iHeader from '../public/header'
import alertBox from '../public/alertBox'
import aboutUs from './aboutUs'

export default {
  components: {
    iHeader,
    alertBox,
    aboutUs
  },
  data: ()=> ({
    // avatar: '',
    // userName: '',
    newUserName: '',
    preLogout: false,
    seconds: 0,
    unBind: false,//换绑第一步：解绑
    vCode: '',
    timer: null,
    defaultAvatar: require('../../assets/img/defaultAvatar.png'),
    showImageSelect: false,
    showWxbind: false,
    showBindPhone: false,
    showAboutUs: false,

  }),
  computed: {
    exitable(){
      let arr = [
        'showWxbind',
        'showBindPhone',
        'showAboutUs',
        'showImageSelect',
      ]
      let todo = true 
      arr.forEach(res=>{
        if(this[res]){
          todo = false
        }
      })
      return todo
    },
    wechatType(){
      return this.$store.state.user.wechatType
    },      
    userName(){
      return this.$store.state.user.userName
    },      
    avatar(){
      return this.$store.state.user.image
    },      
  },
  watch: {
    exitable:{
      handler(newVal){
        if(newVal){
          document.addEventListener('backbutton',this.runBack,false)
          document.removeEventListener('backbutton',this.hideCpnt,false)
        }
        else{
          this.exitState = 0
          document.addEventListener('backbutton',this.hideCpnt,false)
          document.removeEventListener('backbutton',this.runBack,false)
        }
      },
      immediate: true
    },      
  },
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
    document.removeEventListener('backbutton',this.hideCpnt,false)
  },  
  // mounted(){
  //   this.wechatType = parseInt(this.$store.state.user.wechatType)
  //   this.avatar = this.$store.state.user.image
  //   this.userName = this.$store.state.user.userName
  // },
  methods: {
    runBack(){
      this.$emit('hide')
    },
    logout(){
      this.$store.commit('USER_LOG_OUT')
      this.$router.push('/login')
    },
    hideCpnt(){
      let arr = [
        'showWxbind',
        'showBindPhone',
        'showAboutUs',
        'showImageSelect',
        ]
      arr.forEach(res=>{
        if(this[res]){
          this[res] = false
        }
      })
    },
    alertBoxCertain(){
      if(this.preLogout){
        this.logout()
        return
      }
      this.showWxbind = false
      if(this.wechatType){//解绑
        const data = {
          auntId: this.$store.state.user.auntId,
          token: this.$store.state.user.token,
        }
        this.$http.post('/other/updateWechat',data)
        .then(res=>{
          if(res.data.success){
            this.$toast.success(res.data.msg)
            this.$store.commit('CHANGE_SINGLE_STATE', ['wechatType', 0])
          }
        })
        return
      }
      //绑定微信
      let that = this
      Wechat.isInstalled(function (installed) {
        if(installed){
          const scope = "snsapi_userinfo";
          const state = "_" + (+new Date());
          let data = {
            auntId: that.$store.state.user.auntId,
          }
          Wechat.auth(scope, state, function (response) {
              data.code = response.code
              that.$http.post('/other/updateWx',data)
              .then(res=>{
                if(res.data.success){
                  // that.wechatType = 1
                  that.$store.commit('CHANGE_SINGLE_STATE', ['wechatType', 1])
                  that.$toast.success(res.data.msg)
                }
              })
          }, function (reason) {
                  console.error("Failed: " + reason);
          });    
        }
      }, function (reason) {
              console.error("Failed: " + reason);
      });
            

    },
    checkPhone(e){
      if(!(/^1[3456789]\d{9}$/.test(e))){ 
          return true; 
      }   
    },  
    getCode(){
      if(this.unBind&&!this.newUserName){
        this.$toast.error('请输入手机号码')
        return
      }    

      if(this.unBind&&this.checkPhone(this.newUserName)){
        this.$toast.warning('手机号格式有误，请重填')
        return
      }

      const params = {
        phone: this.unBind?this.newUserName:this.userName
      }

      this.$http.get('/member/loginMsg',{params})
      .then(res=>{
        if(res.data.success){
          this.$toast.success('验证码已发送')
          this.seconds = 60
          //倒计时开始
          this.timer = setInterval(()=>{
            this.seconds --
            if(this.seconds === 0){
              clearInterval(this.timer)
            }
          },1000)                        
        }
      })
    },     
    btnCertain(){
      const data = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        yzcode: this.vCode
      }   

      if(!this.vCode){
        this.$toast.error('请输入短信验证码')
        return
      }
      if(this.unBind){//换绑
        if(!this.newUserName){
          this.$toast.error('请输入要绑定的新手机号')
          return
        }

        if(this.checkPhone(this.newUserName)){
          this.$toast.error('手机号格式有误，请重填')
          return
        }
        data.phone = this.newUserName
        this.$http.post('/other/updatePhone',data)
        .then(res=>{
          if(res.data.success){
            this.$toast.success('换绑成功,请使用新号码登录')
            this.$store.commit('USER_LOG_OUT')
            this.$router.push('/login')
            // this.$store.commit('SET_USERNAME',this.newUserName)
            // this.vCode = ''
            // this.newUserName = ''
            // this.showBindPhone = false
          }
        })
      }else{//校验原号码与验证码
        data.phone = this.userName
        this.$http.get('/other/findPhone',{params: data})
        .then(res=>{
          if(res.data.success){
            this.vCode = ''
            clearInterval(this.timer)
            this.seconds = 0
            this.unBind = true
          }
        })        
      }
      

    },
    getImage(i){
      const that = this
      this.showImageSelect = false
      navigator.camera.getPicture(
        function(img){
          that.avatarChange(img)
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
          sourceType: i===1?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY
        }
      )    
    },
    avatarChange(avatar){
      let that = this
      let ft = new FileTransfer()
      let opt = new FileUploadOptions()
　    //对应后台的字段
      opt.fileKey = 'file'
      opt.fileName = 'cxx.jpg'
      // opt.fileName = avatar.substr(avatar.lastIndexOf('/') + 1)
      opt.headers = {"token": this.$store.state.user.token}
      let uri = 'http://192.168.1.101:8092/housewife/home/real/fileUpload'
      ft.upload(
        avatar,
        encodeURI(uri),
        msg=>{
          console.log('success',msg);
          let avatar = JSON.parse(msg.response).obj.url
          this.updateAvatar(avatar)
        },
        err=>{
          console.log('fail',err);
        },
        opt
      )
    }, 
    async updateAvatar(img){
      const data = {
        auntId: this.$store.state.user.auntId,
        img
      }
      let res = await this.$http.post('/other/updateImg',data) 
      if(res.data.success){
        this.$toast.success(res.data.msg)
        this.avatar = res.data.obj.img
        this.$store.commit('CHANGE_SINGLE_STATE', ['image', res.data.obj.img])
      }
    }  
  }
}
</script>

<style  lang="scss">
.setting-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.v-pt45{
  padding-top: 45px;
}
</style>

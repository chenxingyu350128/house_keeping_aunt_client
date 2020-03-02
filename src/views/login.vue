<template>
  <div class="loginPage-cpnt white d-flex flex-column-reverse">
    <!-- 微信登陆 -->
    <div class="d-flex flex-column align-center">
      <div class="d-flex align-center pb-8" width="90">
        <v-divider color="grey"></v-divider>
        <span class="grey--text caption px-4">第三方登录</span>
        <v-divider color="grey" width="90"></v-divider>
      </div>
      <v-btn  @click="wxAuth" depressed dark color="#50B674" fab>
        <v-icon large>mdi-wechat</v-icon>
      </v-btn>
      <span class="overline pb-4 pt-12 grey--text text--darken-3">
        登录即代表您已同意<span @click="agreement" class="primary--text">《颐纳福隐私政策》</span>
      </span>
    </div>
    <!-- 表单填写 -->
    <div class="mx-8">

      <v-text-field
        placeholder="请输入手机号"
        prefix="+86"
        v-model="phone"
        type="number"
      ></v-text-field>
      <v-text-field
        placeholder="请输入短信验证码"
        v-model="vCode"
        type="number"
      >
        <template v-slot:append>
            <v-btn v-show="seconds" x-small dark color="#06C1AE">{{seconds}}s</v-btn>
            <v-btn v-show="!seconds" @click.stop="getCode" x-small dark outlined color="#06C1AE">获取</v-btn>
        </template>      
      </v-text-field>
      <v-text-field
        class="caption deleteUnderline pt-0 mt-0"
        placeholder="未注册的手机号验证后将自动创建账号"
        readonly
      ></v-text-field>  
      <v-btn @click="loginBtn" tile block dark depressed color="#06C1AE" class="subtitle-2 mb-4">登录</v-btn>    
    </div>
    <!-- 上部logo -->
    <div class="flex-fill d-flex align-center justify-center">
      <v-img max-height="16.4vw" max-width="24.13vw" :src="logo"></v-img>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data: ()=> ({
    seconds: 0,
    exitState: 0,
    phone: '',
    vCode: '',
    timer: null,
    wxLoginable: true,
    wxData: null,
    exitTimeout: null,
    logo: require('../assets/img/ynfLogo.png')
  }),
  beforeDestroy(){
		clearInterval(this.timer)
		clearTimeout(this.exitTimeout)
		document.removeEventListener('backbutton',this.runBack,false)
  },  
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)

  },
  methods: {
    runBack(){
      window.plugins.toast.showLongCenter('再点击一次退出!');
      this.exitState ++
      //2秒后重新注册
      this.exitTimeout = window.setTimeout(
        ()=>{
          this.exitState=0
          window.clearTimeout(this.exitTimeout);
        },2000
      )
      console.warn('zhiwei:'+this.exitState);

      if(this.exitState>1){
        navigator.app.exitApp()
      }  
    },
    checkPhone(e){
      if(!(/^1[3456789]\d{9}$/.test(e))){ 
          return true; 
      }   
    },     
    getCode(){
      if(!this.phone){
        this.$toast.warning('请输入手机号码')
        return
      }    

      if(this.checkPhone(this.phone)){
        this.$toast.warning('手机号格式有误，请重填')
        return
      }

      const params = {
        phone: this.phone
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
    async loginBtn(e){
      console.log(e);
      
      if(!this.phone){
        this.$toast.warning('请输入手机号码')
        return
      }

      if(!this.vCode){
        this.$toast.warning('请输入短信验证码')
        return
      }    

      if(this.checkPhone(this.phone)){
        this.$toast.warning('手机号格式有误，请重填')
        return
      }

      let data = {
        phone: this.phone,
        yzcode: this.vCode
      }
      if(this.wxData){
        Object.assign(this.wxData, data)
      }
      let res = await this.$http.post('/member/login', this.wxData||data)
      if(res.data.success){
        this.realLogin(res.data.obj)
      }
    },
    realLogin(obj){
        this.$store.dispatch('userLogIn', obj)
        this.$toast.success('登录成功！')
        this.setAlias(obj.token)
        this.$router.push('/index')
    },
    wxAuth(){
      if(!this.wxLoginable){
        return
      }
      let that = this
      Wechat.isInstalled(function (installed) {
        if(installed){
          const scope = "snsapi_userinfo";
          const state = "_" + (+new Date());
          Wechat.auth(scope, state, function (response) {
            console.info(JSON.stringify(response))
            that.wxLogin(response.code)
          }, function (reason) {
            console.error("Failed: " + reason);
          });
        }
      }, function (reason) {
              console.error("Failed: " + reason);
      });
    },
    wxLogin(code){
      this.$http.post('/member/loginForWx',{code})
      .then(res=>{
        if(res.data.success){
          if(res.data.obj.wechatType){//直接进入首页
            this.realLogin(res.data.obj)
            return
          }
          if(!res.data.obj.wechatType){

            this.wxData = {
              openid: res.data.obj.openid,
              headimgurl: res.data.obj.headimgurl,
              nickname: res.data.obj.nickname,
            }
            this.$toast.success('请绑定手机号')
            this.wxLoginable = false
            this.loginBtn(1)
          }
        }
      })
    },    
    //极光推送setAlias
    setAlias(token){
      let that = this
      if(!token){
        console.error('token空的？登陆成功没有给token?')
        return
      }
      console.warn('开始设置alias--login');
      setTimeout(
        () => {
          console.error('login---token值为：'+localStorage.getItem('token'))
          window.JPush.setAlias(
            { sequence: 1, alias: token },
            function(r){
              console.log(r)
            },
            function(err){
              console.log(err)
            }
          )
        }, 200
      ); 									
    },
    agreement(){
      let url = 'http://mobile.yinaf.com/page/agreement.html'
      let inApp = cordova.InAppBrowser.open(url,'_blank','location=no')
			inApp.addEventListener('exit',()=>{
				StatusBar.backgroundColorByHexString("#06C1AE");
			})
			inApp.addEventListener('loadstop',()=>{
				StatusBar.backgroundColorByHexString("#fff");
			})
    }
  }
}
</script>

<style  lang="scss">
.loginPage-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 100;
}
.deleteUnderline{
  .v-input__control{
    .v-input__slot{
      &::before,
      &::after{
        border: 0;
      }
    }
  }
  border: 0;
}
</style>

<template>
  <div class="mine-cpnt white">
    <v-card class="d-flex align-center px-6 pb-4" flat dark tile color="primary" height="50.66vw">
      <div class="d-flex align-center">
        <v-avatar
          size="21.33vw"
        >
          <v-img :src="userAvatar||defaultAvatar"></v-img>
        </v-avatar>
        <div class="ml-4 caption">
          <div>{{userName}}</div>
          <div>完成订单数：{{orderCount}}</div>
          <div class="d-flex align-center">
            <v-rating
              readonly
              half-increments
              dense
              v-model="eval"
              background-color="white"
              color="red"
              class="mr-2"
              small
            ></v-rating>
            {{eval}}分
          </div>
        </div>
      </div>
      <v-icon @click="showSetting=true" class="posAb-rt">mdi-settings</v-icon>
    </v-card>
    <!-- 下部分整体上拉 -->
    <div class="posRel">
      <!-- 提现card -->
      <v-card @click="showIncome=true" class="mx-6 mb-6 pa-2 subtitle-2">
        <div class="d-flex align-center justify-space-between mb-1">
          <div>
            可提现金额： <span class="cyan--text">￥{{amount}}</span>
            <div class="grey--text overline mt-1">每月1号结算上月收入</div>
          </div>
          <v-btn @click.stop="showWithdraw=true" dark small depressed color="primary">提现</v-btn>
        </div>
        <v-divider></v-divider>
        <div class="d-flex align-center justify-space-around py-2">
          <div class="d-flex flex-column align-center">
            <span class="subtitle-1">￥{{recordByDay}}</span>
            <span class="caption">今日收益</span>
          </div>
          <v-divider inset vertical></v-divider>
          <div class="d-flex flex-column align-center">
            <span class="subtitle-1">￥{{recordByMot}}</span>
            <span class="caption">本月收益</span>
          </div>        
          <v-divider inset vertical></v-divider>
          <div class="d-flex flex-column align-center">
            <span class="subtitle-1">￥{{record}}</span>
            <span class="caption">总收益</span>
          </div>        
        </div>      
      </v-card>
      <!-- 下方菜单 -->
      <div @click="showUserInfo=true" class="mx-6 my-2 d-flex align-center justify-space-between subtitle-2">
        <div class="d-flex align-center">
          <v-btn class="mr-4" fab dark x-small depressed color="#7CCC53">
            <v-icon>mdi-email-outline</v-icon>
          </v-btn>
          我的信息
        </div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <v-divider></v-divider>
      <div @click="showNotification=true" class="mx-6 my-2 d-flex align-center justify-space-between subtitle-2">
        <div class="d-flex align-center">
          <v-btn class="mr-4" fab dark x-small depressed color="#F15C62">
            <v-icon>mdi-comment-processing-outline</v-icon>
          </v-btn>
          消息通知
        </div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <v-divider></v-divider>
      <div @click="showHelp=true" class="mx-6 my-2 d-flex align-center justify-space-between subtitle-2">
        <div class="d-flex align-center">
          <v-btn class="mr-4" fab dark x-small depressed color="#F3A715">
            <v-icon>mdi-emoticon-happy-outline</v-icon>
          </v-btn>
          帮助中心
        </div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <v-divider></v-divider>
      <div @click="showFeedback=true" class="mx-6 my-2 d-flex align-center justify-space-between subtitle-2">
        <div class="d-flex align-center">
          <v-btn class="mr-4" fab dark x-small depressed color="#2FAAE7">
            <v-icon>mdi-microphone</v-icon>
          </v-btn>
          意见反馈
        </div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <v-divider></v-divider>
    </div>
    <setting @hide="showSetting=false" v-if="showSetting"/>
    <income @hide="showIncome=false" v-if="showIncome"/>
    <withdrawCash :money="amount" @hide="showWithdraw=false" v-if="showWithdraw"/>
    <userInfo @hide="showUserInfo=false" v-if="showUserInfo"/>
    <notification @hide="showNotification=false" v-if="showNotification"/>
    <help @hide="showHelp=false" v-if="showHelp"/>
    <feedBack @hide="showFeedback=false" v-if="showFeedback"/> 
  </div>
</template>

<script>
import userInfo from '../components/mine/userInfo'
import notification from '../components/mine/notification'
import help from '../components/mine/help'
import feedBack from '../components/mine/feedBack'
import setting from '../components/mine/setting'
import income from '../components/mine/income'
import withdrawCash from '../components/mine/withdraw'
export default {
  components: {
    userInfo,
    notification,
    help,
    feedBack,
    setting,
    income,
    withdrawCash
  },
  data: ()=> ({
    exitState: 0,
    exitTimeout: null,
    showUserInfo: false,
    showNotification: false,
    showFeedback: false,
    showHelp: false,
    showSetting: false,
    showIncome: false,
    showWithdraw: false,
    eval: 0,
    orderCount: 0,
    amount: 0.0,
    recordByDay: 0.0,
    recordByMot: 0.0,
    record: 0.0,
    withdraw: 0.0,
    // userName: '',
    // userAvatar: '',
    authStatus: '',
    defaultAvatar: require('../assets/img/defaultAvatar.png')
  }),
  computed: {
    exitable(){
      let arr = [
        'showUserInfo',
        'showNotification',
        'showFeedback',
        'showHelp',
        'showSetting',
        'showIncome',
        'showWithdraw'
      ]
      let todo = true 
      arr.forEach(res=>{
        if(this[res]){
          todo = false
        }
      })
      return todo
    },
    userName(){
      return this.$store.state.user.userName
    },      
    userAvatar(){
      return this.$store.state.user.image
    },      
  },
  watch: {
    exitable:{
      handler(newVal){
        if(newVal){//双击退出
          document.addEventListener('backbutton',this.runBack,false)
        }
        else{
          this.exitState = 0
          document.removeEventListener('backbutton',this.runBack,false)
        }
      },
      immediate: true
    },      
  },
  mounted(){
    // this.userAvatar = this.$store.state.user.image
    // this.userName = this.$store.state.user.userName
    this.init()
  },
  beforeDestroy(){
    window.clearTimeout(this.exitTimeout);
    document.removeEventListener('backbutton',this.runBack,false)
  },    
  methods: {
    init(){
      this.findGrade()
      this.findMoney()
    },
    runBack(){
      window.plugins.toast.showLongCenter('再点击一次退出!');
      this.exitState ++
      // document.removeEventListener("backbutton", this.runBack, false);//注销返回键
      //3秒后重新注册
      this.exitTimeout = window.setTimeout(
        ()=>{
          this.exitState=0
          window.clearTimeout(this.exitTimeout);
          // document.addEventListener("backbutton", this.runBack, false);//返回键
        },2000
      )
      if(this.exitState>1){
        navigator.app.exitApp()
      }   
    },
    async findGrade(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
      }
      let res = await this.$http.get('/other/findGrade',{params})
      if(res.data.success){
        this.eval = res.data.obj.eval
        this.orderCount = res.data.obj.orderCount
      }
    },
    async findMoney(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
      }
      let res = await this.$http.get('/other/findMoney',{params})
      if(res.data.success){
        let obj = res.data.obj
        for(let x in obj){
          this[x] = obj[x]
        }
        
      }      
    },
  },
}
</script>

<style  lang="scss">
.mine-cpnt{
  // position: fixed;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  min-height: 100vh;
  // overflow-y: auto;
  // z-index: 10;
}
.ratingBox{
  i[role]{
    padding: 0;
  }
}
.posAb-rt{
  position: absolute;
  right: 10px;
  top: 10px;
}
.posRel{
  position: relative;
  top: -12vw;
}
</style>

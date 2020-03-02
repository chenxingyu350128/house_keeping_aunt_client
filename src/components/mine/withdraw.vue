<template>
  <div class="Withdraw-cpnt grey lighten-3">
    <iHeader @hide="$emit('hide')" text="提现"/>
    <!-- 提取前 -->
    <div v-if="!showResult">

      <div class="py-12 d-flex flex-column align-center white mb-2">
        <span class="headline font-weight-bold grey--text text--darken-3 mb-6">可提现余额</span>
        <span class="headline font-weight-bold primary--text">￥{{money}}</span>
      </div>
      <div class="white subtitle-2">
        <div class="d-flex align-center px-4 py-2">
          到账微信
          <v-btn @click="bindWx" class="ml-6" small v-if="!wechatType" outlined dark color="primary">请绑定微信</v-btn>
          <span class="ml-6 primary--text caption" v-else>微信账号已绑定</span>
        </div>
        <v-text-field
        class="mx-4 pb-0"
          v-model="wanna"
          prefix="提现金额"
          placeholder="最低提现金额为50元"
          type="number"
        ></v-text-field>
      </div>
      <div class="px-4 py-2 caption">
        <p>1.工作日16:00之前提现当日到账，16:00之后提现第二个工作日到账</p>
        <p>2.提现金额3000元以上，需收取3元手续费。</p>
      </div>
      <v-footer fixed bottom class="pa-0">
        <v-btn @click="btnClick" dark depressed block tile color="primary">提交申请</v-btn>
      </v-footer>
    </div>
    <!-- 提取后 -->
    <!-- 结果页 -->
    <div class="d-flex flex-column align-center py-10" v-else>
      <v-icon size="65" :color="withdrawSuccess?'green accent-4':'red accent-4'">{{withdrawSuccess?'mdi-check-circle':'mdi-close-circle'}}</v-icon>
      <span class="title font-weight-bold my-4">{{withdrawSuccess?'提现成功':'提现失败'}}</span>
      <span class="subtitle-2 my-3">{{withdrawSuccess?'提现金额将尽快到账，请注意查收':'请重新提交提现申请'}}</span>
      <v-btn @click="btnReturn" depressed rounded dark :color="withdrawSuccess?'green accent-4':'red accent-4'">返回</v-btn>
    </div>
    <v-bottom-sheet persistent class="white" v-model="showBottomSheet">
      <v-card flat tile>
        <v-card-title class="subtitle-1 font-weight-bold primary--text justify-center">
          输入短信验证码
        </v-card-title>
        <v-card-text>
          短信将发送至{{userName}}
          <v-text-field
            prefix="验证码"
            placeholder="请输入短信验证码"
            v-model="vCode"
            type="number"
          >
            <template v-slot:append>
                <v-btn v-show="seconds" small dark color="#06C1AE">{{seconds}}s</v-btn>
                <v-btn v-show="!seconds" @click="getCode" small dark outlined color="#06C1AE">获取</v-btn>
            </template>      
          </v-text-field>   
        </v-card-text>
        <v-card-actions>
          <v-btn large tile class="flex-fill" @click="showBottomSheet=false" small dark outlined color="primary">取消提现</v-btn>
          <v-btn large tile class="flex-fill" @click="certain" small dark depressed color="primary">确认提现</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import iHeader from '../public/header'
export default {
  props: {
    money: {
      type: Number,
      required: false
    }
  },
  components: {iHeader},
  data: ()=> ({
    // money: 200,
    seconds: 0,
    timer: null,
    wanna: '',
    vCode: '',
    showBottomSheet: false,
    withdrawSuccess: false,
    showResult: false,
  }),
  computed: {
    wechatType(){
      return +this.$store.state.user.wechatType
      // return 1
    },
    userName(){
      return +this.$store.state.user.userName
    },
  },
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)
    this.init()
  },
  beforeDestroy(){
		clearInterval(this.timer)
		document.removeEventListener('backbutton',this.runBack,false)
  },   
  methods: {
    btnReturn(){
      if(this.withdrawSuccess){
        this.init()
      }
      this.showResult = false
    },
    runBack(){
      this.$emit('hide')
    },
    bindWx(){
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
                  that.wechatType = 1
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
    async init(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
      }
      let res = await this.$http.get('/other/findMoney',{params})
      if(res.data.success){
        // this.withdraw = res.data.obj.withdraw
        this.money = res.data.obj.amount
      } 
    },
    btnClick(){
      if(!this.wechatType){
        this.$toast.error('请先绑定微信')
        return
      }
      if(!this.wanna){
        this.$toast.error('请填写提现金额')
        return
      }
      if(this.wanna<50){
        this.$toast.error('提现金额最少为50元')
        return
      }
      if(this.wanna>this.money){
        this.$toast.error('可提现余额不足')
        return
      }
      this.showBottomSheet = true
    },
    getCode(){
      const params = {
        phone: this.userName
      }
      this.$http.get('/member/loginMsg',{params})
      .then(res=>{
        if(res.data.success){
          this.$toast('验证码已发送',{
            color: 'success',
            y: 'top'
          })
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
    async certain(){
      if(!this.vCode){
        this.$toast('请输入短信验证码',{
          y: 'top',
          color: 'error',
        })
      }
      const data = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        amount: this.wanna,
        phone: this.userName,
        yzcode: this.vCode
      }
      let res = await this.$http.post('/other/deposit',data)
      if(res.data.success){
        this.withdrawSuccess = true
      }
      this.seconds = 0
      clearInterval(this.timer)
      this.showBottomSheet = false
      this.showResult = true
    }
  }
}
</script>

<style  lang="scss">
.Withdraw-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
</style>

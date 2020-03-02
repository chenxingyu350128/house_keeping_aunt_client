<template>
  <div class="income-cpnt grey lighten-3 d-flex flex-column">
    <iHeader @hide="$emit('hide')" text="我的收益"/>
    <v-card class="px-8 py-6 d-flex align-center justify-space-between subtitle-1" dark flat tile color="primary">
      <div class="d-flex flex-column font-effect-shadow-multiple">
        账户余额
        <span class="headline font-weight-bold mt-1">￥{{amount}}</span>
      </div>
      <div class="d-flex flex-column">
        累计提现：￥{{withdraw}}
        <div @click="showWithdraw=true" class="d-flex align-center mt-2">
          立即提现
          <v-icon large>mdi-chevron-right</v-icon>
        </div>
      </div>
    </v-card>
    <v-tabs
      v-model="tab"
      color="primary"
      centered
      class="white"
      @change="tabChange"
      grow
    >
      <v-tab>
        收益明细
      </v-tab>
      <v-tab>
        提现记录
      </v-tab>
    </v-tabs>
    <v-tabs-items class="flex-fill flowy_auto" v-if="tab">
      <van-list
        v-if="list.length"
        :immediate-check="false"
        @load="loadBottom" 
        :finished="allLoaded" 
        loading-text="加载中..." 
        finished-text="-- 已经到底了 --"  
      > 
        <div class="caption" v-for="(itm,idx) in list" :key="idx">
          <div class="subtitle-2 grey--text text--darken-2  px-4 py-2">{{itm.year}}年{{itm.moth}}月</div>
          <div v-for="(item,i) in itm.map" :key="i" class="d-flex align-center px-4 py-2 white">
            <span>{{item.newTime}}</span>
            <span class="ml-4">-{{item.amoun}}元</span>
            <div class="flex-fill d-flex align-center justify-end">
              <span :class="{'primary--text': item.dataflag==1,'red--text': item.dataflag==2}">{{item.dataflag==1?'提现成功':'提现失败'}}</span>
              <v-btn class="ml-2 scale50" small fab dark color="#50B674">
                <v-icon large>mdi-wechat</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
       
      </van-list>
      <!-- 空的 -->
      <div v-else class="d-flex flex-column align-center justify-center py-12">
        <v-img max-width="33.33vw" max-height="auto" :src="emptyContent"></v-img>
        <span class="mt-4 caption grey--text">快去接单赚收益吧</span>        
      </div>
    </v-tabs-items>
    <v-tabs-items class="flex-fill flowy_auto" v-if="!tab">
      <van-list
        v-if="list.length"
        :immediate-check="false"
        @load="loadBottom" 
        :finished="allLoaded" 
        loading-text="加载中..." 
        finished-text="-- 已经到底了 --"  
      > 
        <div class="caption" v-for="(itm,idx) in list" :key="idx">
          <div class="subtitle-2 grey--text text--darken-2  px-4 py-2">{{itm.year}}年{{itm.moth}}月</div>
          <div v-for="(item,i) in itm.map" :key="i" class="d-flex align-center px-4 py-2 white">
            <span>{{item.newTime}}</span>
            <span class="ml-4">{{item.content}}</span>
            <div class="flex-fill d-flex align-center justify-end">
              <span class="primary--text">+{{item.amoun}}元</span>
            </div>
          </div>
        </div>
       
      </van-list>
      <!-- 空的 -->
      <div v-else class="d-flex flex-column align-center justify-center py-12">
        <v-img max-width="33.33vw" max-height="auto" :src="emptyContent"></v-img>
        <span class="mt-4 caption grey--text">快去接单赚收益吧</span>        
      </div>
    </v-tabs-items>
    <withdrawCash :money="amount" @hide="showWithdraw=false" v-if="showWithdraw"/>
  </div>
</template>

<script>
import iHeader from '../public/header'
import withdrawCash from './withdraw'
export default {
  components: {
    iHeader,
    withdrawCash
  },
  data: ()=> ({
    tab: 0,
    amount: 0,
    withdraw: 0,
    page: 1,
    rows: 10,
    list: [],
    allLoaded: false,
    showWithdraw: false,
    emptyContent: require('../../assets/img/index/emptyContent.png'),


  }),
  created(){
    this.loadBottom = _.debounce(this.loadmore, 200)
  },
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
  },
  mounted(){
    this.incomeInfo()
    this.getList()
  },
  watch: {
    showWithdraw: {
      handler(val){
        if(!val){
          document.addEventListener('backbutton',this.runBack,false)
        }else{
          document.removeEventListener('backbutton',this.runBack,false)
        }
      },
      immediate: true
    }
  },
  methods: {
    runBack(){
      this.$emit('hide')
    },    
    tabChange(e){
      this.tab = e
      this.page = 1
      this.list = []
      this.getList()
    },   
    toWithDraw(){
      this.$router.push({
        path: '/withdraw',
        query: {
          money: this.amount
        }
      })
    }, 
    async incomeInfo(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
      }
      let res = await this.$http.get('/other/findMoney',{params})
      if(res.data.success){
        this.withdraw = res.data.obj.withdraw
        this.amount = res.data.obj.amount
      }  
    },
    loadmore(){
      this.page++
      this.getList(9527)
    },
    async getList(e){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        recordState: this.tab + 1,
        rows: this.rows,
        page: this.page
      }
      let res = await this.$http.get('/other/findDetailed',{params})
      if(res.data.success){
        let pager = res.data.pager
        let rows = res.data.rows
        this.allLoaded = pager.currentPage===pager.totalPages
        this.list = e?this.list.concat(rows):rows
      }
    }
  }
}
</script>

<style  lang="scss">
.income-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  // overflow-y: auto;
  z-index: 100;
}
.flowy_auto{
  overflow-y: auto;
}
.scale50{
  transform: scale(.5);
}
</style>

<template>
  <div class="orderCenter-cpnt grey lighten-3">
    <iHeader @hide="$emit('hide')" text="我的订单"/>
    <v-tabs 
      v-model="tab" 
      color="primary"
      class="white theTabs" 
      height="45"
      centered
      @change="changeTab"
      grow
      >
      <!-- <v-tab class="mx-2" @click="changeTab(4)">
        全部
      </v-tab> -->
      <!-- <v-divider inset vertical></v-divider> -->
      <v-tab>
          服务中
      </v-tab>
      <v-divider inset vertical></v-divider>
      <v-tab>
          已完成
      </v-tab>
      <v-divider inset vertical></v-divider>
      <v-tab>
          全部
      </v-tab>
    </v-tabs>
    <v-tabs-items class="pa-2 grey lighten-3">
      <van-list
        v-if="orderList.length"
        :immediate-check="false"
        @load="loadBottom" 
        class="mb-12"
        :finished="allLoaded" 
        loading-text="加载中..." 
        finished-text="-- 已经到底了 --"  
      >
        <div @click="orderNum=parseInt(item.orderNum);showDetails=true" v-for="(item,i) in orderList" :key="i" class="px-4 py-2 white mt-4 mx-2">
          <div class="caption d-flex justify-space-between">
            <div>
              <span>订单编号：</span>
              <span class="grey--text">{{item.orderNum}}</span>
            </div>
            <span :class="{'primary--text': item.attemperStatus==2, 'red--text': item.attemperStatus>2}">{{item.status}}</span>
          </div>
          <v-divider></v-divider>
          <div class="subtitle-2">
            <span class="font-weight-bold">客户姓名：</span>
            <span class="grey--text"> {{item.customer}}</span>
          </div>
          <div class="subtitle-2 d-flex">
            <span class="font-weight-bold nowrap">服务地址：</span>
            <span class="grey--text nowrap ellipsis flex-fill"> {{item.address}}</span>
          </div>
          <div class="subtitle-2">
            <span class="font-weight-bold">服务项目：</span>
            <span class="grey--text">{{item.goodsName}}</span>
          </div>
          <div class="subtitle-2">
            <span class="font-weight-bold">预约时间：</span>
            <span class="grey--text">{{item.serviceTime}}</span>
          </div>
          <v-footer v-if="item.attemperStatus<3" bottom class="pa-0 d-flex flex-row-reverse white">

            <v-btn @click.stop="phoneCall(item.phone)" class="mt-6 ml-4 subtitle-2 font-weight-bold"  dark depressed small color="primary">联系客户</v-btn>
            <v-btn :outlined="item.attemperStatus==1" @click.stop="action(item.attemperStatus, item.orderNum)" class="mt-6 subtitle-2 font-weight-bold"  :dark="item.attemperStatus==1" depressed small :color="item.attemperStatus==1?'primary':'grey lighten-1'">{{item.attemperStatus==1?'开始服务':'完成服务'}}</v-btn>
          </v-footer>
        </div>
      </van-list>
      <!-- 空的 -->
      <div v-else class="d-flex flex-column align-center justify-center py-12">
        <v-img max-width="33.33vw" max-height="auto" :src="emptyContent"></v-img>
        <span class="mt-4 caption grey--text">--暂无订单--</span>        
      </div>
    </v-tabs-items> 
    <orderDetails :orderNumber="orderNum" @hide="detailsBack" v-if="showDetails"/>
  </div>
</template>

<script>
import iHeader from '../components/public/header-without-left'
import orderDetails from '../components/order/orderDetails'
export default {
  name: '',
  components: {
    iHeader,
    orderDetails
  },
  data: ()=> ({
    tab: 0,
    status: 1,
    allLoaded: false,
    showDetails: false,
    orderNum: 0,
    orderList: [],
    page: 1,
    rows: 10,
    emptyContent: require('../assets/img/index/emptyContent.png'),
    exitState: 0,
    exitTimeout: null,

  }),
  created(){
    this.loadBottom = _.debounce(this.loadmore, 200)
  },
  mounted(){
    this.getList()
  },
  computed: {
    businType(){
      return this.$store.state.user.businType
    }
  },
  beforeDestroy(){
    window.clearTimeout(this.exitTimeout);
    document.removeEventListener('backbutton',this.runBack,false)
  },   
  watch: {
    showDetails: {
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
    changeTab(e){
      this.status = e+2
      this.page = 1
      this.getList()
      window.scrollTo(0, 0);

    },
    phoneCall(phone){
      location.href='tel:' + phone
    },
    detailsBack(e){
      if(e){
        this.page = 1
        this.getList()
      }
      this.showDetails=false      
    },
    async action(attemperStatus, orderNum){
      const data = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        attemperStatus: attemperStatus+1,
        orderNum
      } 
      const url = this.businType==1?'/aunt/order/updataServe':'/aunt/order/updataFoodServe'
      let res = await this.$http.post(url,data)
      if(res.data.success){
        this.page = 1
        this.getList()
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
        attemperStatus: this.status,
        page: this.page,
        rows: this.rows
      } 
      const url = this.businType==1?'/aunt/order/findServe':'/aunt/order/findFoodServe'
      let res = await this.$http.get(url,{params})
      if(res.data.success){
        let pager = res.data.pager
        let rows = res.data.rows
        this.allLoaded = pager.currentPage === pager.totalPages
        this.orderList = e ? this.orderList.concat(rows) : rows
        this.orderList.forEach(res=>{
          let status = ''
          switch(res.attemperStatus){
            case 1:
              status = '待服务'
              break;
            case 2:
              status = '服务中'
              break;
            case 3:
              status = '已完成'
              break;
            case 4:
              status = '已取消'
              break;
          }
          this.$set(res,'status',status)
        })
      }
    }
  }
}
</script>

<style  lang="scss">
.orderCenter-cpnt{
  // position: fixed;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  min-height: 100vh;
  padding-top: 90px;
  overflow-y: auto;
  // z-index: 10;
}
.nowrap{
  white-space: nowrap;
}
.ellipsis{
  text-overflow: ellipsis;
  overflow: hidden;
}
.theTabs{
  position:fixed;
  top: 45px;
  z-index: 22;
}
</style>

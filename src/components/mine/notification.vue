<template>
  <div class="notification-cpnt grey lighten-3 d-flex flex-column">
    <iHeader @hide="$emit('hide')" text="消息通知"/>
    <v-tabs
      v-model="msgType"
      color="primary"
      class="fixedTab"
      slider-color="primary"
      @change="tabChange"
      grow
    >
      <v-tab>
        服务提醒
      </v-tab>
      <v-tab>
        交易通知
      </v-tab>
    </v-tabs>
    <v-tab-items class="flex-fill pt-12">
      <van-list
        v-if="msgList.length"
        :immediate-check="false"
        @load="loadBottom" 
        :finished="allLoaded" 
        loading-text="加载中..." 
        finished-text="————已经到底了————"  
      >
        <div v-for="(item,i) in msgList" :key="i" class="px-4 py-2 white mb-1">
          <div class="caption d-flex justify-space-between py-2">
            <span>{{item.msgHead}}</span>
            <span>{{item.msgTime}}</span>
          </div>
          <v-divider></v-divider>
          <p class="subtitle-2 mb-0 py-2">{{item.msgContent}}</p>
        </div>
      </van-list>
      <!-- 空的 -->
      <div v-else class="d-flex flex-column align-center justify-center py-12">
        <v-img max-width="33.33vw" max-height="auto" :src="emptyContent"></v-img>
        <span class="mt-4 caption grey--text">暂无消息</span>        
      </div>      
    </v-tab-items>
  </div>
</template>

<script>
import iHeader from '../public/header'
export default {
  name: '',
  components: {iHeader},
  data: ()=> ({
    msgType: 0,
    rows: 10,
    page: 1,
    allLoaded: false,
    msgList: [],
    emptyContent: require('../../assets/img/index/emptyContent.png'),


  }),
  created(){
    this.loadBottom = _.debounce(this.loadmore, 200)
  },  
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
  },
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)
    this.getList()
  },
  methods: {
    tabChange(){
      this.page = 1
      this.getList()
      window.scrollTo(0, 0);
    },
    runBack(){
      this.$emit('hide')
    },
    async getList(e){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        msgType: this.msgType+1,
        page: this.page,
        rows: this.rows
      }
      let res = await this.$http.get('/other/findMess',{params})
      if(res.data.success){
        let pager = res.data.pager
        let rows = res.data.rows
        this.allLoaded = pager.currentPage===pager.totalPages
        this.msgList = e?this.msgList.concat(rows):rows
      }
    },
    loadmore(){
      this.page++
      this.getList(123)
    }
  }
}
</script>

<style  lang="scss">
.notification-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.fixedTab{
  position: fixed;
  top: 45px;
}
</style>

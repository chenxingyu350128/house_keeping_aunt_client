<template>
  <div class="indexTab-cpnt d-flex flex-column-reverse grey lighten-2">
    <iHeader bgc="#06C1AE">
      <template v-slot:center>
        <v-select
          :items="items"
          v-model="workState"
          @change="changeSelect"
          class="pt-0 mt-0 statusSelector"
          append-icon="mdi-chevron-down"
        ></v-select>
      </template>
      <template v-slot:right>
        <v-icon @click="showMessages=true">mdi-tooltip-text-outline</v-icon>
      </template>
    </iHeader>
    <div class="fill-height overflowYAuto">
      <van-list
        v-if="orderList.length&&workState&&authType==1"
        :immediate-check="false"
        @load="loadBottom" 
        :finished="allLoaded" 
        loading-text="加载中..." 
        finished-text="———— 全部加载 ————"  
      >
        <div v-for="(item,i) in orderList" :key="i" class="pa-6 white mt-2 mx-2">
          <div class="subtitle-2">
            <span class="font-weight-bold">服务项目：</span>
            <span class="grey--text">{{item.goodsName}}</span>
          </div>
          <div class="subtitle-2">
            <span class="font-weight-bold">预约时间：</span>
            <span class="grey--text"> {{item.serviceTime}}</span>
          </div>
          <div class="subtitle-2">
            <span class="font-weight-bold">服务地址：</span>
            <span class="grey--text"> {{item.address}}</span>
          </div>
          <div class="subtitle-2">
            <span class="font-weight-bold">服务总价：</span>
            <span class="primary--text">￥{{item.totalMoney}}</span>
          </div>
          <v-btn @click="takeOrder(item.orderId, item.orderNum)" class="mt-6 subtitle-1 font-weight-bold" tile dark depressed block color="primary">接单</v-btn>
        </div>
      </van-list>
      <div v-else class="d-flex flex-column align-center justify-center pt-12">
        <v-img max-width="33.33vw" max-height="auto" :src="emptyContent"></v-img>
        <span class="mt-4 overline grey--text">{{authType!=1?'您还没有开工':workState?'暂无订单':'休息中暂不接单'}}</span>
      </div>
    </div>
    <v-bottom-sheet persistent v-model="showAuth">
      <div class="d-flex flex-column align-center white py-5">
        <v-img max-width="25.6vw" max-height="auto" contain v-if="authType==0" :src='holdIdCard'></v-img>
        <v-icon size="75" color="primary" v-else-if="authType==2">mdi-check-circle</v-icon>
        <v-img max-width="25.6vw" max-height="auto" contain v-else-if="authType==3" :src='inVertify'></v-img>
        <v-icon size="75" color="red" v-else-if="authType==4">mdi-close-circle</v-icon>
        <span class="subtitle-1 font-weight-bold my-5">{{subtitle}}</span>
        <span :class="authType==4?'red--text':''" class="overline">{{overline}}</span>
      </div>
      <v-btn @click="btnClick" tile color="primary" block>{{vertifyBtnText}}</v-btn>
    </v-bottom-sheet>
    <!-- app更新提示框 -->
    <v-dialog
      v-model="showDia"
      scrollable  
      persistent
      max-width="290"
      transition="dialog-transition"
    >
      <v-card class="d-flex flex-column">
        <div style="position: relative" class="py-4 cyan lighten-2 white--text">
          <div class="d-flex justify-center align-center">


            <v-img max-width="50" src="../assets/img/ynfLogo.png"></v-img>  
            <div class="d-flex flex-column ml-4">
              <span>V{{newVersion}}</span>
              <span>欢迎体验</span>
            </div>
          </div>
          <v-icon v-if="!forceUpdate" @click="showDia=false" class="posAbs-rt" color="white">mdi-close</v-icon>
        </div>
        <div class="d-flex flex-column pa-4">
          <span>新版特征：</span>
          <span>{{whatIsNew}}</span>
          <div style="width: 100%" class="d-flex justify-center">
            <v-spacer></v-spacer>
            <v-btn v-if="!forceUpdate" @click="btnClick" depressed dark color="cyan">{{showProgress?'正在更新':'立即更新'}}</v-btn>
            <v-spacer></v-spacer>
          </div>
        </div>
        <v-progress-linear
          v-if="showProgress"
          color="light-blue"
          height="15"
          indeterminate
        >
        </v-progress-linear>
      </v-card>
    </v-dialog>    
    <toVertify @hide="vertifyCheck(9527);showToAuth=false" v-if="showToAuth"></toVertify>
    <alertBox @cancel="showDeleteDialog = false" @certain="certainOrderTake" :showIt="showDeleteDialog" title="确定要接收这个订单吗？"/>
    <userInfo @hide="showUserInfo=false" v-if="showUserInfo"/>
    <notification @hide="showMessages=false" v-if="showMessages"/>
  </div>
</template>

<script>
import iHeader from '../components/public/header-without-left'
import alertBox from '../components/public/alertBox'
import toVertify from '../components/index/toVertify'
import userInfo from '../components/mine/userInfo'
import notification from '../components/mine/notification'
export default {
  name: '',
  components: {
    iHeader,
    toVertify,
    alertBox,
    userInfo,
    notification
  },
  data: ()=> ({
    items: [
      {value: 0, text: '休息中'},
      {value: 1, text: '接单中'},
    ],
    authType: 1,
    page: 1,
    rows: 10,
    workState: 0,
    showAuth: false,
    showProgress: false,
    allLoaded: false,
    showDeleteDialog: false,
    showDia: false,
    vertifyBtnText: '',
    forceUpdate: '',
    appDownloadUrl: '',
    newVersion: '',
    whatIsNew: '',
    subtitle: '',
    overline: '',
    exitState: 0,
    exitTimeout: null,
    emptyContent: require('../assets/img/index/emptyContent.png'),
    holdIdCard: require('../assets/img/index/holdIdCard.png'),
    inVertify: require('../assets/img/index/InVertify.png'),
    showToAuth: false,
    showUserInfo: false,
    showMessages: false,
    orderList: []
    
  }),
  computed: {
    exitable(){
      let arr = [
        'showDeleteDialog',
        'showToAuth',
        'showUserInfo',
        'showMessages',
        'showDia',
      ]
      let todo = true 
      arr.forEach(res=>{
        if(this[res]){
          todo = false
        }
      })
      return todo
    }
  },
  watch: {
    exitable:{
      handler(newVal){
        if(newVal){//双击退出
          document.addEventListener('backbutton',this.runBack,false)
          document.removeEventListener('backbutton',this.hideDialog,false)
        }
        else{
          this.exitState = 0
          document.addEventListener('backbutton',this.hideDialog,false)
          document.removeEventListener('backbutton',this.runBack,false)
        }
      },
      immediate: true
    },   
    authType:{
      handler(val){
        this.showAuth = val!=1
        if(val!=1){
          switch(val){
            case 0:
              this.vertifyBtnText = '去认证'
              this.subtitle = '请先完成身份实名认证'
              this.overline = '身份认证审核通过后，才能开始接单'
              break;
            case 2:
              this.vertifyBtnText = '知道了'
              this.subtitle = '身份认证成功'
              this.overline = '身份认证已通过，快去接单赚取收益'
              break;
            case 3:
              this.vertifyBtnText = '查看详情'
              this.subtitle = '身份认证审核中'
              this.overline = '我们将会在24小时内审核，请耐心等待'
              break;
            case 4:
              this.vertifyBtnText = '重新填写'
              this.subtitle = '身份认证失败'
              this.overline = '人证失败原因： 身份信息与身份证不匹配'
              break;
          }
        }
      },
      immediate: true,
    }
  },
  created(){
    this.loadBottom = _.debounce(this.loadmore, 200)
  },
  mounted(){
    this.vertifyCheck()

    if(!sessionStorage.getItem('firstCheckUpdate')){
      this.checkNewVersion()
      sessionStorage.setItem('firstCheckUpdate',true)
    }
  },
  beforeDestroy(){
    window.clearTimeout(this.exitTimeout);
    document.removeEventListener('backbutton',this.runBack,false)
    document.removeEventListener('backbutton',this.hideDialog,false)
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
    hideDialog(){
      if(this.showDeleteDialog){
        this.showDeleteDialog = false
      }
      if(this.showDia){
        this.showDia = false
      }
    },   
    loadmore(){
      this.page++
      this.getList('yy')
    },  
    takeOrder(orderId, orderNum){
      this.orderId = orderId
      this.orderNum = orderNum
      this.showDeleteDialog = true
    },
    async certainOrderTake(){
      this.showDeleteDialog = false
      const data = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        orderId: this.orderId,
        orderNum: this.orderNum
      } 
      let res = await this.$http.post('/home/real/updataOrder',data) 
      if(res.data.success){
        this.page = 1
        this.getList()
      }
    },
    async vertifyCheck(e){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token
      }
      let res = await this.$http.get('/home/real/findReal',{params})
      if(res.data.success){
        this.authType = res.data.obj.authType
        localStorage.setItem('authType',this.authType)
        this.workState = res.data.obj.workState
        if(this.authType==1&&this.workState){
          this.getList()
        }
        if(this.authType!=1){
          this.showAuth = true
        }
      }
    },
    async changeSelect(e){
      if(this.authType!=1){
        return
      }
      const data = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        workState: e
      }
      let res = await this.$http.post('/home/real/updataState',data)
      if(res.data.success){
        this.workState = res.data.obj.workState
        if(this.workState){
          this.getList()
        }
      }
    },
    async getList(e){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        businType: this.$store.state.user.businType,
        page: this.page,
        rows: this.rows
      }
      let res = await this.$http.get('/home/real/findOrder',{params})
      let pager = res.data.pager
      let rows = res.data.rows
      this.allLoaded = pager.currentPage===pager.totalPages
      this.orderList = e?this.orderList.concat(rows):rows
    },
    btnClick(){
      this.showAuth= false
      switch(this.authType){
        case 0:
        case 4:
          this.showToAuth = true
          break
        case 2:
          this.deepVertify()
          break;
        case 3:
          this.showUserInfo = true
          break;
      }
    },
    async deepVertify(){
      let res = await this.$http.post('/home/real/updataAuth',{auntId: this.$store.state.user.auntId})
      this.authType = res.data.obj.authType
    },
    async checkNewVersion(){
      if(device){
		  	if (device.platform == "iOS") {
          this.appType = 2
          this.filePath = cordova.file.tempDirectory;
		  	} else if (device.platform == "Android") {
          this.appType = 1
          this.filePath = cordova.file.externalDataDirectory;
		  	}
      }
      let _this = this
      const serverVersion = AppVersion.version
      console.log('app版本为：'+serverVersion);
      
      // const serverVersion = '1.0.2'
			const params = {
				appType: this.appType,
				serverVersion
			}
			let res = await this.$http.get('/setup/loginUpdateApp',{params})
      console.log('获取更新数据');
      console.log(res);
      
      this.appDownloadUrl = res.data.obj.updateUrl
      this.newVersion = res.data.obj.serverVersion
      this.whatIsNew = res.data.obj.upgradeInfo
      this.forceUpdate = parseInt(res.data.obj.lastForce)
      const appUpdate = sessionStorage.getItem('showUpdate')
      if(res && !appUpdate){
        sessionStorage.setItem('showUpdate',true)
        this.showDia = !!this.appDownloadUrl
        if(this.forceUpdate){
          this.createFile()
        }
      }
    },
    createFile(){
      let _this = this
      window.resolveLocalFileSystemURL(
        _this.filePath,
        function(fs) {
          fs.getFile(
             _this.fileName, // 创建的文件名
            { create: true, exclusive: true },
            // create：创建新文件，exclusive:文件已存在时抛出异常
            function(fileEntry) {
              // 创建成功回调下载方法写入文件
              _this.downloadFile(fileEntry);
            },
            function(err) {
              // 失败回调
              // 重新读取文件并打开
              fs.getFile(
                _this.fileName,
                { create: false },
                function(fileEntry) {
                  // 成功读取文件后调用cordova-plugin-file-opener2插件打开文件
                  _this.preview(fileEntry);
                },
                function(err) {
                  console.log(err);
                  
                  _this.$toast('读取文件失败');
                }
              );
            }
          );
        },
        function(error) {
          _this.$toast('进入文件系统失败！');
        }
      );      
    },
    downloadFile(fileEntry) {
      let _this = this
      // 初始化进度条并显示
      // 此处采用mint-ui的Progress组件
      this.progress = 0;
      this.showProgress = true;
      //实例化
      this.fileTransfer = new FileTransfer();
      let opt = new FileUploadOptions()
      opt.headers = {'token': this.$store.state.user.token}
      //监听下载进度
      this.fileTransfer.onprogress = function(e) {
        if (e.lengthComputable) {
          let progress = e.loaded / e.total;
          // 显示下载进度
          _this.progress = (progress * 100).toFixed(2);
        }
      };
      // 使用fileTransfer.download开始下载
      this.fileTransfer.download(
        encodeURI(_this.appDownloadUrl), //uri网络下载路径
        fileEntry.toURL(), //文件本地存储路径
        function(entry) {
          // 下载完成执行本地预览
          if (_this.progress > 1 || _this.progress === 1) {
            _this.showProgress = false;
            entry.file(data => {
              console.warn('看看data-type',data);
              _this.dataType = data.type
              //存到localstorage,下次打开app因为已经下载过了所以不会进入这一步
              localStorage.setItem('dataType',data.type)
              _this.preview(fileEntry);
              // 此处data.type可以直接得到文件的MIME-TYPE类型
            });
          }
        },
        function(error) {
          _this.$toast('下载失败！');
        },
        opt
      );
    },
    preview(fileEntry){
      // console.warn(fileEntry);
      console.warn('安装啊');
      console.log(localStorage.getItem('dataType'));
      let _this = this
      this.showDia = false
      // 调用cordova-plugin-file-opener2插件实现用第三方app打开文件
      cordova.plugins.fileOpener2.open(
        // 此处必须填写cdvfile://地址，不然android7.0+会报文件权限错误
        fileEntry.toInternalURL(), //文件本地地址转cdvfile://地址
        localStorage.getItem('dataType'), //文件类型，这里我是写了一个mime-Type类型合集fileTypeArr来调用 
        {
          error: function(e) {
            console.error('打开失败',e);
          },
          success: function(){
            console.warn('打开成功');
          }
        }
      );
    },      
  }
}
</script>

<style  lang="scss">
.indexTab-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 10;
  margin-bottom: 50px;
}
  .statusSelector{
    div[role]{
      // background: pink;
      margin-bottom: 0!important;
     
    }
    .v-text-field__details{
      display: none!important;
    }
    .v-select__selection--comma{
      overflow: unset!important;
    }
  }
  .overflowYAuto{
    overflow-y: auto;
  }

</style>

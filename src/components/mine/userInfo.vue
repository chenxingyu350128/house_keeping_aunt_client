<template>
  <div class="userInfo-cpnt white">
    <iHeader @hide="$emit('hide')" text="我的信息"/>

    <div v-if="authType!=1" class="d-flex flex-column align-center white pt-5">
      <v-img max-width="25.6vw" max-height="auto" contain v-if="authType==0" :src='holdIdCard'></v-img>
      <v-icon size="75" color="primary" v-else-if="authType==2">mdi-check-circle</v-icon>
      <v-img max-width="25.6vw" max-height="auto" contain v-else-if="authType==3" :src='inVertify'></v-img>
      <v-icon size="75" color="red" v-else-if="authType==4">mdi-close-circle</v-icon>
      <span class="subtitle-1 font-weight-bold my-5">{{subtitle}}</span>
      <span :class="authType==4?'red--text':''" class="overline mb-4">{{overline}}</span>
      <v-btn v-if="!authType" @click="$router.push('/to')" depressed dark tile block color="primary">去认证</v-btn>
    </div>
    <div class="userInfoDetail" v-else>
      <v-text-field
        class="subtitle-2"
        readonly
        prefix="姓名："
        v-model="realName"
      ></v-text-field>
      <!-- <v-divider></v-divider> -->
      <v-text-field
        class="subtitle-2"
        readonly
        prefix="户籍地："
        v-model="hrCity"
      ></v-text-field>
      <v-text-field
        @click="areaVisible=true"
        class="subtitle-2"
        readonly
        prefix="所在城市："
        v-model="homeCity"
      ></v-text-field>
      <!-- <div class="subtitle-2 px-4 py-2"></div> -->
      <v-textarea
        class="mt-4 subtitle-2"
        v-model="homeAddress"
        label="家庭住址 ："
        height="50"
        auto-grow
      >
      </v-textarea>
      <v-text-field
        @click="showComunitySet=true"
        class="subtitle-2"
        readonly
        prefix="服务范围："
        v-model="communityName"
      ></v-text-field>      
      <v-text-field
        v-if="businType==2"
        class="subtitle-2"
        readonly
        prefix="营业执照号："
        v-model="businessNum"
      ></v-text-field>      
      <v-text-field
        class="subtitle-2"
        readonly
        prefix="身份证号："
        v-model="idcard"
      ></v-text-field>      
      <!-- 照片 -->
      <div class="d-flex align-center justify-space-around mb-4 mt-2">
        <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
          <v-img :src="frontImg"></v-img>
        </v-card>
        <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
          <v-img :src="behindImg"></v-img>
        </v-card>
      </div>
      <div v-if="businType==2" class="d-flex align-center justify-space-around mb-4 mt-2">
        <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
          <v-img :src="businessImage"></v-img>
        </v-card>
        <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
          <v-img :src="handImage"></v-img>
        </v-card>
      </div>
      <v-footer fixed bottom class="pa-0">
        <v-btn @click="btnClick" block depressed tile color="primary">{{btnText}}</v-btn>
      </v-footer>
    </div>
    <!-- 地区选择弹窗  -->
    <v-bottom-sheet persistent v-model="areaVisible">
      <v-sheet>
        <van-picker 
          show-toolbar 
          :columns="columns" 
          @confirm ="onConfirm"
          @cancel="areaVisible=false"
          @change="onChange" />
      </v-sheet>
    </v-bottom-sheet>     
    <toVertify @hide="vertifyCheck(9527);showToAuth=false" v-if="showToAuth"></toVertify>
    <communitySelect :commitDirect="notTrue" @getCommunity="setCommunity" @hide="showComunitySet=false" v-if="showComunitySet"/>  
  </div>
</template>

<script>
import iHeader from '../public/header'
import toVertify from '../index/toVertify'
import communitySelect from '../index/serviceScope'
import regionData from '../../assets/regions.json'
export default {
  name: '',
  components: {
    iHeader,
    toVertify,
    communitySelect
  },
  data: ()=> ({
    tab0: 0,
    tab1: 0,
    tab2: 0,
    businType: 1,
    subtitle: '',
    overline: '',
    realName: '',
    idcard: '',
    businessNum: '',
    hrCity: '',
    homeCity: '',
    homeAddress: '',
    communityName: '',
    communityId: '',
    behindImg: '',
    frontImg: '',
    businessImage: '',
    handImage: '',
    btnText: '重新修改',
    showToAuth: false,
    notTrue: false,
    showComunitySet: false,
    areaVisible: false,
    editable: false,
    holdIdCard: require('../../assets/img/index/holdIdCard.png'),
    inVertify: require('../../assets/img/index/InVertify.png'),
    baseData: {},
  }),
  computed: {
    authType(){
      return this.$store.state.user.authType
    },
    province(){
      return Object.keys(regionData)
    },
    city(){
      return  Object.keys(Object.values(regionData)[this.tab0])
    },
    area(){
      return  Object.values(Object.values(regionData)[this.tab0])[this.tab1]
    },
    columns(){
      return [
        {
          values: this.province,
          className: 'province',
          defaultIndex: this.tab0
        },
        {
          values: this.city,
          className: 'city',
          defaultIndex: this.tab1
        },
        {
          values: this.area,
          className: 'area',
          defaultIndex: this.tab2
        },
      ]
    },
    finalData(){
      return {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        homeCity: this['homeCity'],
        homeAddress: this['homeAddress'],
        communityId: this['communityId'],
        communityName: this['communityName']       
      }
    },
    backAble(){
      return !this.showToAuth&&!this.showComunitySet
    }
  },
  watch: {
    authType:{
      handler(val){
        if(val!=1){
          switch(val){
            case 0:
              this.subtitle = '请先完成身份实名认证'
              this.overline = '身份认证审核通过后，才能开始接单'
              break;
            case 2:
              this.subtitle = '身份认证成功'
              this.overline = '身份认证已通过，快去接单赚取收益'
              break;
            case 3:
              this.subtitle = '身份认证审核中'
              this.overline = '我们将会在24小时内审核，请耐心等待'
              break;
            case 4:
              this.subtitle = '身份认证失败'
              this.overline = '人证失败原因： 身份信息与身份证不匹配'
              break;
          }
        }else{
          this.init()
        }
      },
      immediate: true,
    },
    finalData: {
      handler(val){
        const strArr = ['auntId','homeCity','homeAddress','communityId','communityName','token']
        console.log(this.baseData);
        console.log(this.finalData);
        let theSame = strArr.every(res=>{
          return val[res] == this.baseData[res]
        })
        this.editable = !theSame
      }
    },
    backAble: {
      handler(val){
        if(val){
          document.addEventListener('backbutton',this.runBack,false)
        }else{
          document.removeEventListener('backbutton',this.runBack,false)

        }
      },
      immediate: true
    }
  },  
  beforeDestroy(){
      document.removeEventListener('backbutton',this.runBack,false)
  },
  // mounted(){
  //   document.addEventListener('backbutton',this.runBack,false)
  // },
  methods: {
    async init(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
      }  
      let res = await this.$http.get('/other/findAuntMess',{params}) 
      if(res.data.success){
        let obj = res.data.obj
        for(let x in obj){
          this[x] = obj[x]
        }
        this.baseData = {
          auntId: this.$store.state.user.auntId,
          token: this.$store.state.user.token,
          homeCity: obj['homeCity'],
          homeAddress: obj['homeAddress'],
          communityId: obj['communityId'],
          communityName: obj['communityName']
        }
      }   
    },
    btnClick(){
      console.log(this.baseData);
      console.log(this.finalData);
      if(!this.editable){
        this.$toast.warning('未作任何修改')
        return
      }

      console.log(this.finalData==this.baseData);
      
      this.$http.post('/other/updateSite',this.finalData)
      .then(res=>{
        if(res.data.success){
          this.$toast.success(res.data.msg)
          this.$emit('hide')
        }
      })

    },
    onConfirm(e){
      this.areaVisible = false
      this.homeCity = e.join('-')
    },
    onChange(picker) {
      this.tab0 = picker.getIndexes()[0]
      this.tab1 = picker.getIndexes()[1]
      this.tab2 = picker.getIndexes()[2]
    },
    setCommunity(e){
      this.showComunitySet=false
      console.log(e);
      this['communityId'] = e.communityId
      this['communityName'] = e.communityName
    }, 
    runBack(){
      this.$emit('hide')
    }   
  }
}
</script>

<style  lang="scss">
.userInfo-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.userInfoDetail{
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
            font-size: 18px;
            color: #000;
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

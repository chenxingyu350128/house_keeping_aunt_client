<template>
  <div class="toVertify-cpnt white pb-4">
    <iHeader @hide="$emit('hide')" text="实名认证"/>
    <!-- 第一页 -->
    <div class="pl-4">
      <div class="subtitle-2">服务类型:</div>
      <v-radio-group v-model="serviceType" row>
        <v-radio label="家政"></v-radio>
        <v-radio label="餐饮"></v-radio>
      </v-radio-group>
      <v-text-field
        v-model="cardName"
        class="subtitle-2 mt-0 pt-0"
        prefix="姓名："
        placeholder="请填写你的真实姓名，审核后无法修改"
      ></v-text-field>
      <v-text-field
        @click="getRegion(0)"
        v-model="hrCity"
        prefix="户籍地："
        class="subtitle-2 mt-0 pt-0"
        readonly
        placeholder="请填写你户口簿登记所在地"
      ></v-text-field>
      <v-text-field
        @click="getRegion(1)"
        v-model="homeCity"
        prefix="所在城市："
        class="subtitle-2 mt-0 pt-0"
        readonly
        placeholder="请选择您所在的城市"
      ></v-text-field>
      <div class="subtitle-2">家庭地址：</div>
      <textarea
        width="100%"
        class="subtitle-2 textIndent mt-0 py-2"
        v-model="homeAddress"
      ></textarea>        
      <!-- <v-text-field
        v-model="homeAddress"
        prefix="家庭住址："
        class="subtitle-2"
        placeholder="请填写您现在的具体居住地址"
      ></v-text-field> -->
      <v-text-field
        v-model="idcard"
        prefix="身份证号："
        class="subtitle-2 mt-0 pt-0"
        placeholder="请填写您的身份证号"
      ></v-text-field>
      <v-text-field
        v-if="serviceType"
        v-model="businessNum"
        prefix="营业执照注册号:"
        class="subtitle-2 mt-0 pt-0"
        placeholder="请填写营业执照注册号"
      ></v-text-field>
    </div>
    <div class="d-flex align-center justify-space-around mb-4 mt-2">
      <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
        <div @click="selectIdCard(0)" v-if="!front" class="flex-fill d-flex justify-center align-center">
          <v-icon small color="white">mdi-plus</v-icon>
          <span class="overline">添加身份证正面图片</span>
        </div>
        <v-img :src="front" v-else></v-img>
      </v-card>
      <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
        <div @click="selectIdCard(1)" v-if="!obverse" class="flex-fill d-flex justify-center align-center">
          <v-icon small color="white">mdi-plus</v-icon>
          <span class="overline">添加身份证反面图片</span>
        </div>
        <v-img :src="obverse" v-else></v-img>
      </v-card>
    </div>
    <div v-if="serviceType" class="d-flex align-center justify-space-around mb-12 mt-2">
      <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
        <div @click="selectBusinessCard(0)" v-if="!businessImage" class="flex-fill d-flex justify-center align-center">
          <v-icon small color="white">mdi-plus</v-icon>
          <span class="overline">添加清晰营业执照</span>
        </div>
        <v-img :src="businessImage" v-else></v-img>
      </v-card>
      <v-card dark grey lighten-1 class="d-flex" flat width="45vw"  height="25vw">
        <div @click="selectBusinessCard(1)" v-if="!handImage" class="flex-fill d-flex justify-center align-center">
          <v-icon small color="white">mdi-plus</v-icon>
          <span class="overline">添加手持营业执照</span>
        </div>
        <v-img :src="handImage" v-else></v-img>
      </v-card>
    </div>
    <v-footer class="pa-0 d-flex flex-column align-center" fixed bottom>
      <span class="caption primary--text">*请认真填写您的真实资料，审核通过后才可接单</span>
      <v-btn @click="preCommit" depressed block tile dark color="primary">{{serviceType?'提交审核':'下一步'}}</v-btn>
    </v-footer>
    <!-- 第二页 -->
    <!-- <div v-else class="px-6 subtitle-2">
      <div class="py-4">
        服务范围: ( <span class="grey--text overline">请选择您当前服务的小区</span> )
      </div>
      <v-radio-group class="pt-0 mt-0 areaScope" v-model="scope">

        <v-row width="100%" v-for="(item,i) in areaMap" :key="i">
          <v-col cols="12" class="subtitle-1 font-weight-bold py-2">{{item.areaName}}</v-col>
          <v-col v-for="(itm,idx) in item.map" :key="idx"  cols="6" class="subtitle-2 py-2">
            <v-radio class="caption" @change="radioChange(itm)" color="primary" :label="itm.communityName"></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <div class="caption text-center primary--text pb-5">*以上选项只能选择其中一个</div>
      <v-footer class="pa-0" fixed bottom>
        <v-btn @click="commit" depressed block tile dark color="primary">提交审核</v-btn>
      </v-footer>      
    </div> -->
    <!-- 图片选择方式弹窗 -->
    <v-bottom-sheet persistent  v-model="imagePathSelect">
      <v-sheet class="text-center pa-4">
        <v-btn @click="getImage(1)" class="mt-4" block color="info" dark>拍照</v-btn>
        <v-btn @click="getImage(0)" class="mt-4" block color="info" dark>从相册中选取</v-btn>
        <v-btn @click="imagePathSelect=false" class="mt-4" block outlined color="info" dark>取消</v-btn>
      </v-sheet>
    </v-bottom-sheet>  
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
    <communitySelect @getCommunity="setCommunity" @hide="showCommunitySelect=false" v-if="showCommunitySelect"/>  
  </div>
</template>

<script>

import iHeader from '../public/header'
import communitySelect from './serviceScope'
import regionData from '../../assets/regions.json'

export default {
  name: '',
  components: {
    iHeader,
    communitySelect
  },
  data: ()=> ({
    serviceType: 0,
    cardName: '',
    hrCity: '',
    homeCity: '',
    homeAddress: '',
    communityId: '',
    communityName: '',
    businessNum: '',
    idcard: '',
    obverse: 
    ''
    // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577340583205&di=7609d142c5031fef918af9933d5e30fc&imgtype=0&src=http%3A%2F%2Fcimg2.163.com%2Flady%2F2007%2F7%2F27%2F200707271548438080e.jpg'
    ,
    front: 
    ''
    // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577935374&di=2eb40c06ef43d6e4fe164e18dbd57a59&imgtype=jpg&er=1&src=http%3A%2F%2Ft-1.tuzhan.com%2Fcf4fcd8349af%2Fc-2%2Fl%2F2014%2F12%2F15%2F00%2F5962d22c5475438ead4925aebe044f33.jpg'
    ,
    businessImage: 
    ''
    // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577340467408&di=3b8b0001044f4fd843068d45dac16cfa&imgtype=0&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Ff2deb48f8c5494ee363cf7d12cf5e0fe98257ed8.jpg'
    ,
    handImage: 
    ''
    // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577340467406&di=6f5e08a13c05ad46909159928e0a4e7f&imgtype=0&src=http%3A%2F%2Fy3.ifengimg.com%2Ffashion_spider%2Fdci_2012%2F05%2Fdafd5e0223115655af5b466893693212.jpg'
    ,
    areaMap: null,
    showCommunitySelect: false,
    imagePathSelect: false,
    deal2ndImg: false,
    deal2ndBImg: false,
    dealBussinessImg: false,
    areaVisible: false,
    region2: false,
    postData: {},
    tab0: 0,
    tab1: 0,
    tab2: 0,
    scope: null

  }),
  computed:{
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
    hidable(){
      return !this.imagePathSelect&&!this.areaVisible&&!this.showCommunitySelect
    }
  },
  watch: {
    hidable: {
      handler(val){
        if(val){
          document.addEventListener('backbutton',this.runBack,false)
          document.removeEventListener('backbutton',this.hideCpnt,false)
        }else{
          document.addEventListener('backbutton',this.hideCpnt,false)
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
    hideCpnt(){
      if(this.imagePathSelect){
        this.imagePathSelect = false
      }
      if(this.areaVisible){
        this.areaVisible = false
      }
    },
    selectIdCard(e){
      this.dealBussinessImg = false
      this.deal2ndImg = !!e
      this.imagePathSelect = true
    },
    selectBusinessCard(e){
      this.dealBussinessImg = true
      this.deal2ndBImg = !!e
      this.imagePathSelect = true
    },
    radioChange(e){
      console.log(e);
      this.postData.communityName = e.communityName
      this.postData.communityId = e.communityId
    },

    getRegion(e){
      this.region2 = !!e
      this.areaVisible = true
    },
    onConfirm(e){
      this.areaVisible = false
      if(this.region2){
        this.homeCity = e.join('-')
      }else{
        this.hrCity = e.join('-')
      }
    },
    onChange(picker) {
      this.tab0 = picker.getIndexes()[0]
      this.tab1 = picker.getIndexes()[1]
      this.tab2 = picker.getIndexes()[2]
    },    
    getImage(i){
      const that = this
      this.imagePathSelect = false
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
      opt.fileName = 'id.jpg'
      opt.headers = {"token": this.$store.state.user.token}
      let uri = 'http://192.168.1.101:8092/housewife/home/real/fileUpload'
      ft.upload(
        avatar,
        encodeURI(uri),
        msg=>{
          console.log('success',msg);
          if(!this.dealBussinessImg){//身份证

            if(that.deal2ndImg){//区分正反面
              that.obverse = JSON.parse(msg.response).obj.url
            }else{
              that.front = JSON.parse(msg.response).obj.url
            }
          }else{//营业执照
            if(that.deal2ndBImg){//区分正反面
              that.businessImage = JSON.parse(msg.response).obj.url
            }else{
              that.handImage = JSON.parse(msg.response).obj.url
            }
          }
        },
        err=>{
          console.log('fail',err);
        },
        opt
      )
    },
    preCommit(){
      // 表单验证
      if(!this.cardName){
        this.$toast.error('请输入您的真实姓名')
        return
      }
      if(!this.idcard){
        this.$toast.error('请填写您的身份证号')
        return
      }
      if(!this.front){
        this.$toast.error('请上传您的身份证正面照片')
        return
      }
      if(!this.obverse){
        this.$toast.error('请上传您的身份证反面照片')
        return
      }
      //餐饮服务添加
      if(this.serviceType){
        if(!this.businessNum){
          this.$toast.error('请填写您的营业执照号')
          return
        }
        if(!this.businessImage){
          this.$toast.error('请上传您的营业执照照片')
          return
        }
        if(!this.handImage){
          this.$toast.error('请上传手持营业执照照片')
          return
        }          
      }
      let postData = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        businType: this.serviceType+1,
        idcard: this.idcard,
        cardName: this.cardName,
        frontImage: this.front,
        behindImage: this.obverse,
        homeAddress: this.homeAddress,
        hrCity: this.hrCity,
        homeCity: this.homeCity,
      }
      //区分服务类型
      if(!this.serviceType){
        this.postData = postData
        this.showCommunitySelect = true
      }else{
        Object.assign(
          postData,
          {
            businessNum: this.businessNum,
            businessImage: this.businessImage,
            handImage: this.handImage,
          }
        )
        this.addCaterCard(postData)
      }

    },
    async addCaterCard(data){
      let res = await this.$http.post('/home/real/addAuntCard',data)
      if(res.data.success){
        this.$toast.success(res.data.msg)
        this.$emit('hide')
      }      
    },
    setCommunity(e){
      console.log(e);
      
      this.postData['communityId'] = e.communityId
      this.postData['communityName'] = e.communityName
      this.commit()
    },
    async commit(){
      let res = await this.$http.post('/home/real/addAuntCard',this.postData)
      if(res.data.success){
        this.$toast.info(res.data.msg)
        this.$emit('hide')
      }
    }   
  }
}
</script>

<style  lang="scss">
.toVertify-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.textIndent{
  text-indent: 2em!important;
  width: 100%;
}
.areaScope{
  .v-radio{
    .v-label{
      white-space: nowrap!important;
    }
  }
}
</style>

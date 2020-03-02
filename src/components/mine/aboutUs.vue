<template>
  <div class="aboutUs-cpnt white">
    <iHeader @hide="$emit('hide')" text="关于我们"/>
    <div class="d-flex align-center flex-column py-6">
       <v-img  @click="showImageSelect=true" max-height="21.33vw" max-width="21.33vw" :src="logo"></v-img>
       <span class="caption my-2">管家婆服务端</span>
       <v-btn x-small outlined dark rounded color="primary">v{{version}}</v-btn>
    </div>
    <div class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>官方网站</span>

      <div  class="d-flex align-center caption">
        <span class="primary--text">http://www.yinaf.com</span>
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>客服电话</span>

      <div @click="phoneCall" class="d-flex align-center caption">
        <span class="primary--text">{{serviceTel}}</span>
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div @click="protocol" class="white px-6 py-2 d-flex align-center justify-space-between subtitle-2">
      <span>用户协议</span>

      <div class="d-flex align-center caption">
        <!-- <span class="primary--text">{{serviceTel}}</span> -->
        <v-icon class="ml-2" dense>mdi-chevron-right</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
import iHeader from '../public/header'
export default {
  name: '',
  components: {iHeader},
  data: ()=> ({
    logo: require('../../assets/img/ynfLogo.png'),
    version: '1.0.1',
    serviceTel: '0591-86393690'

  }),
  // mounted(){
  //   document.addEventListener('backbutton',this.runBack,false)
  // },
  // beforeDestroy(){
  //   document.removeEventListener('backbutton',this.runBack,false)
  // },
  methods: {
    phoneCall(){
      location.href='tel:' + this.serviceTel
    },
    // runBack(){
    //   this.$emit('hide')
    // },
    protocol(){
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
.aboutUs-cpnt{
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

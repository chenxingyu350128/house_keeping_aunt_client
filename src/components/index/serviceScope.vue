<template>
  <div class="serviceScope-cpnt grey lighten-3 px-4">
     <iHeader @hide="$emit('hide')" text="服务范围"/>
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
        <v-btn @click="commit" depressed block tile dark color="primary">{{commitDirect?'提交审核':'选择'}}</v-btn>
      </v-footer>       
  </div>
</template>

<script>
import iHeader from '../public/header'
export default {
  props: {
    commitDirect:{
      type: Boolean,
      default: true
    }
  },
  components: {iHeader},
  data: ()=> ({
    areaMap: [],
    scope: null,
    communityName: '',
    communityId: ''

  }),
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)
    this.findMap()
  },
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
  },
  methods:{
    runBack(){
      this.$emit('hide')
    },
    async findMap(){
      const params = {
        auntId: this.$store.state.user.auntId,
        token: this.$store.state.user.token,
        businType: this.$store.state.user.businType,
      }
      let res = await this.$http.get('/home/real/findMap',{params})
      this.areaMap = res.data.obj
    }, 
    radioChange(e){
      console.log(e);
      this.communityName = e.communityName
      this.communityId = e.communityId
    }, 
    commit(){
      if(this.scope==null){
        return
      }
      this.$emit(
        'getCommunity',
        { 
          communityId: this.communityId,
          communityName: this.communityName
        }
      )
      // let res = await this.$http.post('/home/real/addAuntCard',this.postData)
      // if(res.data.success){
      //   this.$toast.info(res.data.msg)
      //   this.$emit('hide')
      // }
    }     
  }
}
</script>

<style  lang="scss">
.serviceScope-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.areaScope{
  .v-radio{
    .v-label{
      white-space: nowrap!important;
    }
  }
}
</style>

<template class="BN">
  <v-bottom-navigation
    fixed
    height="50"
    grow
    v-if="active"
    color="#06C1AE"
  >
    <v-btn class="fillHeight" to='/index'>
      <span>首页</span>
      <v-icon>mdi-home-outline</v-icon>
    </v-btn>

    <v-btn class="fillHeight" to='/order'>
      <span>订单</span>
      <v-icon>mdi-clipboard-text-outline</v-icon>
    </v-btn>

    
    <v-btn class="fillHeight" to='/mine'>
      <span>我的</span>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
    export default {
        data: ()=>({
            active: true
        }),
        mounted(){
        },
        //非tabbar页隐藏底部导航栏
        watch:{
          $route: {
            handler: function(val){
              // console.log(this.$router.currentRoute.name)
              console.log(val);
              const name = val.name
              const toShow = name==='index'||name==='order'||name==='mine'
              this.active = toShow
            },
            // 深度观察监听
            deep: true
          }
        }
       
    }
</script>

<style lang="scss" scoped>
  .BN{
    z-index: 999;
  }
    .fillHeight{
      height: 100%!important;
    }
</style>



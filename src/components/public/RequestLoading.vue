<template >
  <transition name="fade-transform" mode="out-in">
    <div class="loadingShell" v-if="requestLoading">
       
      <v-avatar class="request-loading-component" size="100">
        <v-img  class="mdi-spin" src="../../assets/img/loading_out.png"></v-img>
      </v-avatar>
      <v-avatar size="60">
        <v-img  class="mdi-spin-reverse" src="../../assets/img/loading_inner.png"></v-img>
      </v-avatar>
      <!-- <v-progress-circular :size="50" color="blue" indeterminate></v-progress-circular> -->
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RequestLoading',
  computed: {
    ...mapGetters(['requestLoading'])
  }
}
</script>

<style lang="scss">
.loadingShell{
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 999999;
  &>*{
    position: fixed!important;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
}
@keyframes rotation {
  from{
    -webkit-transform: rotate(0);
  }
  to{
    -webkit-transform: rotate(360deg)
  }
}
@keyframes rotationReverse {
  from{
    -webkit-transform: rotate(360deg);
  }
  to{
    -webkit-transform: rotate(0)
  }
}
.mdi-spin{
  animation: rotation 2s linear infinite;
  -moz-animation: rotation 2s linear infinite;
  -webkit-animation: rotation 2s linear infinite;
  -o-animation: rotation 2s linear infinite;  
}
.mdi-spin-reverse{
  animation: rotationReverse 3s linear infinite;
  -moz-animation: rotationReverse 3s linear infinite;
  -webkit-animation: rotationReverse 3s linear infinite;
  -o-animation: rotationReverse 3s linear infinite;  
}
</style>
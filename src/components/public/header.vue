<!-- navBar -->
<template>
  <v-card class="header-cpnt" dark flat tile :color="bgc">
    <v-layout align-center>
      <v-flex @click="doSth" xs3>
        <v-icon large>mdi-chevron-left</v-icon>
      </v-flex>
      <v-flex xs6 class="d-flex justify-center subtitle-1">
				<!-- 针对中部复杂化的情况，使用slot则不使用props中的text -->
				<slot name="center"></slot>
				{{text}}
			</v-flex>
      <v-flex class="subtitle-2 text-center v-rating fill-height d-flex align-center justify-end pr-2"  @click="edit" xs3>
        <slot name="right"></slot>
        {{rightText}}
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default() {
        return ''
      }
    },
    rightText: {
      type: String,
      default() {
        return ''
      }
    },
    bgc:{
      type: String,
      default() {
        return 'primary'
      }
    },
    hideRef: {
      type: Boolean,
      default(){
        return false
      }
    }
  },
  methods: {
    doSth() {
      this.$emit('hide')
    },
    edit() {
      if(!this.rightText){
        return
      }
      this.$emit('edit')
    }
  }
}

</script>

<style lang='scss' scoped>
  .header-cpnt{
    z-index: 99;
    position: fixed!important;
    top: 0;
    left: 0;
    right: 0;
    >div{
      height: 45px;
      box-sizing: border-box;
    }
   .xiyu{
     font-size: 30px;
   }
  }

</style>

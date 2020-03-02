<!-- navBar -->
<template>
  <v-card class="header-cpnt" dark flat tile :color="bgc">
    <v-layout class="d-flex align-center justify-space-between px-1" align-center>
      <v-flex xs3>
        <!-- <v-icon large>mdi-chevron-left</v-icon> -->
      </v-flex>
      <v-flex xs3 class="d-flex justify-center subtitle-1">
				<!-- 针对中部复杂化的情况，使用slot则不使用props中的text -->
				<slot name="center"></slot>
				{{text}}
			</v-flex>
      <v-flex class="subtitle-2 text-center v-rating fill-height d-flex align-center justify-end"  @click="edit" xs3>
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
    // doSth() {
    //   this.$emit('doSomething')
    // },
    edit() {
      if(!this.rightText){
        return
      }
      this.$emit('edit')
    }
  }
}

</script>

<style lang='scss'>
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
  .v-text-field__details{
    display: none;
  }
  .v-input__slot{
    // background: #000;
    &:before,
    &:after{
      border: 0!important;
    }
   }
   .v-select__slot{
     display: inline-flex;
   }
   .v-select__selections{
     display: inline;
     flex: unset;
     justify-content: center;
     input[readonly]{
       display: none;
     }
     .v-input__append-inner{
       margin: 0!important;
       padding: 0;
     }
   }
</style>

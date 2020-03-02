<template>
  <div class="help-cpnt white">
    <iHeader @hide="$emit('hide')" text="帮助中心"/>
    <v-img height="34.4vw" :src="helpBanner">
      <div class="fill-height px-4 d-flex flex-column align-end justify-center">

        <span class="mb-0 subtitle-1">您好，很高兴为您服务！</span>
        <p class="mb-0 caption">人工客服：9:00-18:00(工作日)</p>
      </div>
    </v-img>
    <div class="subtitle-1 px-4 py-2">常见问题</div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item,i) in list"
        :key="i"
      >
        <v-expansion-panel-header>{{item.title}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          {{item.content}}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-footer fixed bottom class="pa-0 white">
      <div class="d-flex flex-fill justify-center grey--text caption mb-4">没有解决您的问题？点击下方的电话客服咨询</div>
      <v-btn @click="callService" dark depressed block tile color="primary">
        <v-icon>mdi-phone-in-talk</v-icon>{{serviceLine}}
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
import iHeader from '../public/header'
export default {
  name: '',
  components: {iHeader},
  data: ()=> ({
    list: [
      {
        title: '如何完成实名认证操作？',
        content: '填写姓名、户籍、家庭地址、身份证号、上传本人身份证正反面，选择服务范围提交审核即可。'
      },
      {
        title: '审核需要多久时间？',
        content: '工作日内1到3天审核完成。'
      },
      {
        title: '实名认证失败怎么办？',
        content: '重新填写信息，保证数据的一致性'
      },
      {
        title: '如何使用APP接单？',
        content: '先完成实名认证后，APP上方点击接单中，查看订单列表，选中要接单的订单，点击接单按钮，完成接单。'
      },
      {
        title: '如何完成家政人员订单？',
        content: '完成订单规定工作后，上传清洁图片，完成订单即可。'
      },
      {
        title: '如何完成配送人员订单？',
        content: '配送到目的地后，完成订单即可。'
      },
      {
        title: '如何提取收益？',
        content: '绑定微信，输入要提现的金额，验证账户信息，完成提现操作。(目前只能使用微信提现功能)'
      },
    ],
    helpBanner: require('../../assets/img/helpBanner.png'),
    serviceLine: '0591-86393690'

  }),
  mounted(){
    document.addEventListener('backbutton',this.runBack,false)
  },
  beforeDestroy(){
    document.removeEventListener('backbutton',this.runBack,false)
  },
  methods: {
    runBack(){
      this.$emit('hide')
    },
    callService(){
      location.href='tel:' + this.serviceLine
    }
  }
}
</script>

<style  lang="scss" scoped>
.help-cpnt{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 45px;
  overflow-y: auto;
  z-index: 100;
}
.pl44p{
  padding-left: 40%;
}
</style>

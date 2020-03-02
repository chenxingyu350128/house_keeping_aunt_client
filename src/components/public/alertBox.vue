<template>
  <v-dialog persistent class="alertBox-cpnt" v-model="showIt" max-width="290">
    <v-card>

      <v-card-title
        class="subtitle-1 font-weight-bold primary--text"
      >
          {{title}}
      </v-card-title>
      <v-card-text class="d-flex flex-column align-center py-4">
				<!-- <v-img class="mb-2" width="83" height="59" src="../../assets/img/innerDialog.png"></v-img>
        {{title}} -->
      </v-card-text>
      <v-card-actions class="d-flex">
        <v-btn class="flex-fill" color="primary darken-1" outlined  @click="$emit('cancel')">取消</v-btn>
        <v-btn dark class="flex-fill" color="primary darken-1"  @click="$emit('certain')">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props:{
    title:{
      type: String,
      required: true
    },
    showIt:{
      type: Boolean,
      default: false
    },
  }
}
</script>
<style lang="scss">
.alertBox-cpnt{
  z-index: 9999;
}
</style>

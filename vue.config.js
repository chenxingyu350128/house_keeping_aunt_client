module.exports = {
  publicPath: './',
  outputDir: './src-cordova/www',

  // // assetsDir: './',//相对outputDir
  //相对outputDir
  assetsDir: './',

  //相对outputDir
  indexPath: 'index.html',  
  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuetify: 'Vuetify',
      // 'chart.js': 'Chart',
      vuex: 'Vuex',
      // mockjs: 'Mock',
      'vue-router': 'VueRouter',
      lodash: '_'
    }
  },

  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  },

  lintOnSave: false
}

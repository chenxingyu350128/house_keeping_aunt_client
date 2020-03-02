// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import  http  from './utils/xhr.js'
import { Picker, DatetimePicker, List, Cell } from "vant";
import "vant/lib/index.css";
import VConsole from 'vconsole'
if (process.env.NODE_ENV === "production") {
  new VConsole();
}
Vue.config.productionTip = false
Vue.prototype.$http = http.api
Vue.use(Cell).use(Picker).use(DatetimePicker).use(List);
router.afterEach(() => {
  window.scrollTo(0, 0);
});

// pc端测试

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')

//deviceready
var onDeviceready = function () {
  document.addEventListener("jpush.receiveRegistrationId", function (event) {
    console.log(event);
    if (device.platform != "Android") {
      window.JPush.setApplicationIconBadgeNumber(0);
    }
  }, false)
  initiateUI();
}
function onOpenNotification() {
  // console.error('onOpenNotification')
}
function onReceiveNotification() {
  // console.error('onReceiveNotification')
}
function onReceiveMessage() {
  // console.error('onReceiveMessage')
}
function getRegistrationID() {
  console.log('获取jpushID');
  window.JPush.getRegistrationID(onGetRegistrationID);
};
function onGetRegistrationID(data) {
  try {
    console.log("JPushPlugin:registrationID is " + data);
    if (data.length == 0) {
      window.setTimeout(getRegistrationID, 1000);
    }
  }
  catch (exception) {
    console.log(exception);
  }
};
function initiateUI() {
  try {
    window.JPush.init();
    window.JPush.setDebugMode(true);
    window.setTimeout(getRegistrationID, 1000);
    window.setTimeout(function () {
      if (!localStorage.getItem('token')) {
        return//未登陆状态时，setAlias放在登陆页
      }
      console.warn('main.js的极光，token:' + localStorage.getItem('token'));

      window.JPush.setAlias({ sequence: 134, alias: localStorage.getItem('token') },
        (result) => {
          console.log('aliasSet:', result);

        }, (error) => {
          console.log('aliasFail:', error);

        }
      )
    }, 1000);
    window.plugins.jPushPlugin.setApplicationIconBadgeNumber('0')

    if (device.platform != "Android") {
      window.JPush.setApplicationIconBadgeNumber(0);
    }
  } catch (exception) {
    console.log(exception);
  }
}
document.addEventListener('deviceready', onDeviceready, false)
document.addEventListener("jpush.openNotification", onOpenNotification, false);
document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
window.document.addEventListener('deviceready',
  function () {
    //本地缓存
    // window.db = window.sqlitePlugin.openDatabase({
    //   name: 'ynf.db',
    //   location: 'default',
    // });
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
    // 设置手机状态栏颜色，与系统无关
    StatusBar.backgroundColorByHexString("#06C1AE");

    // if (cordova.platformId == 'android') {
    // }

  }
  , false
)


import Axios from "axios"
import qs from "querystring"
import store from '../store'
import vuetifyToast from "vuetify-toast"
import router from '../router'

const api = Axios.create({
  // baseURL : 'http://112.124.203.87:8090/yinaf',
  baseURL: 'http://192.168.1.101:8092/housewife',
  // baseURL: "http://192.168.1.101:8090/yinaf",
  timeout: 5000
});
// 请求拦截
api.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token")
    if (token) {
      config.headers = {
        token,
        // 'Content-Type': 'application/x-www-form-urlencoded'
      };
    }
    // if (process.env.NODE_ENV == 'production') {

    // }
    if (config.method === "post") {
      console.log(config.url);
      console.log(config.baseURL + '/mobile/user/sendMessage');
      if (config.url != "/mobile/user/sendMessage") {

        config.data = qs.stringify(config.data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      else {
        console.log('form-dataform-dataform-data');

        config.headers['Content-Type'] = 'multipart/form-data'
      }
      console.warn(config);

    }
    store.dispatch('SetLoading', true)
    // console.log(config);
    // console.log(config.url);
    return config;
  },
  function (err) {
    setTimeout(() => {
      store.dispatch('SetLoading', false)
    }, 300);
    return err;
  }
);
//响应处理,带token
api.interceptors.response.use(
  response => {
    if (response.data.code == 5107) {
      router.replace('/login')
      localStorage.clear()
    }
    if (response.data.code == 5120) {
      router.replace('/login')
      localStorage.clear()
    }
    if (response.data.code == 401) {
      router.replace('/login')
      localStorage.clear()
    }
    if (!response.data.success && response.data.code != '2019') {
      vuetifyToast.show({
        text: response.data.msg
      });
    }
    if (!response.data.success && response.data.code == '401') {
      vuetifyToast.show({
        text: response.data.msg + ' , 请重新登陆'
      });
    }
    setTimeout(() => {
      store.dispatch('SetLoading', false)
    }, 300);

    return response;
  },
  error => {
    // console.log(error);

    setTimeout(() => {
      store.dispatch('SetLoading', false)
    }, 300);
    // return Promise.resolve(error.response);
  }
);
api.all = Axios.all
export default { api };

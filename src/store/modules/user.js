// import router from 
const app = {
  state: {
    requestLoading: false,
    token: localStorage.getItem('token'),
    openId: localStorage.getItem('openId'),
    userName: localStorage.getItem('userName'),
    realName: localStorage.getItem('realName'),
    wechatType: JSON.parse(localStorage.getItem('wechatType')),
    businType: JSON.parse(localStorage.getItem('businType')),
    auntId: JSON.parse(localStorage.getItem('auntId')),
    authType: JSON.parse(localStorage.getItem('authType')),
    image: localStorage.getItem('image'),
    // guideAlready: false

  },
  mutations: {
    SET_LOADING: (state, status) => {
      state.requestLoading = !!status
    },
    USER_LOG_IN: (state, status) => {
      for(let x in status){
        state[x]=status[x]
        localStorage.setItem(x,status[x])
      }
      // this.$router.push('/index')
      console.log(state);
    },
    // GUIDE_DEAL: (state, status)=>{
    //   state.guideAlready = true
    //   localStorage.setItem('guideAlready',true)
    // },
    USER_LOG_OUT: (state, status) => {
      state.token = ''
      state.userName = ''
      state.realName = ''
      state.wechatType = ''
      state.businType = ''
      state.auntId = ''
      state.image = ''
      localStorage.clear()
      // localStorage.setItem('guideAlready',true)
      // state.guideAlready = true
    },
    // UPDATE_WXCHAT_TYPE: (state, status)=>{
    //   state.wechatType = status
    //   localStorage.setItem('wechatType',status)
    // },
    SET_USERNAME: (state, status)=>{
      state.userName = status
      localStorage.setItem('userName',status)
    },
    CHANGE_SINGLE_STATE: (state, status)=>{
      let x = status[0]
      let y = status[1]
      state[x] = y
      localStorage.setItem(x,y)
    },
  },
  actions: {
    SetLoading({ commit }, status) {
      commit('SET_LOADING', status)
    },
    userLogIn({ commit }, status){
      commit('USER_LOG_IN',status)
    }
  }
}

export default app
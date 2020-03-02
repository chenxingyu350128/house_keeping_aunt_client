const getters = {
  requestLoading: (state) => state.user.requestLoading,
  userInfo: (state)=>{
    let auntId = state.user.auntId
    let userImage = state.user.userImage
    let realName = state.user.realName
    let userName = state.user.userName
    let wechatType = state.user.wechatType
    let businType = state.user.businType
    let token = state.user.token
    return {
      auntId,
      userImage,
      realName,
      userName,
      wechatType,
      businType,
      token
    }
  }
}

export default getters
export default {
  setUserInfo(state, val) {
    state.userInfo.profile = val
  },
  setToken(state, val) {
    state.userInfo.token = val
  },
  setCookie(state, val) {
    state.userInfo.cookie = val
  },
  setLoginDialog(state, val) {
    state.loginDialogVisible = val
  },
  setLogin(state, val) {
    state.isLogin = val
  }
}

// userInfo: {
//   profile: null,
//   token: '',
//   cookie: ''

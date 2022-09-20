export default {
  namespaced: true,
  state() {
    return {
      loginDialogVisible: false, // 登录弹窗显示与隐藏
      isPlayed: false, // 当前播放状态
      playList: [], // 播放列表
      playIndex: 0, // 当前播放歌曲在播放列表的所有位置
      isShowPlayListTips: false // 添加及播放成功后，播放列表按钮提示的文字
    }
  },
  mutations: {
    setLoginDialog(state, val) {
      state.loginDialogVisible = val
    }
  },
  actions: {}
}

import util from '../../utils/util'
const conactPlayList = (addList, playList) => {
  return util.concatPlayList(
    addList.filter((item) => {
      return !item.vip && !item.license
    }),
    playList
  )
}
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
    },
    set_playStatus(state, val) {
      state.isPlayed = val
    },
    set_palyIndex(state, val) {
      state.playIndex = val
    },
    set_playList(state, val) {
      state.playList = val
    }
  },
  actions: {
    addList({ commit, state }, list) {
      const newList = conactPlayList(list, state.playList)
      commit('set_playList', newList)
    }
  }
}

import util from '../../utils/util'
// 合并歌曲到播放列表查重
const conactPlayList = (addList, playList) => {
  return util.concatPlayList(
    // filter过滤无版权及vip歌曲
    addList.filter((item) => {
      return !item.vip && !item.license
    }),
    playList
  )
}
// 当前歌曲在播放列表的索引
const findIndex = (list, playList) => {
  return playList.findIndex((d) => {
    return d.id === list.id
  })
}

export default {
  namespaced: true,
  state() {
    return {
      loginDialogVisible: false, // 登录弹窗显示与隐藏
      isPlayed: false, // 当前播放状态
      playList: [], // 播放列表
      playIndex: 0, // 当前播放歌曲在播放列表的所有位置
      isShowPlayListTips: false, // 添加及播放成功后，播放列表按钮提示的文字
      currentTime: 0
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
    },
    set_currentTime(state, val) {
      state.currentTime = val
    }
  },
  actions: {
    addList({ commit, state }, list) {
      const newList = conactPlayList(list, state.playList)
      commit('set_playList', newList)
    },
    selectPlay({ commit, state }, list) {
      const newList = conactPlayList(list, state.playList)

      commit('set_playList', newList)
      commit('set_playStatus', true)
      commit('set_palyIndex', findIndex(list[0], newList))
    },
    playAll({ commit }, list) {
      commit('set_playList', conactPlayList(list))
      commit('set_playStatus', true)
      commit('set_palyIndex', 0)
    }
  }
}

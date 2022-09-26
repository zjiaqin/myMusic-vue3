import { createStore } from 'vuex'
// 使用vuex-persistedstate插件来进行持久化
import createPersistedState from 'vuex-persistedstate'
// 引入模块
import user from './modules/user'
import player from './modules/player'

const store = createStore({
  modules: {
    user,
    player
  },
  plugins: [
    // 持久化插件配置
    createPersistedState({
      // 名称
      key: 'myMusicStore',
      // 持久化的模块
      paths: ['user', 'player.playList']
    })
  ]
})

export default store

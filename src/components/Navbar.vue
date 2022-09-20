<template>
  <header class="header">
    <div class="box"></div>

    <div class="container">
      <SearchC />
      <div class="user-avatar">
        <div class="to-login" v-if="!isLogin" @click="loginDialog()">
          <el-avatar>登录</el-avatar>
          点击登录
        </div>
        <div v-else class="is-login">
          <el-avatar
            class="avatar"
            :src="userInfo?.avatarUrl"
            @error="errorHandler"
          >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
          <span class="nickname">{{ userInfo?.nickname }}</span>
          <span class="set"><i class="iconfont icon-set"></i></span>
          <span class="quit" @click="logoutFn()">
            <i class="iconfont icon-quit"></i>
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import Search from './Search.vue'
import SearchC from './SearchC.vue'
import { logout } from '@/api'
import { computed } from 'vue'
import { useStore } from 'vuex'

const errorHandler = () => true
const store = useStore()

// 显示登录窗口的方法
const loginDialog = () => store.commit('player/setLoginDialog', true)

// 登出
const logoutFn = async () => {
  // 登出todo
  try {
    await logout()
    store.commit('user/clearAll')
    ElMessage.success('退出登录成功')
    return
  } catch (error) {
    return
  }
}
const isLogin = computed(() => {
  return store.state.user.token ? true : false
})

// 用户信息
const userInfo = computed(() => {
  return store.state.user.profile
})
</script>

<style lang="less">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-main);
  font-weight: 300;
  font-size: 14px;

  height: 100%;

  .box {
    flex: 1;
  }
  .container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 600px;
    margin-right: 30px;
    .user-avatar {
      margin-left: 15px;
      .to-login {
        cursor: pointer;
      }
      .is-login {
        display: flex;
        align-items: center;
        span {
          margin-left: 15px;
        }
        .iconfont {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

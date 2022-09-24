<template>
  <el-dialog
    width="30%"
    center
    v-model="loginDialogVisible"
    @closed="closeDialog(loginFormRef)"
  >
    <div class="login-wrapper">
      <h2>Welcome</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item label="" prop="phone">
          <el-input
            :prefix-icon="Iphone"
            v-model="loginForm.phone"
            placeholder="请输入网易音乐手机号登录"
          />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            :prefix-icon="Key"
            type="password"
            show-password
            v-model="loginForm.password"
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-form>
    </div>
    <span class="dialog-footer">
      <el-button bg plain type="info" @click="submitForm(loginFormRef)">
        登录
      </el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { Iphone, Key } from '@element-plus/icons-vue'
import { login, getUserInfo } from '@/api'
import { useStore } from 'vuex'
import { reactive, ref, computed } from 'vue'
const store = useStore()
const loginFormRef = ref(null)
const closeDialog = (loginFormRef) => {
  if (!loginFormRef) return
  store.commit('player/setLoginDialog', false)
  loginFormRef.resetFields()
}
const loginDialogVisible = computed(() => {
  return store.state.player.loginDialogVisible
})

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号不能为空'))
  }
  //使用正则表达式进行验证手机号码
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('手机号不正确'))
  }
  //自定义校验规则 需要调用callback()函数！
  callback()
}

const loginForm = reactive({
  phone: '',
  password: ''
})

const loginFormRules = reactive({
  phone: [
    {
      validator: validatePhone,
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
})

const submitForm = (loginFormRef) => {
  // 调用el表单的validate方法,，返回的是promise对象
  if (!loginFormRef) return

  loginFormRef.validate(async (valid) => {
    if (valid) {
      const { data: res } = await login(loginForm)
      if (res.code !== 200) {
        ElMessage.error(res.msg)
      } else {
        getUserDetailedInfo(res.profile.userId)
        store.commit('user/setToken', res.token)
        store.commit('user/setCookie', res.cookie)
        closeDialog(loginFormRef)
        ElMessage.success('登录成功')
        return
      }
    } else {
      return ElMessage.error('账号密码格式错误')
    }
  })
}

const getUserDetailedInfo = async (uid) => {
  const { data: res } = await getUserInfo(uid)
  if (res.code !== 200) {
    ElMessage.error(res.msg)
  } else {
    store.commit('user/setUserInfo', res.profile)
  }
}
</script>

<style lang="less" scoped>
.login-wrapper {
  h2 {
    height: 40px;
    text-align: center;
  }
  .el-input {
    margin: 0 30px;
  }
  .el-button {
    width: 100%;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
:deep(.el-button .el-button--info .is-plain .is-has-bg) {
  width: 100px;
}
</style>

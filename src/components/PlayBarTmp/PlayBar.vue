<template>
  <div class="play-bar-main">
    <transition name="fade-bar">
      <bar
        v-if="barType == 'Bar'"
        @changeBarType="changeBarType"
        @playAudioType="playAudioType"
        @playAudioMode="playAudioMode"
        @setvolumeProgress="setvolumeProgress"
        @setAudioProgress="setAudioProgress"
        @setVolumeHandler="setVolumeHandler"
      ></bar>
    </transition>
    <transition name="fade-minibar">
      <mini-bar
        v-if="barType == 'MiniBar'"
        @changeBarType="changeBarType"
        @playAudioType="playAudioType"
        @playAudioMode="playAudioMode"
        @setAudioProgress="setAudioProgress"
      ></mini-bar>
    </transition>

    <audio-box ref="audioRef" @setCurrentTime="setCurrentTime" />
  </div>
</template>

<script setup>
import AudioBox from './AudioBox.vue'
import Bar from './Bar.vue'
import MiniBar from './MiniBar.vue'

import { ref, provide, onMounted } from 'vue'
const audioRef = ref(null)

/*** */
// 播放栏组件规格参数、Bar\MiniBar,用于控制组件显示规格
const barType = ref('Bar')
const currentTime = ref(0)
const isChange = ref(false) //判断是进度条是否处于拖拽状态，用于解决拖拽时卡顿问题
/****** 播放栏子组件与本组件通信 ****/
// 改变播放栏显示规格
const changeBarType = (type) => {
  barType.value = type
}
//改变播放器的播放状态
const playAudioType = (state) => {
  audioRef.value.playAudioType(state)
}
//改变播放器循环模式：0循环、1单曲、2随机
const playAudioMode = (mode) => {
  audioRef.value.playAudioMode(mode)
}
//拖拽音量进度条
const setvolumeProgress = (progress) => {
  audioRef.value.setvolumeProgress(progress)
}
//改变静音开关
const setVolumeHandler = (state) => {
  audioRef.value.setVolumeHandler(state)
}
//拖拽播放进度条
const setAudioProgress = (time) => {
  audioRef.value.setAudioProgress(time)
}

/****** 播放器组件与本组件通信 ****/
//当前音频的播放时长
const setCurrentTime = (time) => {
  currentTime.value = time
}

/***通过provide 方法将当前播放时间传递出去，其他子组件需要使用的可以用inject方法接收，该方法有个特点就是原本通过props向子组件传递的数据数单项数据流，子组件不能修改，但通过这个方法可以从子组件进行数据的修改*/
provide('currentTime', currentTime)
provide('isChange', isChange)
</script>

<style lang="less" scoped>
.fade-bar-enter-active,
.fade-bar-leave-active,
.fade-minibar-enter-active,
.fade-minibar-leave-active {
  transition: all 0.3s ease;
}

.fade-bar-enter-from,
.fade-bar-leave-to,
.fade-minibar-enter-from,
.fade-minibar-leave-to {
  opacity: 0;
}
</style>

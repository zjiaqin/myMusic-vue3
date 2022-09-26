<template>
  <audio
    v-if="curSongInfo"
    ref="myAudio"
    preload="auto"
    @canplay="canplaySong"
    @playing="playSong"
    @ended="endedSong"
    @error="errorSong"
    @timeupdate="updateSongTime"
    :src="curSongInfo.url"
  ></audio>
</template>

<script setup>
import { ref, nextTick, computed, watch, inject } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const isChange = inject('isChange') //判断进度条是否被拖拽
const emit = defineEmits(['setCurrentTime'])
// 通过绑定myAuio到audio标签上获取播放器的DOM，需要注意在setup 执行在DOM挂载之前，所以不能直接获取到DOM,可以通过nextTick 和onMounted获得
const myAudio = ref(null)

/**播放器的工作参数*/
const initAudioReady = ref(false) // 是否完成初始化播放器
const playMode = ref(0) //播放模式 、 0循环播放、1单曲循环、2随机播放

/*** 获取从vuex中获取播放列表及当前播放音乐等状态*/
const playIndex = computed(() => {
  return store.state.player.playIndex
}) //当前播放音乐序号
const playList = computed(() => {
  return store.state.player.playList
}) //播放列表
const isPlayed = computed(() => {
  return store.state.player.isPlayed
}) //是否在播放
const curSongInfo = computed(() => {
  return playList.value[playIndex.value]
}) // 当前播放的音乐

/****播放器的操作方法*/
// 1、播放。暂停。上一曲。下一曲（play、prev、next）
const playAudioType = (type) => {
  if (type == 'play') {
    store.commit('player/set_playStatus', !isPlayed.value)
    store.commit('player/set_palyIndex', playIndex.value)
  } else {
    changeSong(type)
  }
}

//2、改变播放模式 （ 0循环播放、1单曲循环、2随机播放）
const playAudioMode = (type) => {
  console.log(type)

  playMode.value = type
}

// 3、改变播放器的音量volume(0-1) 、调整静音开关muted（false\true）
const setVolumeHandler = (val) => {
  myAudio.value.muted = val
}
const setvolumeProgress = (volume) => {
  myAudio.value.volume = volume
  // 当音量设置为零时打开静音开关
  myAudio.value.muted = volume ? false : true
}
//4、拖动进度条,手动设置播放位置
const setAudioProgress = (time) => {
  myAudio.value.currentTime = time
}

// 当音频准备就绪，播放器会触发canplay事件，将播放器转为初始化完成状态
const canplaySong = () => {
  initAudioReady.value = true
}

//音频播放时候 初始化状态
const playSong = () => {
  initAudioReady.value = true
  store.commit('player/set_playStatus', true)
}

// 音频播放结束，自动播放下一首
const endedSong = () => {
  if (playMode.value == 1) {
    //当循环模式为单曲循环（1）执行循环方法
    loopSong()
  } else {
    //否则的话播放下一首
    changeSong('next')
  }
}
// 手动切换歌曲   type: prev/next  上一首/下一首
const changeSong = (type) => {
  if (playList.value.length !== 1) {
    // 如果播放列表歌曲不为1
    let index = playIndex.value
    if (playMode.value == 2) {
      //当为随机播放模式
      index = Math.floor(Math.random() * playList.value.length - 1) + 1
    } else {
      if (type == 'prev') {
        // 当操作为上一首，当前播放曲目为第一首歌，则播放最后一首
        index = index == 0 ? playList.value.length - 1 : --index
      } else {
        // 当操作为下一首，当前播放曲目为最后一首歌，则播放第一首
        index = index >= playList.value.length - 1 ? 0 : ++index
      }
    }
    // 将播放器设置成准备状态，播放暂停，播放指针更改
    initAudioReady.value = false
    store.commit('player/set_playStatus', false)
    store.commit('player/set_palyIndex', index)
  } else {
    //当只有一首歌,循环
    loopSong()
  }
}

// 单曲循环歌曲
const loopSong = () => {
  myAudio.value.currentTime = 0
  myAudio.value.play()
  store.commit('player/set_playStatus', true)
}

// 更新音频时间的方法，调用方法触发事件可将当前时间传给父组件  ?考虑增加方法的适用性，无需传值，直接从myAudi.value获取当前时间
const updateSongTime = (e) => {
  if (!initAudioReady.value || isChange.value) return

  emit('setCurrentTime', e.target.currentTime)
}

watch(isPlayed, (playing) => {
  //播放器处在准备状态时，直接退出
  if (!initAudioReady.value) {
    return
  }
  nextTick(() => {
    if (myAudio.value) {
      playing ? myAudio.value.play() : myAudio.value.pause()
    }
  })
})

watch(
  curSongInfo,
  (newSong, oldSong) => {
    if (!newSong || (oldSong && newSong.id == oldSong.id)) return
    initAudioReady.value = false
    emit('setCurrentTime', 0)
    nextTick(() => {
      if (myAudio.value) {
        myAudio.value.play()
      }
    })
  },
  { deep: true }
)

defineExpose({
  playAudioType,
  playAudioMode,
  setvolumeProgress,
  setAudioProgress,
  setVolumeHandler
})
</script>

<style></style>

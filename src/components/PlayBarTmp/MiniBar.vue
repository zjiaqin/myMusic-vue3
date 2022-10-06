<template>
  <div class="playbar-mini" :class="isMini ? 'mini' : ''">
    <div class="image">
      <el-image
        :class="isPlayed ? 'active' : ''"
        @click="change()"
        :src="curSongInfo.album.picUrl + '?param=120y120'"
      ></el-image>
    </div>
    <div class="player">
      <div class="top">
        <span class="play-closed">
          <i class="iconfont icon-closed" @click="changeBarType"></i>
        </span>
        <span class="time">
          {{ curSongInfo.duration }}
        </span>
        <div class="bar-name">
          <router-link
            :to="{ path: '/song', query: { id: curSongInfo.id } }"
            class="song_name"
          >
            {{ curSongInfo.name }}
          </router-link>
          <p>
            <router-link
              :to="{ path: '/singer', query: { id: author.id } }"
              class="song_author"
              v-for="(author, k) in curSongInfo.singer"
              :key="author.name"
            >
              {{ k !== 0 ? ' / ' + author.name : author.name }}
            </router-link>
          </p>
        </div>
      </div>
      <div class="mid">
        <el-slider
          class="audioProgress"
          v-model="currentTime"
          :max="$utils.formatSongSecond(curSongInfo.duration)"
          :show-tooltip="false"
          @change="setAudioProgress"
          @mousedown="isChange = true"
          @mouseup="isChange = false"
        ></el-slider>
      </div>
      <div class="bottom">
        <div class="bar-control">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="上一首"
            placement="top"
          >
            <i
              class="iconfont icon-audio-prev"
              @click.stop="playAudioType('prev')"
              style="font-size: 18px"
            ></i>
          </el-tooltip>

          <i
            :class="['iconfont', playIcon]"
            @click.stop="playAudioType('play')"
            style="font-size: 25px"
          ></i>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="下一首"
            placement="top"
          >
            <i
              class="iconfont icon-audio-next"
              @click.stop="playAudioType('next')"
              style="font-size: 18px"
            ></i>
          </el-tooltip>
        </div>
        <!-- 改变播放模式面板 -->
        <div class="mode-btn">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="modeIcon.title"
            placement="top"
          >
            <i
              class="iconfont"
              :class="modeIcon.className"
              @click.stop="changePlayMode"
            ></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  provide
} from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { proxy } = getCurrentInstance()
const emit = defineEmits([
  'changeBarType',
  'playAudioType',
  'playAudioMode',
  'setAudioProgress'
])
const isChange = inject('isChange') //判断进度条是否处在拖拽动作中
const currentTime = inject('currentTime')

const playMode = ref(0) //播放模式

/***计算属性 */
const modeIcon = computed(() => {
  const params = [
    {
      className: 'icon-loop',
      title: '循环模式'
    },
    {
      className: 'icon-single-cycle',
      title: '单曲循环'
    },
    {
      className: 'icon-shuffle',
      title: '随机播放'
    }
  ]
  return params[playMode.value]
}) //计算属性，播放器的播放模式，用于鼠标悬停显示title
const playIcon = computed(() => {
  return !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause'
}) //计算属性，通过对isplay的监控，控制播放暂停图标的切换

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

/***播放器控制的方法 */
// 切换播放模式
const changePlayMode = () => {
  playMode.value = playMode.value >= 2 ? 0 : ++playMode.value
  emit('playAudioMode', playMode.value)
}
// 音频播放/暂停/上一首/下一首事件
const playAudioType = (type) => {
  emit('playAudioType', type)
}

// 点击拖拽进度条，设置当前时间
const setAudioProgress = () => {
  emit('setAudioProgress', currentTime.value)
  isChange.value = false
}

// 改变播放栏的规格 为mini
const changeBarType = () => {
  emit('changeBarType', 'Bar')
}

/** 改变mini播放器的大小*/
const isMini = ref(false)
const change = () => {
  isMini.value = !isMini.value
}
</script>

<style lang="less" scoped>
@keyframes soundPaying {
  from {
    -webkit-transform: rotate(10deg);
    transform: rotate(10deg);
  }

  to {
    -webkit-transform: rotate(370deg);
    transform: rotate(370deg);
  }
}

.playbar-mini {
  overflow: hidden;
  box-sizing: border-box;
  width: 350px;
  height: 100px;
  padding: 0 10px;

  position: fixed;
  z-index: 99;
  bottom: 80px;
  right: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 5px 5px rgba(127, 127, 127, 0.2);
  background: #fff;
  display: flex;
  transition: all 0.5s ease-in-out;

  &.mini {
    padding: 0 5px;
    width: 100px;
    background: transparent;
  }
  .image {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-image {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      cursor: pointer;
      animation: soundPaying 15s linear infinite;
      animation-play-state: paused;
      &.active {
        animation-play-state: running;
      }
    }
  }
  .player {
    flex: 1;
    margin: 10px;
    .iconfont {
      cursor: pointer;
    }
    .top {
      position: relative;
      .song_name {
        font-weight: 700;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      p {
        margin-top: 4px;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .song_author {
        color: var(--color-text);
        font-size: 12px;
      }
      .play-closed {
        position: absolute;
        top: 0;
        right: 0;
      }
      .time {
        color: var(--color-text);
        font-size: 12px;
        position: absolute;
        bottom: -5px;
        right: 0;
      }
    }
    .mid {
      .audioProgress {
        height: 20px;
        :deep(.el-slider__bar) {
          background: var(--color-text-height);
          border-radius: 4px;
          height: 4px;
        }
        /* 进度条背景样式 */
        :deep(.el-slider__runway) {
          height: 4px;
        }
        /* 拖拽圆点样式 */
        :deep(.el-slider__button) {
          background-color: var(--color-text-height);
          border: 1px;
          height: 10px;
          width: 10px;
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bar-control {
        display: flex;
        align-items: center;
        width: 80px;
        justify-content: space-between;
      }
    }
  }
}
</style>

<template>
  <div
    :class="['play-bar', lockName]"
    v-if="curSongInfo"
    @mouseenter="enterBar($event)"
    @mouseleave="leaveBar($event)"
  >
    <!-- 固定播放栏按钮 -->
    <div class="fold">
      <div class="fold-btn" @click="lockBar">
        <i class="iconfont icon-lock" :class="[locked ? 'active' : '']"></i>
      </div>
    </div>
    <!--  -->
    <!-- 播放进度条，采用el-slider组件-->
    <el-slider
      class="audioProgress"
      v-model="currentTime"
      :max="$utils.formatSongSecond(curSongInfo.duration)"
      :show-tooltip="false"
      @change="setAudioProgress"
      @mousedown="isChange = true"
      @mouseup="isChange = false"
    ></el-slider>
    <!-- 播放栏主体 -->
    <div class="wrapper">
      <div class="play-bar-inside">
        <!-- 左侧歌曲信息 -->
        <div class="bar-l">
          <router-link :to="{ path: '/song', query: { id: curSongInfo.id } }">
            <el-image
              class="bar-cover-img"
              :src="curSongInfo.album.picUrl + '?param=120y120'"
            ></el-image>
          </router-link>
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
          <div class="bar-time">
            <span>{{ $utils.formatSongTime(currentTime * 1000) }}</span>
            / {{ curSongInfo.duration }}
          </div>
        </div>
        <!-- 中部操作面板 -->
        <div class="bar-m">
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
              ></i>
            </el-tooltip>

            <i
              :class="['iconfont', playIcon]"
              @click.stop="playAudioType('play')"
              style="font-size: 30px"
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
              ></i>
            </el-tooltip>
          </div>
        </div>
        <!-- 右侧参数面板 -->
        <div class="bar-r">
          <div class="bar-oper">
            <!-- 音量面板 -->
            <div class="volume-main">
              <i
                :class="['iconfont', mutedIcon]"
                title="音量"
                @click.stop="setVolumeHandler"
              ></i>
              <el-slider
                class="volumeProgress"
                v-model="volumeNum"
                max="100"
                :show-tooltip="false"
                @change="setvolumeProgress"
              ></el-slider>
            </div>
            <!-- 改变播放模式面板 -->
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
            <!-- 歌词弹出框 -->
            <el-popover
              placement="top"
              :width="400"
              trigger="click"
              @hide="popverClose"
            >
              <template #reference>
                <div class="lyric">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="歌词"
                    placement="top"
                  >
                    <span class="lyric-btn" title="歌词" @click="popverHandle">
                      词
                    </span>
                  </el-tooltip>
                </div>
              </template>
              <div class="lyrics-container">
                <h3 class="lyrics-header">
                  <span>歌词</span>
                </h3>
                <lyrics
                  :sId="curSongInfo.id"
                  :currentTime="currentTime"
                ></lyrics>
              </div>
            </el-popover>
            <!-- 播放列表弹出框 -->
            <el-popover
              placement="top"
              :width="550"
              trigger="click"
              @hide="popverClose"
            >
              <template #reference>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="播放列表"
                  placement="top"
                >
                  <div class="playlist" @click="popverHandle">
                    <i class="iconfont icon-playsong" title="播放列表"></i>
                    <div class="playlist-num">
                      {{ 99 > playList.length ? playList.length : '99+' }}
                    </div>
                  </div>
                </el-tooltip>
              </template>
              <div class="playlist-container">
                <h3 class="playlist-header">
                  <span>
                    播放列表
                    <em>(共{{ playList.length }}首)</em>
                  </span>
                  <div class="delSonglist" @click="clearSonglist">
                    <i class="iconfont icon-del"></i>
                    清空列表
                  </div>
                </h3>
                <song-list
                  :songList="playList"
                  :isScroll="true"
                  :height="400"
                  :typeSize="'mini'"
                  :isShowTips="false"
                ></song-list>
              </div>
            </el-popover>
            <!-- 改变播放器规格 -->
            <el-tooltip
              class="box-item"
              effect="dark"
              content="mini模式"
              placement="top"
            >
              <i class="iconfont icon-m" @click="changeBarType"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Lyrics from '@/components/Lyrics.vue'
import SongList from '@/components/SongList.vue'

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
  'setvolumeProgress',
  'setAudioProgress',
  'setVolumeHandler'
])

/****播放栏的参数 ****/
/** isLock、lockName、locked 考虑到弹出框需要影响播放栏，及播放栏延迟关闭的功能，所以需要通过三个参数来操作播放栏的显示效果*/
const isLock = ref(false) //用于JS中的逻辑判断
const locked = ref(false) //用于改变锁定按钮的样式
const lockName = ref('active') //用于改变播放器的显示和隐藏

const isChange = inject('isChange') //判断进度条是否处在拖拽动作中

const currentTime = inject('currentTime')

const isMuted = ref(false) // 是否静音
const playMode = ref(0) //播放模式
const volumeNum = ref(100) //音量值
const oldVolume = ref(0) // 静音前的音量值,用于取消静音时恢复成该音量

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
const mutedIcon = computed(() => {
  return isMuted.value ? 'icon-volume-active' : 'icon-volume'
})
const timer = null //定时器，用于延时隐藏播放栏

onBeforeUnmount(() => {
  clearTimeout(timer)
}) //组件销毁时，需要清除定时器。！！！

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
//
// 音量静音及取消操作 isMuted 为true时，播放器静音
const setVolumeHandler = () => {
  isMuted.value = isMuted.value ? false : true
  isMuted.value && (oldVolume.value = volumeNum.value)
  volumeNum.value = isMuted.value ? 0 : oldVolume.value
  emit('setVolumeHandler', isMuted.value)
}
// 音量调节
const setvolumeProgress = () => {
  isMuted.value = !volumeNum.value ? true : false

  emit('setvolumeProgress', volumeNum.value / 100)
}

// 改变播放栏的规格 为mini
const changeBarType = () => {
  emit('changeBarType', 'MiniBar')
}

// 点击锁定按钮锁定播放栏
const lockBar = () => {
  locked.value = !locked.value
  isLock.value = locked.value
  leaveBar()
}
// 鼠标进入及离开播放栏
const enterBar = () => {
  clearTimeout(timer)
  isLock.value = true
  lockName.value = 'active'
}
const leaveBar = () => {
  if (!isLock.value) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      lockName.value = ''
    }, 3000)
  }
}
// 点击具有弹出框的图标事件
const popverHandle = () => {
  isLock.value = true
}
// 弹框关闭 触发的事件
const popverClose = () => [(isLock.value = false)]

// 清空播放列表
const clearSonglist = () => {
  store.commit('player/set_playStatus', false)
  store.commit('player/set_playList', [])
  store.commit('player/set_palyIndex', 0)
}
provide('isChange ', isChange)
</script>

<style lang="less" scoped>
.wrapper {
  max-width: 1300px;
  margin: 0 auto;
  .iconfont {
    cursor: pointer;
    font-size: 20px;
  }
}
.play-bar {
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  height: 70px;
  .fold {
    position: absolute;
    top: -40px;
    right: 150px;
    .fold-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 30px;
      background-color: #fff;
      border-radius: 50px 50px 0px 0px;
      cursor: pointer;
      .active {
        color: var(--color-text-height);
      }
    }
  }
  .audioProgress {
    position: absolute;
    top: -18px;
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
      height: 12px;
      width: 12px;
    }
  }
  .play-bar-inside {
    display: flex;
    height: 70px;
    justify-content: space-between;
    align-items: center;
    .bar-l {
      display: flex;
      align-items: center;
      .bar-cover-img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        margin-right: 30px;
      }
      .bar-name {
        height: 70px;
        width: 150px;
        margin: 20px 20px 0 0;
        .song_name {
          font-size: 14px;
          font-weight: 700;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
        }
        p {
          margin-top: 14px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
        }
        .song_author {
          font-size: 12px;
          color: var(--color-text);
        }
      }
      .bar-time {
        height: 70px;
        line-height: 70px;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.4);
      }
    }
    .bar-m {
      display: flex;
      .bar-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 150px;
        .iconfont {
          font-size: 22px;
          transition: all 0.3s linear;
          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
    .bar-r {
      .bar-oper {
        display: flex;
        align-items: center;
        .volume-main {
          display: flex;
          align-items: center;
          margin-right: 18px;
          .volumeProgress {
            width: 100px;
            margin-left: 18px;
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
              height: 12px;
              width: 12px;
            }
          }
        }
        .lyric-btn {
          margin: 0 18px;
          font-size: 18px;
          color: var(--color-text);
        }
        .playlist {
          position: relative;
          margin-right: 18px;
          .playlist-num {
            position: absolute;
            top: -4px;
            right: -5px;
            color: var(--color-text);
          }
        }
      }
    }
  }
}
</style>

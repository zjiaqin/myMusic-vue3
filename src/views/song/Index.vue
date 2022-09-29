<template>
  <div class="container" v-if="songInfo">
    <div class="main">
      <div class="info">
        <div class="song-basic">
          <div class="song-info">
            <div class="panel">
              <div class="info-top">
                <div class="song-name">
                  {{ songInfo.name }}
                  <router-link
                    class="mv-name"
                    :to="{ path: '/mvlist/mv', query: { id: songInfo.mvId } }"
                    v-if="songInfo.mvId"
                  >
                    <i class="iconfont icon-mvlist"></i>
                  </router-link>
                  <i v-if="songInfo.vip" class="iconfont icon-vip"></i>
                </div>
                <p>
                  <router-link
                    :to="{ path: '/singer', query: { id: author.id } }"
                    class="song-author"
                    v-for="(author, k) in songInfo.singer"
                    :key="author.name"
                  >
                    {{ k !== 0 ? ' / ' + author.name : author.name }}
                  </router-link>
                </p>
                <p class="song-related">
                  <span>
                    专辑：
                    <router-link
                      class="song-album"
                      :to="{ path: '/album', query: { id: songInfo.album.id } }"
                    >
                      {{ songInfo.album.name }}
                    </router-link>
                  </span>
                  <span>
                    发行时间：
                    <em>{{ songInfo.publishTime }}</em>
                  </span>
                </p>
                <div class="cover-desc" v-if="coverDesc">
                  <h5>专辑简介</h5>
                  <p>{{ coverDesc }}</p>
                </div>
              </div>
              <div class="info-bottom">
                <div class="song-oper">
                  <span
                    :class="['play-btn', 'play-all', songDisable]"
                    @click="playSong(songInfo)"
                  >
                    <i :class="['iconfont', playFontIcon]"></i>
                    {{ songInfo.vip ? 'VIP尊享' : '立即播放' }}
                  </span>
                  <span class="play-btn play-collect" @click="showAddList">
                    <i class="iconfont icon-collect"></i>
                    收藏
                  </span>
                  <span class="play-btn play-comment" @click="jumpComment">
                    <i class="iconfont icon-comment"></i>
                    评论
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="song-similar">
            <div class="panel">
              <div class="simi-title">相似歌曲</div>
              <div class="simi-main">
                <div
                  class="simi-item"
                  v-for="simiItem in simiSongInfo"
                  :key="simiItem.id"
                >
                  <div class="simi-info">
                    <router-link
                      class="simi-name"
                      :to="{
                        path: '/song',
                        query: { id: simiItem.id }
                      }"
                    >
                      {{ simiItem.name }}
                    </router-link>
                    <div class="simi-author">
                      <router-link
                        :to="{ path: '/singer', query: { id: author.id } }"
                        class="song-author"
                        v-for="(author, k) in simiItem.singer"
                        :key="author.name"
                      >
                        {{ k !== 0 ? ' / ' + author.name : author.name }}
                      </router-link>
                    </div>
                  </div>
                  <div class="simi-song-status">
                    <i v-if="simiItem.vip" class="iconfont icon-vip"></i>
                    <i
                      v-else
                      @click="playSong(simiItem)"
                      :class="['iconfont', playSimiIcon(simiItem)]"
                    ></i>
                    <i class="iconfont icon-add"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="song-lyric">
          <div class="panel">
            <div class="lyric-title">歌词</div>
            <div class="lyric-main">
              <lyrics :sId="curSongInfo.id" :currentTime="currentTime"></lyrics>
            </div>
          </div>
        </div>
      </div>
      <div class="comment">
        <!-- <div class="panel"></div> -->
      </div>
    </div>
    <div class="right-side">
      <div class="player">
        <div class="panel">
          <div
            class="cover-img"
            :class="isCurSong ? 'active' : ''"
            @click="playSong(songInfo)"
          >
            <img src="/src/assets/img/stylus.png" class="cover-stylus" />
            <el-image class="pic" :src="songInfo.album.picUrl"></el-image>
          </div>
        </div>
      </div>
      <div class="list-similar">
        <div class="panel">
          <div class="title">包含这首歌的歌单</div>
          <div class="main-list">
            <router-link
              class="item"
              :to="{ path: '/playlist/detail', query: { id: item.id } }"
              v-for="item in simiList"
              :key="item.id"
            >
              <el-image class="lit-pic" :src="item.coverImgUrl"></el-image>
              <div class="playlist-info">
                <div class="playlist-name">{{ item.name }}</div>
                <div class="playlist-author">
                  By.{{ item.creator.nickname }}
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Lyrics from '@/components/Lyrics.vue'
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  computed,
  watch
} from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { songDetail, simiSong, simiPlayList } from '@/api/home.js'
const router = useRouter()
const route = useRoute()
const store = useStore()
const { proxy } = getCurrentInstance()
// 数据
const sID = ref(route.query.id) //歌曲ID
const songInfo = ref(null) //单曲信息
const simiSongInfo = ref([]) //相似歌曲
const simiList = ref([]) //相似歌单

const cBox = ref(null)

const coverDesc = ref([])
// 若无版权，及vip歌曲 播放按钮变成灰色
const songDisable = computed(() => {
  if (songInfo.license || songInfo.vip) {
    return 'disable'
  } else {
    return ''
  }
})
// 当前音乐是否在播放状态
const isCurSong = computed(
  () =>
    isPlayed.value &&
    curSongInfo.value &&
    curSongInfo.value.id == songInfo.value.id
)
// 当前音乐播放状态图标
const playFontIcon = computed(() =>
  isCurSong.value ? 'icon-audio-pause' : 'icon-audio-play'
)
// 相似音乐播放状态图标
const playSimiIcon = computed(() => {
  return function (item) {
    return curSongInfo.value &&
      String(item.id) === curSongInfo.value.id &&
      isPlayed.value
      ? 'icon-audio-pause'
      : 'icon-audio-play'
  }
})

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

const currentTime = computed(() => {
  return store.state.player.currentTime
})
// 获取歌曲的详细信息
const getSongDetail = async (id) => {
  const { data: res } = await songDetail(id)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  res.songs[0].license = !res.privileges[0].cp
  songInfo.value = proxy.$utils.formatSongs(res.songs, res.privileges)[0]
  coverDesc.value = songInfo.value.alia.join(' / ')
}
// 获取相似音乐
const getSimiSong = async (id) => {
  const { data: res } = await simiSong({ id })
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }

  simiSongInfo.value = res.songs.map((item) => {
    return {
      id: String(item.id),
      name: item.name,
      mvId: item.mvid,
      singer: item.artists,
      album: item.album,
      alia: item.alias,
      duration: proxy.$utils.formatSongTime(item.duration),
      url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      vip: item.fee === 1,
      license: !item.privilege.cp,
      publishTime: item.publishTime
    }
  })
}
// 获取包含歌曲的歌单 simiList
const getSimiPlayList = async (id) => {
  const { data: res } = await simiPlayList({ id })
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  simiList.value = res.playlists
}
// 跳转至评论区
const jumpComment = () => {
  cBox.value.scrollIntoView(true)
}

const playSong = (song) => {
  //如果当前未在播放歌曲，或播放的非当前歌曲，则播放该歌曲
  if (!curSongInfo.value || curSongInfo.value.id !== song.id) {
    if (song.license) {
      ElMessage.error('由于版权保护，您所在的地区暂时无法使用。')
      return
    }
    if (song.vip) {
      ElMessage.error('付费歌曲，请在网易云音乐播放')
    }

    store.dispatch('player/selectPlay', [song])
  } else {
    store.commit('player/set_playStatus', !isPlayed.value)
  }
}

const init = () => {
  if (sID.value) {
    getSongDetail(sID.value)
    getSimiSong(sID.value)
    getSimiPlayList(sID.value)
  }
}
// 组件加载从新获取id，并初始化数据
onMounted(() => {
  sID.value = route.query.id
  init()
})
// 路由变化从新获取id，并初始化数据
onBeforeRouteUpdate((to) => {
  sID.value = to.query.id
  init()
})
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
.panel {
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #fff;
  min-height: 80px;
  padding: 20px;
  margin-bottom: 20px;
}
.container {
  display: flex;
  .main {
    margin-right: 20px;
    flex: 1;
    .info {
      display: flex;

      .song-basic {
        margin-right: 20px;
        flex: 4;
        .song-info {
          .panel {
            height: 320px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .info-top {
              .song-name {
                font-size: 25px;
                font-weight: 700;
                margin: 5px 0 20px 0;
                .iconfont {
                  margin-right: 10px;
                  font-size: 24px;
                  color: var(--color-text-height);
                }
              }
              .song-author {
                display: block;
                font-size: 18px;
                color: var(--color-text);
                margin-bottom: 15px;
              }
              .song-related {
                font-size: 13px;
                span {
                  display: block;
                  color: var(--color-text);
                  margin-bottom: 5px;
                  em {
                    font-style: normal;
                    color: #000;
                  }
                }
              }
              .cover-desc {
                h5 {
                  font-size: 14px;
                  font-weight: normal;
                  color: var(--color-text);
                }

                p {
                  width: 100%;
                  font-size: 14px;
                  color: var(--color-text-main);
                  line-height: 21px;
                  word-break: break-all;
                }
              }
            }
            .info-bottom {
              .song-oper {
                .play-btn {
                  display: inline-block;
                  line-height: 16px;
                  align-items: center;
                  border-radius: 50px;
                  padding: 7px 15px;
                  cursor: pointer;
                  margin: 5px 15px 5px 0;
                  background: #f0f0f0;
                  color: var(--color-text-main);
                }

                .play-all {
                  color: #fff;
                  background: var(--color-text-height);
                  i {
                    color: #fff;
                  }
                }

                .disable {
                  background: #ccc;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
        .song-similar {
          .panel {
            height: 300px;
            overflow: hidden;
            .simi-title {
              font-size: 16px;
              font-weight: 700;
              padding-left: 6px;
              margin-bottom: 6 px;
              border-left: 4px solid var(--color-text-height);
            }
            .simi-main {
              .simi-item {
                height: 32px;
                border-bottom: 1px solid rgba(199, 193, 193, 0.277);
                padding: 8px 0;

                display: flex;
                justify-content: space-between;
                align-items: center;
                .simi-info {
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  font-size: 12px;
                  .song-author {
                    color: var(--color-text);
                  }
                }
                .simi-song-status {
                  .iconfont {
                    font-size: 16px;
                    margin-left: 10px;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
      .song-lyric {
        flex: 5;
        .panel {
          height: 640px;
          text-align: center;

          .lyric-title {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 18px;
          }
          .lyric-main {
            height: 560px;
            overflow: scroll;
          }
        }
      }
    }
  }
  .right-side {
    width: 350px;
    .player {
      .panel {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cover-img {
        position: relative;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: url(/src/assets/img/disc.png);
        background-size: contain;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .pic {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          animation: soundPaying 15s linear infinite;
          animation-play-state: paused;
        }
        .cover-stylus {
          position: absolute;
          top: 0px;
          right: 10px;
          transform-origin: 23px 5px;
          transition: all 0.3s;
          transform: rotateZ(-25deg);
        }
        &.active {
          .cover-stylus {
            transform: rotateZ(0);
          }

          .pic {
            animation-play-state: running;
          }
        }
      }
    }
    .list-similar {
      .panel {
        height: 300px;
        overflow: hidden;
        .title {
          font-size: 16px;
          font-weight: 700;
          padding-left: 6px;
          margin-bottom: 10px;
          border-left: 4px solid var(--color-text-height);
        }
        .main-list {
          .item {
            height: 60px;
            padding: 10px 0;
            display: flex;
            align-items: center;
            .lit-pic {
              width: 60px;
              height: 60px;
              border-radius: 8px;
            }
            .playlist-info {
              flex: 1;
              box-sizing: border-box;
              display: flex;
              padding: 4px 0 4px 8px;
              height: 100%;
              flex-direction: column;
              justify-content: space-between;
              .playlist-name {
                &:hover {
                  color: var(--color-text-height);
                }
              }
              .playlist-author {
                font-size: 13px;
                color: var(--color-text);
              }
            }
          }
        }
      }
    }
  }
}
</style>

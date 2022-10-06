<template>
  <div class="detail">
    <div class="detail-container">
      <div class="detail-main">
        <div class="main-top">
          <div class="detail-faceImg panel">
            <el-image class="image" :src="details.coverImgUrl"></el-image>
          </div>
          <div class="detail-info panel">
            <div class="cover-top">
              <div class="cover-title">
                <div class="list-name">
                  {{ details.name }}
                </div>
                <div class="cover-collect-author">
                  <router-link
                    class="collect-author"
                    :to="{ path: '/singer', query: { id: item.userId } }"
                    v-for="item in collects"
                    :key="item.userId"
                  >
                    <el-image :src="item.avatarUrl"></el-image>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="cover-mid">
              <div class="cover-author" v-if="details.creator">
                <el-image
                  :src="details.creator.avatarUrl"
                  class="cover-avatar"
                ></el-image>
                <div class="cover-name">{{ details.creator.nickname }}</div>
                <div class="cover-date">
                  {{ $utils.formartDate(details.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
              <div class="cover-digital">
                <span class="cover-playCount">
                  <i class="iconfont icon-playnum"></i>
                  {{ $utils.formartNum(details.playCount) }}次
                </span>
                <span class="cover-collect">
                  <i class="iconfont icon-collect"></i>
                  {{ $utils.formartNum(details.subscribedCount) }}
                </span>
                <span class="cover-comment">
                  <i class="iconfont icon-comment"></i>
                  {{ $utils.formartNum(details.commentCount) }}
                </span>
              </div>
            </div>
            <div class="cover-down">
              <h4>歌单简介</h4>
              <p v-html="details.description"></p>
            </div>
          </div>
        </div>
        <div class="detail-list panel">
          <div class="list-head">
            <div class="left">
              <span class="title">歌曲列表</span>
              <span class="num">{{ total + '首歌' }}</span>
            </div>
            <div class="right">
              <span class="btn-playAll" @click="playAllSongs">
                <i class="iconfont icon-audio-play"></i>
                播放全部
              </span>
              <span class="btn-fav">
                <i class="iconfont icon-collect"></i>
                收藏
              </span>
            </div>
          </div>
          <div class="list-main" v-loading="isLoading">
            <song-list :songList="songList" :stripe="true"></song-list>
            <div class="showAllSongsTips" v-if="!isLogin">
              <span @click="loginDialog">登录后查看全部歌曲</span>
            </div>
          </div>
        </div>
      </div>
      <div class="aside-box">
        <div class="playlist-recom" v-if="simiList.length">
          <h3 class="aside-title">相关歌单推荐</h3>
          <div class="aside-main recom-main">
            <router-link
              class="recom-item"
              :to="{ path: '/playlist/detail', query: { id: item.id } }"
              v-for="item in simiList"
              :key="item.id"
            >
              <el-image :src="item.coverImgUrl"></el-image>
              <div class="recom-info">
                <div class="recom-name">{{ item.name }}</div>
                <div class="recom-author">
                  By.
                  <router-link
                    :to="{ path: '/user', query: { id: item.creator.userId } }"
                  >
                    {{ item.creator.nickname }}
                  </router-link>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="playlist-comment" v-if="listComment.length">
          <h3 class="aside-title">歌单评论</h3>
          <div class="aside-main comment-main">
            <div
              class="comment-item"
              v-for="item in listComment"
              :key="item.commentId"
            >
              <router-link
                :to="{ path: '/user', query: { id: item.commentId } }"
              >
                <el-image :src="item.user.avatarUrl"></el-image>
              </router-link>
              <div class="comment-info">
                <div class="comment-userInfo">
                  <router-link
                    :to="{ path: '/user', query: { id: item.commentId } }"
                    class="comment-name"
                  >
                    {{ item.user.nickname }}
                  </router-link>
                  <span class="comment-date">
                    {{ $utils.formatMsgTime(item.time) }}
                  </span>
                </div>
                <div class="comment-desc">{{ item.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SongList from '@/components/SongList.vue'
import {
  playlistdetail,
  playlistSCollect,
  playlistRelated,
  playlistComment,
  songDetail
} from '@/api/playlist.js'
import { ref, getCurrentInstance, onMounted, watchEffect, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()

/***歌单数据 */
const listId = ref(0)
const details = ref([])
const listInfo = ref([])
const songList = ref([])
const total = ref(0)
const isLoading = ref(true)

const collects = ref([])
const simiList = ref([])
const listComment = ref([])
const isLogin = computed(() => {
  return store.state.user.token ? true : false
})

// 登录及未登录下获取歌单中歌曲的列表
const getListDetail = async (data) => {
  isLoading.value = true
  const { data: res } = await playlistdetail(data)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  details.value = res.playlist

  if (isLogin.value) {
    const ids = res.playlist.trackIds
    getAllSongs(ids)
  } else {
    songList.value = proxy.$utils.formatSongs(
      res.playlist.tracks,
      res.privileges
    )
    total.value = songList.value.length
    isLoading.value = false
  }
}

// 获取全部的歌曲详情
const getAllSongs = async (ids) => {
  const sliceArr = []
  const num = 500
  let idsArr = []

  for (let index = 0; index < ids.length; index += num) {
    sliceArr.push(ids.slice(index, index + num))
  }
  for (let i = 0; i < sliceArr.length; i++) {
    const arrs = []
    sliceArr[i].map((item) => {
      arrs.push(item.id)
    })
    isLoading.value = true
    const { data: res } = await songDetail({
      ids: arrs.join(','),
      timestamp: new Date().valueOf() + i
    })
    if (res.code !== 200) {
      return ElMessage.error('获取数据失败')
    }
    idsArr = idsArr.concat(proxy.$utils.formatSongs(res.songs, res.privileges))
  }
  songList.value = idsArr
  total.value = songList.value.length
  isLoading.value = false
}
// 相关歌单推荐
const getRecom = async (data) => {
  const { data: res } = await playlistRelated(data)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  simiList.value = res.playlists
}

// 歌单精彩评论
const getComment = async (data) => {
  const { data: res } = await playlistComment(data)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  listComment.value = res.comments
}
// 获取歌单收藏者
const getCollect = async (data) => {
  const { data: res } = await playlistSCollect(data)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  collects.value = res.subscribers
}
// 播放列表为当前歌单的全部歌曲
const playAllSongs = () => {
  store.dispatch('player/playAll', songList.value)
}
// 点击弹出登录窗口
const loginDialog = () => {
  store.commit('player/setLoginDialog', true)
}

// 初始化
const initialize = (id) => {
  getListDetail({ id: id, s: 8 })
  getComment({ id: id, limit: 9, offset: 0, before: 0 })
  getRecom({ id: id })
  getCollect({ id: id, limit: 8, offset: 0 })
}

onMounted(() => {
  listId.value = route.query.id
  initialize(listId.value)
})

onBeforeRouteUpdate((to) => {
  listId.value = route.query.id
  initialize(listId.value)
})
</script>

<style lang="less" scoped>
.panel {
  background-color: #fff;
  border-radius: 12px;
}

.detail-container {
  display: flex;
  .detail-main {
    flex: 1;
    .main-top {
      display: flex;
      margin-bottom: 20px;
      .detail-faceImg {
        .image {
          width: 250px;
          height: 250px;
          border-radius: 12px;
        }
      }
      .detail-info {
        flex: 1;
        height: 210px;
        margin: 0 0 0 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .cover-top {
          .cover-title {
            display: flex;
            justify-content: space-between;
            .list-name {
              font-size: 24px;
              font-weight: 700;
            }
            .cover-collect-author {
              width: 200px;
              text-align: right;
              .collect-author {
                position: relative;
                display: inline-block;
                width: 25px;
                height: 25px;
                border-radius: 100%;
                overflow: hidden;
                margin: 3px 0 0 -15px;
                border: 1px solid #fff;
                vertical-align: top;
                &:hover {
                  z-index: 1;
                  border: 1px solid var(--color-text-height);
                }
              }
            }
          }
        }
        .cover-mid {
          .cover-author {
            display: flex;
            align-items: center;
            .cover-avatar {
              width: 30px;
              height: 30px;
              border-radius: 50%;
            }
            .cover-name {
              margin-left: 10px;
            }
            .cover-date {
              margin-left: 20px;
              color: var(--color-text);
            }
          }
          .cover-digital {
            margin-top: 12px;
            color: var(--color-text);
            .cover-collect {
              margin-left: 18px;
            }
            .cover-comment {
              margin-left: 18px;
            }
          }
        }
        .cover-down {
          h4 {
            font-size: 14px;
          }
          p {
            margin-top: 10px;
            color: var(--color-text);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .detail-list {
      padding: 20px;

      .list-head {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-weight: 700;
          font-size: 20px;
        }
        .num {
          margin-left: 15px;
          font-size: 12px;
        }
        .btn-playAll {
          cursor: pointer;
          padding: 7px 18px;
          background: var(--color-text-height);
          border-radius: 50px;
          color: #fff;
          .iconfont {
            color: #fff;
          }
        }
        .btn-fav {
          cursor: pointer;
          margin-left: 18px;
          padding: 7px 18px;
          background: rgba(203, 201, 201, 0.4);
          border-radius: 50px;
        }
      }
      .showAllSongsTips {
        height: 30px;
        width: 100%;
        background-color: var(--color-text-height);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-top: 20px;
        border-radius: 15px;
        cursor: pointer;
      }
    }
  }
}
.aside-box {
  .playlist-recom,
  .playlist-comment {
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  }

  .aside-title {
    position: relative;
    font-size: 16px;
    line-height: 24px;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 18px;
      margin: 3px 5px 0 0;
      border-radius: 2px;
      background: var(--color-text-height);
      vertical-align: top;
    }
  }
}
.recom-main {
  .el-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
  }

  .recom-item {
    display: flex;
    padding: 10px 0;
  }

  .recom-info {
    flex: 1;
    padding-left: 10px;
  }

  .recom-name {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    cursor: pointer;
  }

  .recom-author {
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
    font-size: 12px;
    color: var(--color-text);

    a {
      color: #666;
    }
  }
}

.comment-main {
  font-size: 0;

  .el-image {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
  }

  .comment-item {
    display: flex;
    padding: 10px 0;
  }

  .comment-info {
    flex: 1;
    padding-left: 10px;
  }

  .comment-userInfo {
    width: 100%;
    font-size: 0;
  }

  .comment-name {
    font-size: 14px;
    line-height: 14px;
    font-weight: bold;
  }

  .comment-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.6;
    padding: 5px 10px;
    background: #f5f5f5;
    margin: 5px 0;
    border-radius: 3px;
  }

  .comment-date {
    display: inline-block;
    padding-left: 5px;
    font-size: 12px;
    color: #666;
  }
}
</style>

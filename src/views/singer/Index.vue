<template>
  <div class="singer">
    <div class="singer-container">
      <div class="singer-main">
        <div class="singer-tab">
          <div
            class="tab-item"
            v-for="item in listType"
            :key="item.type"
            @click="selectType(item.type)"
            :class="item.type == currentType ? 'active' : ''"
          >
            {{ item.text }}
          </div>
        </div>
        <div class="main-top">
          <div class="singer-faceImg panel">
            <el-image
              class="image"
              :src="singerDesc.info.picUrl + '?param=250y250'"
            ></el-image>
          </div>
          <div class="singer-info panel">
            <div class="cover-top">
              <div class="cover-title">
                {{ singerDesc.info.name }}
              </div>
            </div>
            <div class="cover-mid">
              <div class="cover-digital">
                <span class="cover-songCount">
                  单曲
                  <em>{{ singerDesc.info.musicSize }}</em>
                  首
                </span>
                <span class="cover-albumCount">
                  专辑
                  <em>{{ singerDesc.info.albumSize }}</em>
                  张
                </span>
                <span class="cover-MVCount">
                  MV
                  <em>{{ singerDesc.info.mvSize }}</em>
                  首
                </span>
              </div>
            </div>
            <div class="cover-down">
              <h4>歌手简介</h4>
              <em
                class="desc-close"
                v-if="isShowDesc"
                @click="isShowDesc = false"
              >
                <i class="iconfont icon-closed"></i>
              </em>
              <p @click="showAllDesc">{{ singerDesc.desc }}</p>
              <pre class="desc-all" v-if="isShowDesc">
 {{ singerDesc.desc }}
              </pre>
            </div>
          </div>
        </div>
        <div class="singer-list panel">
          <div class="list-head">
            <div class="left">
              <span class="title" v-if="currentType == 'song'">
                热门歌曲列表
              </span>
              <span class="title" v-else-if="currentType == 'album'">
                专辑列表
              </span>
              <span class="title" v-else>MV列表</span>
            </div>
            <div class="right"></div>
          </div>
          <div class="list-main">
            <song-list
              :songList="songList"
              v-if="currentType == 'song'"
              :stripe="true"
              :pageSize="10"
            ></song-list>
            <div
              v-else
              class="wrapper infinite-list"
              v-infinite-scroll="loadMore"
              :infinite-scroll-disabled="disabled"
              infinite-scroll-distance="100"
              :infinite-scroll-delay="500"
            >
              <album-list
                v-if="currentType == 'album'"
                class="album"
                :albumList="singerList"
              />
              <mv-list class="mv" :mvList="singerList" v-else />
              <div class="loading" v-loading="ls_loading"></div>
              <p class="noMore" v-if="noMore">没有更多了</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { artistDesc, artists, artistMv, artistAlbum } from '@/api/artist.js'
import SongList from '@/components/SongList.vue'
import AlbumList from '@/components/AlbumList.vue'
import MvList from '@/components/MvList.vue'
import { topListDetail, listDetail } from '@/api/rank.js'
import {
  ref,
  getCurrentInstance,
  onMounted,
  reactive,
  watch,
  computed
} from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()

const noMore = ref(true)
const ls_loading = ref(true)
const disabled = computed(() => {
  return ls_loading.value || noMore.value
})
const listType = [
  { type: 'song', text: '歌曲' },
  { type: 'album', text: '专辑' },
  { type: 'MV', text: 'MV' }
]

const currentType = ref('song')
const isShowDesc = ref(false)
const singerDesc = reactive({
  desc: '',
  info: ''
})
const songList = ref([])
const singerList = ref([])
const params = reactive({
  id: 0,
  limit: 24,
  offset: 0
})

// 获取歌手详情
const getSingerDesc = async (id) => {
  const { data: res } = await artistDesc({ id })
  if (res.code !== 200) {
    return
  }
  singerDesc.desc = res.briefDesc
}

// 获取歌手热门歌曲
const getSingerHotSong = async (id) => {
  const { data: res } = await artists({ id })
  if (res.code !== 200) {
    return
  }
  singerDesc.info = res.artist
  songList.value = res.hotSongs.map((item) => {
    return {
      id: String(item.id),
      name: item.name,
      mvId: item.mv,
      singer: item.ar,
      album: item.al,
      alia: item.alia,
      duration: proxy.$utils.formatSongTime(item.dt),
      url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      vip: item.fee === 1,
      license: !item.privilege.cp,
      publishTime: item.publishTime
    }
  })

  ls_loading.value = false
}

// 获取歌手专辑
const getSingerAlbum = async (param) => {
  const { data: res } = await artistAlbum(param)

  singerList.value =
    param.offset == 0 ? res.hotAlbums : [...singerList.value, ...res.hotAlbums]
  noMore.value = !res.more
  ls_loading.value = false
}

// 获取歌手MV
const getSingerMv = async (param) => {
  const { data: res } = await artistMv(param)
  const newArr = res.mvs.map((item) => {
    return { ...item, cover: item.imgurl }
  })
  singerList.value =
    param.offset == 0 ? newArr : [...singerList.value, ...newArr]
  noMore.value = !res.hasMore
  ls_loading.value = false
}
// 下拉加载更多
const loadMore = () => {
  params.offset = singerList.value.length
}

// 选择类型
const selectType = (type) => {
  router.push({ path: '/singer', query: { id: params.id, type: type } })
}

// 简介查看更多
const showAllDesc = () => {
  if (singerDesc.desc.length > 120) {
    isShowDesc.value = !isShowDesc.value
  }
}
watch(currentType, (newVal, oldVal) => {
  params.offset = 0
  singerList.value = []
  if (newVal == 'album') {
    getSingerAlbum(params)
  } else if (newVal == 'MV') {
    getSingerMv(params)
  }
})
watch(
  params,
  (newVal, oldVal) => {
    if (currentType.value == 'album') {
      ls_loading.value = true
      getSingerAlbum(params)
    } else if (currentType.value == 'MV') {
      ls_loading.value = true
      getSingerMv(params)
    }
  },
  { deep: true }
)

const init = () => {
  params.offset = 0
  songList.value = []
  singerList.value = []
  getSingerDesc(params.id)
  getSingerHotSong(params.id)
  if (currentType.value == 'album') {
    getSingerAlbum(params)
  } else if (currentType.value == 'MV') {
    getSingerMv(params)
  }
}

onBeforeRouteUpdate((to) => {
  params.id = to.query.id || 0
  currentType.value = to.query.type || 'song'
})

onMounted(() => {
  params.id = route.query.id || 0
  currentType.value = route.query.type || 'song'
  init()
})
</script>

<style lang="less" scoped>
.panel {
  background-color: #fff;
  border-radius: 12px;
}

.singer-container {
  margin-left: -150px;
  .singer-main {
    position: relative;
    z-index: 1;
    margin: 0 auto;
    width: 70%;
    min-height: 400px;
    .singer-tab {
      position: absolute;
      top: 30px;
      z-index: -1;
      right: -50px;
      .tab-item {
        position: relative;
        right: 0px;
        cursor: pointer;
        background: #fff;
        height: 45px;
        width: 80px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        margin-bottom: 20px;
        padding: 0 10px;
        text-align: right;
        line-height: 45px;
        font-size: 15px;
        box-shadow: 4px 5px 5px 0px rgba(100, 100, 100, 0.1);
        transition: right 0.3s linear;

        &.active {
          background: var(--color-text-height);
          color: #fff;
          right: -20px;
          padding: 0 15px 0 0;
        }
      }
    }
    .main-top {
      display: flex;
      margin-bottom: 20px;
      .singer-faceImg {
        .image {
          width: 250px;
          height: 250px;
          border-radius: 12px;
          :deep(.el-image__inner) {
            object-fit: cover;
          }
        }
      }
      .singer-info {
        flex: 1;
        height: 210px;
        margin-left: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .cover-top {
          .cover-title {
            font-size: 24px;
            font-weight: 700;
            span {
              display: inline-block;
              margin-left: 10px;
              font-size: 14px;
              font-weight: 400;
              color: var(--color-text);
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
            span {
              margin-right: 10px;
            }
          }
        }
        .cover-down {
          h4 {
            font-size: 14px;
          }
          .desc-close {
            position: absolute;
            top: 30px;
            right: 0;
            cursor: pointer;
          }
          p {
            display: -webkit-box;
            line-height: 22px;
            font-size: 14px;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre-line;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            word-break: break-all;
            cursor: pointer;
          }
          .desc-all {
            position: absolute;
            top: 70px;
            left: 10px;
            z-index: 1;
            width: calc(~'100% - 20px');
            padding: 10px;
            margin: -10px;
            max-height: 250px;
            line-height: 22px;
            font-size: 14px;
            white-space: pre-line;
            font-family: inherit;
            color: #999;
            background: #fff;
            overflow-y: scroll;
            box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
          }
        }
      }
    }
    .singer-list {
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
      }
      .list-main {
        :deep(.albumlist) {
          @w: calc(((@mainWidth + 150px) * 0.7 - 100px) / 4);
          .faceImg {
            .image {
              flex: 110;
              .calcHeight(@w, 314.167, 110);
            }
            .info {
              .info_name {
                font-size: 14px;
                padding: 10% 10px 10px 30px;
              }
              .info_artist {
                font-size: 14px;
                padding-left: 30px;
              }
              .tag {
                display: none;
              }
            }
          }
        }
        :deep(.playlist) {
          @w: calc(((@mainWidth + 150px) * 0.7 - 280px) / 6);
          .item {
            .faceImg {
              .calcHeight(@w, 1024, 1024);
              .image {
                .calcHeight(@w, 1024, 1024);
              }
              .playCount {
                padding: 6px 10px 6px 0px;
                font-size: 12px;
                .iconfont {
                  font-size: 12px;
                }
              }
            }
          }
        }
        :deep(.mv-list) {
          @w: calc(((@mainWidth + 150px) * 0.7 - 140px) / 6);
          .item {
            .faceImg {
              .calcHeight(@w,1024,1024 );
              .image {
                .el-image__inner {
                  object-fit: cover;
                }
              }
            }
          }
        }
      }
    }
  }
  .singer-aside {
    width: 300px;
  }
  .noMore {
    text-align: center;
    color: var(--color-text);
  }
}
</style>

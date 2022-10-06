<template>
  <div class="search-container">
    <div class="search-main">
      <div class="search-tab">
        <div
          class="tab-item"
          :class="item.k == params.type ? 'active' : ''"
          v-for="item in listType"
          :key="item.k"
          @click="selectType(item.k)"
        >
          {{ item.v }}
        </div>
      </div>
      <div class="search-list">
        <div class="search-heard">
          <span class="title">搜索结果</span>
          <span class="count">
            {{
              '(' +
              searchCount +
              listType.find((item) => item.k == params.type).t +
              ')'
            }}
          </span>
        </div>
        <div class="search-body">
          <song-list
            v-if="params.type == 1"
            :songList="searchList"
            :stripe="true"
            :offset="offset"
            :pageSize="params.limit"
          />
          <album-list
            class="album"
            v-else-if="params.type == 10"
            :albumList="searchList"
          />
          <artist-item
            v-else-if="params.type == 100"
            :artistList="searchList"
          />
          <play-list
            class="play"
            :playList="searchList"
            v-else-if="params.type == 1000"
          />
          <mv-list
            class="mv"
            :mvList="searchList"
            v-else-if="params.type == 1004"
          />
        </div>
        <div class="search-footer" v-if="searchCount > params.limit">
          <el-pagination
            @current-change="currentChange"
            :current-page="currentpage"
            :page-size="params.limit"
            layout="prev, pager, next"
            :total="searchCount"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SongList from '@/components/SongList.vue'
import AlbumList from '@/components/AlbumList.vue'
import PlayList from '@/components/PlayList.vue'
import MvList from '@/components/MvList.vue'

import { cloudsearch } from '@/api/search.js'
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const listType = [
  { k: 1, v: '单曲', t: '首单曲' },
  { k: 10, v: '专辑', t: '张专辑' },
  { k: 100, v: '歌手', t: '个歌手' },
  { k: 1000, v: '歌单', t: '个歌单' },
  { k: 1004, v: 'MV', t: '个MV' }
]
const params = reactive({
  keywords: '',
  limit: 24,
  offset: 0,
  type: '1'
})
const searchList = ref([])
const searchCount = ref(0)
const currentpage = ref(0)
//获取搜索结果
const getSearchList = async (param) => {
  const { data: res } = await cloudsearch(param)
  if (res.code !== 200) {
    return ElMessage.error(res.msg)
  }
  if (param.type == 1) {
    searchList.value = res.result.songs.map((item) => {
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
    searchCount.value = res.result.songCount || 0
  } else if (param.type == 10) {
    searchList.value = res.result.albums || []
    searchCount.value = res.result.albumCount || 0
  } else if (param.type == 100) {
    searchList.value = res.result.artists || []
    searchCount.value = res.result.artistCount || 0
  } else if (param.type == 1000) {
    searchList.value = res.result.playlists || []
    searchCount.value = res.result.playlistCount || 0
  } else if (param.type == 1004) {
    searchList.value = res.result.mvs || []
    searchCount.value = res.result.mvCount || 0
  } else if (param.type == 1014) {
    searchList.value = res.result.videos || []
    searchCount.value = res.result.videoCount || 0
  }
}
// 选择搜索类别
const selectType = (k) => {
  router.push({
    path: '/search',
    query: { key: params.keywords, type: k }
  })
}
// 下一页
const currentChange = (page) => {
  params.offset = (page - 1) * params.limit
  currentpage.value = page
  getSearchList(params)
}

const init = () => {
  searchList.value = []
  searchCount.value = 0
  getSearchList(params)
}
onBeforeRouteUpdate((to) => {
  params.type = to.query.type || 1
  params.offset = 0
  init()
})

onMounted(() => {
  params.keywords = route.query.key
  params.type = route.query.type || 1
  init()
})
</script>

<style lang="less" scoped>
.search-container {
  margin-left: -150px;
  .search-main {
    position: relative;
    margin: 0 auto;
    width: 70%;
    min-height: 400px;
    background: #fff;
    border-radius: 12px;
    .search-tab {
      position: absolute;
      top: 80px;
      right: -80px;
      .tab-item {
        cursor: pointer;
        background: #fff;
        height: 45px;
        width: 80px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        line-height: 45px;
        font-size: 15px;
        box-shadow: 4px 5px 5px 0px rgba(100, 100, 100, 0.1);
        &.active {
          background: var(--color-text-height);
          color: #fff;
        }
      }
    }
    .search-list {
      padding: 20px;
      .search-heard {
        margin-top: 10px;
        font-size: 22px;
        font-weight: 700;
        .count {
          margin-left: 10px;
          font-size: 14px;
          font-weight: normal;
          color: var(--color-text);
        }
      }
      .search-body {
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
}
</style>

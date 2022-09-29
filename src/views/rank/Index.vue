<template>
  <div class="rank">
    <div class="rank-container">
      <div class="rank-main">
        <div class="main-top">
          <div class="rank-faceImg panel">
            <el-image class="image" :src="rankInfo.coverImgUrl"></el-image>
          </div>
          <div class="rank-info panel">
            <div class="cover-top">
              <div class="cover-title">
                {{ rankInfo.name }}
                <span>
                  ({{ $utils.formartDate(rankInfo.updateTime, 'MM月dd日') }}
                  更新)
                </span>
              </div>
            </div>
            <div class="cover-mid">
              <div class="cover-author" v-if="rankInfo.creator">
                <el-image
                  :src="rankInfo.creator.avatarUrl"
                  class="cover-avatar"
                ></el-image>
                <div class="cover-name">{{ rankInfo.creator.nickname }}</div>
                <div class="cover-date">
                  {{ $utils.formartDate(rankInfo.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
              <div class="cover-digital">
                <span class="cover-playCount">
                  <i class="iconfont icon-playnum"></i>
                  {{ $utils.formartNum(rankInfo.playCount) }}次
                </span>
                <span class="cover-collect">
                  <i class="iconfont icon-collect"></i>
                  {{ $utils.formartNum(rankInfo.subscribedCount) }}
                </span>
                <span class="cover-comment">
                  <i class="iconfont icon-comment"></i>
                  {{ $utils.formartNum(rankInfo.commentCount) }}
                </span>
              </div>
            </div>
            <div class="cover-down">
              <h4>歌单简介</h4>
              <p v-html="rankInfo.description"></p>
            </div>
          </div>
        </div>
        <div class="rank-list panel">
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
          </div>
        </div>
      </div>
      <div class="rank-aside">
        <div class="aside-menu">
          <span
            class="panel"
            :class="type === 'Top' ? 'active' : ''"
            @click="selectType('Top')"
          >
            <em>TOP榜</em>
          </span>
          <span
            class="panel"
            :class="type === 'Feature' ? 'active' : ''"
            @click="selectType('Feature')"
          >
            <em>特色榜</em>
          </span>
          <span
            class="panel"
            :class="type === 'Other' ? 'active' : ''"
            @click="selectType('Other')"
          >
            <em>场景榜</em>
          </span>
        </div>
        <div class="aside-item">
          <div
            class="type-item panel"
            :class="rId == item.id ? 'active' : ''"
            v-for="item in list"
            :key="item.id"
            @click="selectItem(item)"
          >
            <div class="item-info">
              <div class="item-name">
                {{ item.name }}
              </div>
              <div class="updata-time">
                {{ item.updateFrequency }}
              </div>
            </div>
            <el-image class="item-image" :src="item.coverImgUrl"></el-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SongList from '@/components/SongList.vue'
import { topListDetail, listDetail } from '@/api/rank.js'
import { ref, getCurrentInstance, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const store = useStore()
/***榜单分类*/
const listTop = ref([]) //云音乐TOP榜
const listFeature = ref([]) //云音乐特色榜
const listOther = ref([]) //其他场景榜
/***当前榜单数据 */
const list = ref([])
const type = ref('Top')
const rId = ref(0)
const rankInfo = ref([])
const songList = ref([])
const total = ref(0)
const isLoading = ref(true)

//获取榜单分类
const getTopListDetail = async () => {
  const { data: res } = await topListDetail()
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  // 云音乐TOP榜
  listTop.value = res.list.filter((item) => {
    return item.ToplistType
  })
  //云音乐特色榜
  listFeature.value = res.list.filter((item) => {
    return !item.ToplistType && item.name.indexOf('云音乐') >= 0
  })
  //其他场景榜
  listOther.value = res.list.filter((item) => {
    return !item.ToplistType && item.name.indexOf('云音乐') < 0
  })
  // 考虑到从其他页面直接跳转到响应type的榜单页面
  if (!type.value || type.value == 'Top') {
    list.value = listTop.value
  } else if (type.value == 'Feature') {
    list.value = listFeature.value
  } else if (type.value == 'Other') {
    list.value = listOther.value
  }
  rId.value = rId.value ? rId.value : listTop.value[0].id
}

const getListDetail = async (id) => {
  isLoading.value = true
  const { data: res } = await listDetail({ id, s: -1 })
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }

  rankInfo.value = res.playlist
  songList.value = proxy.$utils.formatSongs(res.playlist.tracks, res.privileges)
  total.value = songList.value.length
  isLoading.value = false
}
// 选择榜单
const selectType = (type1) => {
  type.value = type1
  if (type1 == 'Top') {
    list.value = listTop.value
    rId.value = listTop.value[0].id
  } else if (type1 == 'Feature') {
    list.value = listFeature.value
    rId.value = listFeature.value[0].id
  } else if (type1 == 'Other') {
    list.value = listOther.value
    rId.value = listOther.value[0].id
  }
  router.push({
    path: 'rank',
    query: {
      type: type.value,
      rId: rId.value
    }
  })
}
const selectItem = (item) => {
  rId.value = item.id
  router.push({
    path: 'rank',
    query: {
      type: type.value,
      rId: rId.value
    }
  })
}
const playAllSongs = () => {
  store.dispatch('player/playAll', songList.value)
}

onMounted(() => {
  type.value = route.query.type || type.value
  rId.value = route.query.rId || rId.value
  getTopListDetail()
})

watchEffect(() => {
  if (rId.value) {
    getListDetail(rId.value)
  }
})
</script>

<style lang="less" scoped>
.panel {
  background-color: #fff;
  border-radius: 12px;
}

.rank-container {
  display: flex;
  .rank-main {
    flex: 1;
    .main-top {
      display: flex;
      margin-bottom: 20px;
      .rank-faceImg {
        .image {
          width: 250px;
          height: 250px;
          border-radius: 12px;
        }
      }
      .rank-info {
        flex: 1;
        height: 210px;
        margin: 0 20px;
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
            margin-top: 14px;
            color: var(--color-text);
          }
        }
      }
    }
    .rank-list {
      margin-right: 20px;
      padding: 20px;
      height: 1200px;
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
    }
  }
  .rank-aside {
    width: 450px;
    .aside-menu {
      display: flex;
      span {
        display: flex;
        margin-right: 20px;
        justify-content: center;
        align-items: center;
        height: 54px;
        flex: 1;
        color: #000;
        box-shadow: 8px 8px 12px rgba(203, 201, 201, 0.4);
        cursor: pointer;

        &.active {
          background: var(--color-text-height);
          color: #fff;
          font-weight: 700;
        }
        em {
          font-style: normal;
        }
      }
    }
    .aside-item {
      display: flex;
      flex-wrap: wrap;

      .type-item {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 50%;
        max-width: calc((100% - 20px) / 2);
        margin-right: 20px;
        margin-top: 20px;
        padding: 10px 20px;
        box-shadow: 8px 8px 12px rgba(203, 201, 201, 0.4);
        cursor: pointer;
        &:nth-child(2n) {
          margin-right: 0;
        }
        height: 62px;
        &.active {
          background: linear-gradient(
            to right,
            #fff 0%,
            #fff 18%,
            rgb(255, 188, 159) 100%
          );
        }
        .item-info {
          .item-name {
            font-weight: 700;
          }
          .updata-time {
            margin-top: 8px;
            font-size: 12px;
            color: var(--color-text);
          }
        }
        .item-image {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }
      }
    }
  }
}
</style>

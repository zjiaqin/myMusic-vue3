<template>
  <!-- 排行榜面板 -->
  <div class="ranklist-panel">
    <div class="h_title">
      <h3>{{ title }}</h3>
      <div class="updataTime">
        最近更新：{{ $utils.formartDate(updateTime, 'MM月dd日') }} （{{
          updateText
        }}）
      </div>
    </div>
    <el-skeleton :loading="loading" animated :count="6">
      <template #template>
        <div class="item">
          <el-skeleton-item variant="image" class="image" />
          <div class="text">
            <el-skeleton-item variant="text" style="width: 60%" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="toplist_wrapper">
          <div class="songitem" v-for="item in topSongsList" :key="item.id">
            <el-image
              :src="item.album.picUrl + '?param=120y120'"
              class="songimage"
            >
              <template #placeholder>
                <div class="image-slot">
                  <el-icon>
                    <i-ep-picture />
                  </el-icon>
                </div>
              </template>
            </el-image>

            <div class="songinfo">
              <router-link
                :to="{ path: '/song', query: { id: item.id } }"
                class="song_title"
              >
                {{ item.name }}
              </router-link>
              <div class="song_author">
                <router-link
                  class="singer"
                  v-for="(author, index) in item.singer"
                  :key="index"
                  :to="{ path: '/singer', query: { id: author.id } }"
                >
                  {{ index !== 0 ? '/' + author.name : author.name }}
                </router-link>
              </div>
            </div>
            <div class="songoperate">
              <el-tooltip
                effect="dark"
                content="添加到列表"
                placement="top-end"
              >
                <i class="iconfont icon-add" @click="addSongList(item)"></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="添加到收藏"
                placement="top-end"
              >
                <i class="iconfont icon-fav"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { topRankList } from '@/api/home.js'
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { proxy } = getCurrentInstance()

const props = defineProps({
  title: String,
  updateTime: Number,
  updateText: String,
  id: Number,
  loading: Boolean
})

const topSongsList = ref([])
const getTopRankList = async () => {
  const { data: res } = await topRankList(props.id)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  // topSongsList.value = res.privileges.slice(0, 6)
  // 对获取的歌单进行数据处理
  topSongsList.value = proxy.$utils.formatSongs(
    res.playlist.tracks.slice(0, 6),
    res.privileges.slice(0, 6)
  )
}

const addSongList = (song) => {
  store.dispatch('player/addList', [song])
}
onMounted(() => {
  getTopRankList()
})
</script>

<style lang="less" scoped>
.ranklist-panel {
  padding: 0 20px;
  background: #fff;
  border-radius: 12px;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  .h_title {
    padding-top: 30px;
    h3 {
      padding: 0 0 10px;
      font-size: 24px;
    }
    .updataTime {
      padding-bottom: 30px;
      font-size: 14px;
      color: var(--color-text);
    }
  }
  .toplist_wrapper {
    display: flex;
    flex-direction: column;
    .songitem {
      display: flex;
      flex: 1;
      padding-bottom: 25px;
      overflow: hidden;
      .songimage {
        border-radius: 8px;
        box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
        height: 48px;
        width: 48px;
        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: var(--el-fill-color-light);
          color: var(--el-text-color-secondary);
          font-size: 15px;
        }
      }
      .songinfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 4px 0 4px 15px;
        font-size: 14px;

        .song_title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          transition: all 0.3s ease-in;
        }
        .song_author {
          color: var(--color-text);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          .singer {
            font-size: 14px;
            color: var(--color-text);
          }
        }
      }
      .songoperate {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 0px;
        font-size: 16px;
        transition: all 0.3s ease-in;
      }
      &:hover {
        .song_title {
          transform: translateX(15px);
          // transition: all 0.3s ease-in;
        }
        .songoperate {
          width: 45px;
          // transition: all 0.3s ease-in;
        }
      }
    }
  }
}
.el-skeleton {
  .item {
    display: flex;
    padding-bottom: 25px;

    .image {
      height: 48px;
      width: 48px;
    }
    .text {
      padding: 4px 0;
      margin-left: 18px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
  }
}
</style>

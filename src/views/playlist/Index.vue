<template>
  <div class="play-list">
    <div class="list-filter">
      <div class="filter-item" v-for="item in categories" :key="item.name">
        <div class="filter-title">{{ item.name }}</div>
        <div class="filter-box">
          <span
            :class="['item-box', curType == sub.name ? 'active' : '']"
            v-for="sub in item.children.slice(0, 8)"
            :key="sub.name"
          >
            <em @click="selectType(sub)">{{ sub.name }}</em>
          </span>
          <el-popover class="pop" :width="'auto'" trigger="click">
            <template #reference>
              <span
                class="item-box filter-more"
                v-if="item.children.length > 9"
              >
                <em>
                  更多
                  <i class="iconfont icon-arrow"></i>
                </em>
              </span>
              <span v-else></span>
            </template>
            <div class="filter-drop">
              <span
                :class="['item-box', curType === sub.name ? 'active' : '']"
                v-for="sub in item.children.slice(9)"
                :key="sub.name"
              >
                <em @click="selectType(sub, index)">{{ sub.name }}</em>
              </span>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="list-container">
      <div class="list-head">
        <h2>
          {{ curType }}
          <em
            v-if="curType !== '全部歌单'"
            class="filter-close"
            @click="closed"
          >
            <i class="iconfont icon-closed"></i>
          </em>
        </h2>
        <div class="type">
          <span
            :class="params.order === 'hot' ? 'active' : ''"
            @click="selectOrder('hot')"
          >
            热门
          </span>
          <span
            :class="params.order === 'new' ? 'active' : ''"
            @click="selectOrder('new')"
          >
            最新
          </span>
        </div>
      </div>
      <div
        class="wrapper infinite-list"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="disabled"
        infinite-scroll-distance="100"
      >
        <play-list
          :playList="playlist_list"
          :loading="sk_loading"
          :num="24"
        ></play-list>
        <!-- <p v-if="playlist_loading">Loading...</p> -->
        <div class="loading" v-loading="playlist_loading"></div>
        <p v-if="noMore">No more</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayList from '@/components/PlayList.vue'
import { catlist, playList } from '@/api/playlist.js'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
const router = useRouter()
const route = useRoute()
/****数据 */
const sub = ref([]) //全部的歌单类型
const categories = ref([]) //分类好的歌单类型
const curType = ref('全部歌单')

const playlist_list = ref([]) //歌单列表
const playlist_loading = ref(true) //歌单加载状态
const sk_loading = ref(true) //骨架屏加载状态
const noMore = ref(false) //没有更多数据了
const disabled = computed(() => {
  return playlist_loading.value || noMore.value
}) //禁用滚动加载

// 获取歌单的参数
const params = reactive({
  order: 'hot',
  cat: route.query.cat || '',
  limit: 48,
  offset: 0
})

// 获取歌单分类
const getCatlist = async () => {
  const { data: res } = await catlist()
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  // 处理数据结构
  for (const key in res.categories) {
    const newArr = res.sub.filter((item) => {
      return item.category == key
    })
    const member = { name: res.categories[key], children: newArr }
    categories.value.push(member)
  }
}

// 获取歌单列表
const getPlayList = async (params) => {
  playlist_loading.value = true
  const { data: res } = await playList(params)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }

  playlist_list.value =
    params.offset !== 0
      ? [...playlist_list.value, ...res.playlists]
      : res.playlists
  // 当加载的数据小于总数，才可以继续触发获取事件
  noMore.value = playlist_list.value >= res.total
  playlist_loading.value = false
  sk_loading.value = false
}
// 下拉加载更多歌单列表数据
const loadMore = () => {
  params.offset = playlist_list.value.length
}

// 选择方式
const selectOrder = (order) => {
  sk_loading.value = true
  params.offset = 0
  router.push({
    path: 'playlist',
    query: {
      cat: params.cat,
      order: order
    }
  })
}
// 选择类型
const selectType = (sub) => {
  sk_loading.value = true
  curType.value = sub.name
  if (sub.name) {
    router.push({
      path: 'playlist',
      query: {
        cat: sub.name,
        order: params.order
      }
    })
  }
}
// 点击关闭页面
const closed = () => {
  sk_loading.value = true
  router.push({
    path: 'playlist',
    query: {
      cat: '',
      order: params.order
    }
  })
}
// 监听列表参数的变化
watch(
  params,
  (newVal, oldVal) => {
    if (newVal.cat !== oldVal.cat) {
      params.offset = 0
      playlist_list.value = []
    }
    getPlayList(newVal)
  },
  { deep: true }
)

onBeforeRouteUpdate((to) => {
  params.order = to.query.order
  params.cat = to.query.cat
})
onMounted(() => {
  getCatlist()
  getPlayList(params)
})
</script>

<style lang="less" scoped>
.list-filter {
  display: flex;
  height: 116px;
  padding: 20px;
  margin-bottom: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
  .filter-item {
    flex: 2;
    border-left: 1px solid #f5f5f5;
    padding-left: 35px;
    .filter-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .filter-box {
      font-size: 0;

      .item-box {
        display: inline-block;
        width: calc(100% / 3);
        vertical-align: top;
        &.active {
          em {
            border-radius: 8px;
            padding: 0 6px 0 5px;
            margin: 4px -5px 0;
            color: #fff;
            font-style: normal;
            background: var(--color-text-height);
          }
        }
      }
      em {
        display: inline-block;
        font-style: normal;
        font-size: 14px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
      }

      .filter-more {
        width: 50px;
        &.active {
          em {
            width: 40px;
            overflow: hidden;
            height: 26px;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: top;
          }
        }
      }
    }
    &:first-child {
      flex: 1;
      border-left: 0;
      padding-left: 0;
      .item-box {
        width: 50%;
      }
    }
  }
}
.filter-drop {
  .item-box {
    display: inline-block;
    line-height: 26px;
    padding: 0 15px;
    font-size: 14px;

    em {
      display: inline-block;
      font-style: normal;
      cursor: pointer;
    }

    &.active {
      em {
        padding: 0 5px;
        margin: 0 -5px;
        color: #fff;
        font-style: normal;
        background: var(--color-text);
      }
    }
  }
}
.list-head {
  display: flex;
  padding: 15px 0;

  h2 {
    font-size: 24px;
    line-height: 30px;
  }

  .filter-close {
    display: inline-block;
    line-height: 16px;
    vertical-align: top;
    cursor: pointer;
  }

  .type {
    flex: 1;
    padding: 5px 40px;

    span {
      position: relative;
      z-index: 9;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      margin-right: 34px;
      font-weight: 300;
      color: #333;
      cursor: pointer;

      &.active {
        font-weight: 600;
        color: #000;

        &::after {
          position: absolute;
          content: '';
          left: 0;
          bottom: 1px;
          width: 100%;
          height: 6px;
          background: var(--color-text-height);
          z-index: -1;
        }
      }
    }
  }
}
</style>

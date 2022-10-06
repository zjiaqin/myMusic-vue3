<template>
  <div class="search">
    <el-select
      class="search-box"
      v-model="keyVal"
      clearable
      filterable
      remote
      fit-input-width
      placeholder="请输入歌名、歌词、歌手或专辑"
      :remote-method="remoteMethod"
      :loading="loading"
      @clear="showHotList = true"
      loading-text="搜索中..."
    >
      <div class="hot-search" v-if="showHotList">
        <h5>热门搜索</h5>
        <el-option
          class="item"
          v-for="(item, index) in searchHotList"
          :key="item.first"
          :label="item.first"
          :value="item.first"
          @click="jumpSearch(item.first)"
        >
          <span :class="[index < 3 ? 'top-' + index : '']">
            {{ index + 1 + '.' }}
          </span>
          {{ item.first }}
        </el-option>
      </div>

      <el-option-group
        v-else
        v-for="group in suggestInfo"
        :key="group.label"
        :label="listType[group.label]"
      >
        <el-option
          class="item"
          v-for="item in group.info"
          :key="item.id"
          :label="item.name"
          :value="item.name"
          @click="jumpPage(item.id, group.label)"
        >
          {{ item.name }}
          <template v-if="group.label === 'songs'">
            -
            <span
              class="artists"
              v-for="(artist, index) in item.artists"
              :key="artist.id"
            >
              {{ (index !== 0 ? '/' : '') + artist.name }}
            </span>
          </template>
          <template v-else-if="group.label === 'albums'">
            -
            <span class="artists">{{ item.artist.name }}</span>
          </template>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchHot, searchSuggest } from '@/api/search.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const listType = {
  songs: '单曲',
  artists: '歌手',
  albums: '专辑',
  playlists: '歌单'
}
const showHotList = ref(true)
const keyVal = ref('')
const loading = ref(false)
const searchHotList = ref([])
const suggestInfo = ref([])

// 热门搜索
const getSearchHot = async () => {
  const { data: res } = await searchHot()
  loading.value = false
  if (res.code !== 200) {
    return ElMessage.error('数据请求失败')
  }
  if (res.result.hots) {
    searchHotList.value = res.result.hots
  }
}

//  获取搜索建议列表
const getSerachSuggest = async (query) => {
  const { data: res } = await searchSuggest(query)
  loading.value = false
  if (res.code !== 200) {
    return ElMessage.error('数据请求失败')
  }
  if (res.result.order) {
    console.log('11')
    suggestInfo.value = res.result.order.map((item) => {
      return {
        label: item,
        info: res.result[item]
      }
    })
  }
}

// 从服务器获取列表的方法
const remoteMethod = (query) => {
  if (query) {
    showHotList.value = false
    loading.value = true
    suggestInfo.value = []

    getSerachSuggest(query)
  }
}

// 从热门搜索列表中，点击跳转至搜索结果页面
const jumpSearch = (key) => {
  keyVal.value = key
  if (keyVal.value === route.query.key) {
    return
  }
  router.push({ path: '/search', query: { key } })
}

// 从搜索建议列表中点击，跳转至相对应的落地页面
const jumpPage = (id, type) => {
  if (type == 'songs') {
    // 如果点击的单曲，将直接跳转至单曲页面'/song？id='
    router.push({ path: '/song', query: { id } })
  }
  if (type == 'artists') {
    // 如果点击的歌手，将直接跳转至歌手页面'/singer?id='
    router.push({ path: '/singer', query: { id } })
  }
  if (type == 'albums') {
    // 如果点击的专辑，将直接跳转至专辑页面'/albums?id='
    router.push({ path: '/album', query: { id } })
  }
  if (type == 'playlists') {
    // 如果点击的歌单，将直接跳转至歌单页面'/playlist/detail？id='
    router.push({ path: '/playlist/detail', query: { id } })
  }
}

// 组件加载时，获取热搜列表
onMounted(() => {
  getSearchHot()
})
</script>
<style>
.el-select-dropdown__wrap {
  max-height: 400px;
}
</style>
<style lang="less" scoped>
.search {
  :deep(.el-select .el-input.is-focus .el-input__wrapper) {
    border: none;
    box-shadow: 0 0 0 1px var(--color-text-height) inset !important;
  }
  :deep(.el-select .el-input .el-input__wrapper) {
    border-radius: 4px;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 0 0 0 inset !important;
  }
}
.search-box {
  width: 250px;
  :deep(.el-input__inner) {
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
  }
}

.hot-search {
  h5 {
    padding: 5px 0 5px 20px;
    font-size: 18px;
  }
  .top-0 {
    font-weight: bold;
    color: rgba(255, 0, 0, 1);
  }
  .top-1 {
    font-weight: bold;
    color: rgba(255, 0, 0, 0.6);
  }
  .top-2 {
    font-weight: bold;
    color: rgba(255, 0, 0, 0.4);
  }
}
.item {
  .artists {
    font-size: 12px;

    color: var(--color-text);
  }
  &.selected {
    color: var(--color-text-height);
    .artists {
      color: var(--color-text-height);
    }
  }
}
</style>

<template>
  <div class="search">
    <el-select
      v-model="keyVal"
      class="search-box"
      filterable
      clearable
      remote
      placeholder="请输入歌名、歌词、歌手或专辑"
      :remote-method="remoteMethod"
      :fit-input-width="true"
      :loading="info.loading"
      loading-text="搜索中..."
      @focus="handleFocus"
    >
      <div clas="hot-search" v-if="!keyVal">
        <h5>热门搜索</h5>
        <el-option
          v-for="(item, index) in info.searchHot"
          :key="item.first"
          :label="item.first"
          :value="item.first"
          @click="jumpSearch(item.first)"
        >
          <span :class="[index < 3 ? 'top' + index : '']">
            {{ index + 1 + '.' }}
          </span>
          {{ item.first }}
        </el-option>
      </div>
      <el-option-group
        v-else
        v-for="group in info.suggestInfo"
        :key="group.label"
        :label="info.listType[group.label]"
      >
        <el-option
          v-for="item in group.info"
          :key="item.id"
          :label="item.name"
          :value="item.name"
          @click="jumpPage(item.id, group.label)"
        >
          {{ item.name }}
          <template v-if="group.label === 'songs'">
            -
            <span v-for="(artist, index) in item.artists" :key="artist.id">
              {{ (index !== 0 ? '/' : '') + artist.name }}
            </span>
          </template>
          <template v-else-if="group.label === 'albums'">
            -
            <span>{{ item.artist.name }}</span>
          </template>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script setup>
import { searchHot, searchSuggest } from '@/api/search.js'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const keyVal = ref('')
const info = reactive({
  keyVal: null,
  searchHot: [],
  suggestInfo: [],
  loading: false,
  listType: {
    songs: '单曲',
    artists: '歌手',
    albums: '专辑',
    playlists: '歌单'
  }
})
const route = useRoute()
const router = useRouter()

// 热门搜索
const getSearchHot = async () => {
  const { data: res } = await searchHot()
  if (res.code !== 200) {
    return ElMessage.error('数据请求失败')
  }
  info.loading = false
  info.searchHot = res.result.hots
}
//  获取搜索建议列表
const getSerachSuggest = async (query) => {
  const { data: res } = await searchSuggest(query)
  info.loading = false
  console.log(111)
  if (res.code !== 200) {
    return ElMessage.error('数据请求失败')
  }
  if (res.result.order) {
    info.suggestInfo = res.result.order.map((item) => {
      return {
        label: item,
        info: res.result[item]
      }
    })
  }
  console.log(info.suggestInfo)
}

// 从服务器获取列表的方法
const remoteMethod = (query) => {
  if (query) {
    info.loading = true
    getSerachSuggest(query)
  } else {
    info.suggestInfo = []
  }
}

// 获取焦点调用热门搜索
const handleFocus = () => {
  info.loading = true
  info.suggestInfo = []
  getSearchHot()
}
// 从热门搜索列表中，点击跳转至搜索结果页面
const jumpSearch = (key) => {
  // if (key === route.query.key) {
  //   return
  // }
  router.push({ path: '/search', query: { key } })
}

// 从搜索建议列表中点击，跳转至相对应的落地页面
const jumpPage = (id, type) => {
  console.log(111)
  console.log(id, type)
  if (type == 'songs') {
    // 如果点击的单曲，将直接跳转至单曲页面'/song？id='
    router.push({ path: '/songs', query: { id } })
  }
  if (type == 'artists') {
    // 如果点击的歌手，将直接跳转至歌手页面'/singer?id='
    router.push({ path: '/singer', query: { id } })
  }
  if (type == 'albums') {
    // 如果点击的专辑，将直接跳转至专辑页面'/albums?id='
    router.push({ path: '/albums', query: { id } })
  }
  if (type == 'playlists') {
    // 如果点击的歌单，将直接跳转至歌单页面'/playlist/detail？id='
    router.push({ path: '/playlist/detail', query: { id } })
  }
}
</script>

<style lang="less" scoped>
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
</style>

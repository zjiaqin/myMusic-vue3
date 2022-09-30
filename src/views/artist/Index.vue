<template>
  <div class="artist-list">
    <div
      class="artist-main infinite-list"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="disabled"
      infinite-scroll-distance="100"
    >
      <artist-item
        :loading="sk_loading"
        :artistList="artist_list"
        :num="12"
      ></artist-item>
      <div class="loading" v-loading="art_loading"></div>
      <p v-if="noMore">No more</p>
    </div>

    <div class="MV-side">
      <el-affix :offset="141">
        <div class="filter-box">
          <div class="rank">
            <div class="title">拼音</div>
            <div class="filter-main">
              <span
                @click="selectType('initial', index)"
                :class="index == filter.initialIndex ? 'active' : ''"
                v-for="(item, index) in filter.initial"
                :key="index"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
          <div class="area">
            <div class="title">区域</div>
            <div class="filter-main">
              <span
                @click="selectType('area', index)"
                :class="index == filter.areaIndex ? 'active' : ''"
                v-for="(item, index) in filter.area"
                :key="index"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
          <div class="type">
            <div class="title">类型</div>
            <div class="filter-main">
              <span
                @click="selectType('type', index)"
                :class="index == filter.typeIndex ? 'active' : ''"
                v-for="(item, index) in filter.type"
                :key="index"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>
      </el-affix>
    </div>
  </div>
</template>

<script setup>
import ArtistItem from '@/components/ArtistItem.vue'
import { artistList } from '@/api/artist.js'
import { ref, reactive, computed, onMounted, watchEffect } from 'vue'
const filter = reactive({
  type: [
    { label: '全部', val: -1 },
    { label: '男歌手', val: 1 },
    { label: '女歌手', val: 2 },
    { label: '乐队', val: 3 }
  ],
  area: [
    { label: '全部', val: -1 },
    { label: '华语', val: 7 },
    { label: '欧美', val: 96 },
    { label: '日本', val: 8 },
    { label: '韩国', val: 16 },
    { label: '其他', val: 0 }
  ],
  initial: [
    { label: '热门', val: -1 },
    { label: '#', val: 0 }
  ],
  typeIndex: 0,
  areaIndex: 0,
  initialIndex: 0
})

//渲染字母
const renderInitial = () => {
  const alphabet = []
  for (let i = 0; i < 26; i++) {
    alphabet.push({
      //渲染大写字母
      label: String.fromCharCode(65 + i),
      //渲染小写字母
      val: String.fromCharCode(97 + i)
    })
  }
  filter.initial = [filter.initial[0], ...alphabet, filter.initial[1]]
}

const params = reactive({
  area: '',
  type: '',
  initial: '',
  limit: 30,
  offset: 0
})

const artist_list = ref([])
const art_loading = ref(false)
const sk_loading = ref(true)
const noMore = ref(false)
const disabled = computed(() => {
  return art_loading.value || noMore.value
})

const getArtist = async (param) => {
  const { data: res } = await artistList(param)
  if (res.code !== 200) {
    return ElMessage.error(res.msg)
  }
  artist_list.value =
    params.offset == 0 ? res.artists : [...artist_list.value, ...res.artists]
  art_loading.value = false
  sk_loading.value = false
  noMore.value = !res.more
}

const selectType = (type, index) => {
  sk_loading.value = true
  filter[type + 'Index'] = index
  artist_list.value = []
  params.offset = 0
  params[type] = filter[type][index].val
}

const loadMore = () => {
  art_loading.value = true
  console.log()
  params.offset = artist_list.value.length
}
onMounted(() => {
  renderInitial()
  getArtist(params)
})

watchEffect(() => {
  getArtist(params)
})
</script>

<style></style>

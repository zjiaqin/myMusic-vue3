import { onMounted, ref, reactive } from 'vue'
import { hotList, playList } from '@/api/home.js'

export default function hot_recom() {
  // 热门推荐歌单 数据
  const playlist_tags = ref([])
  const playlist_list = ref([])
  const playlist_index = ref(0)
  const playlist_params = reactive({ limit: 6, offset: 0, cat: '' })
  // const playlist_count = ref(6)
  const playlist_loading = ref(true)
  //-----------------------

  // 获取热门推荐歌单标签
  const getHotTags = async () => {
    const { data: res } = await hotList()
    if (res.code !== 200) {
      return ElMessage.error('数据请求失败')
    }
    res.tags.unshift({ name: '为您推荐', id: 10001 })
    playlist_tags.value = res.tags.slice(0, 6)
  }
  //切换歌单类别
  const choosePlayListType = (index) => {
    playlist_index.value = index
    playlist_params.cat = index !== 0 ? playlist_tags.value[index].name : ''
    playlist_tags.value[index]
    playlist_loading.value = true
    getPlayList(playlist_params)
  }

  // 获取热门歌单（按分类）
  const getPlayList = async () => {
    const { data: res } = await playList(playlist_params)
    if (res.code !== 200) {
      return ElMessage.error('数据请求失败')
    }
    playlist_list.value = res.playlists
    playlist_loading.value = false
  }

  onMounted(() => {
    getHotTags()
    getPlayList(playlist_params)
  })

  return {
    playlist_tags,
    playlist_index,
    playlist_list,
    playlist_loading,
    getHotTags,
    choosePlayListType
  }
}

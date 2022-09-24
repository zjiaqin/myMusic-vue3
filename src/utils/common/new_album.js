import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
import { topAlbum } from '@/api/home.js'

export default function new_album() {
  const { proxy } = getCurrentInstance()
  // 热门专辑 数据
  const album_area = reactive(proxy.$common_list.ALBUM_AREA)
  const album_list = ref([])
  const album_index = ref(0)
  const album_params = reactive({ limit: 12, area: '' })
  // const playlist_count = ref(6)
  const album_loading = ref(true)
  //-----------------------

  //切换专辑区域
  const chooseAlbumListArea = (index) => {
    album_index.value = index
    album_params.area = index == 0 ? '' : album_area[index].code
    album_loading.value = true
    getTopAlbumList(album_params)
  }

  // 获取热门歌单（按分类）
  const getTopAlbumList = async (album_params) => {
    const { data: res } = await topAlbum(album_params)
    if (res.code !== 200) {
      return ElMessage.error('数据请求失败')
    }
    album_list.value = res.monthData.slice(0, 12)
    album_loading.value = false
  }

  onMounted(() => {
    getTopAlbumList(album_params)
  })

  return {
    chooseAlbumListArea,
    getTopAlbumList,

    album_loading,
    album_list,
    album_area,
    album_index
  }
}

import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { getNewMv } from '@/api/home.js'
export default function new_mv() {
  // 获取MV数据
  const { proxy } = getCurrentInstance()
  // 热门专辑 数据
  const mv_area = reactive(proxy.$common_list.MV_AREA)
  const mv_list = ref([])
  const mv_index = ref(0)
  const mv_params = reactive({ limit: 12, area: '' })
  // const playlist_count = ref(6)
  const mv_loading = ref(true)
  //-----------------------
  const getNewMvList = async (mv_params) => {
    const { data: res } = await getNewMv(mv_params)
    if (res.code !== 200) {
      return ElMessage.error('数据请求失败')
    }

    mv_list.value = res.data
    mv_loading.value = false
  }
  // 切换MV类别
  const chooseMvType = (index) => {
    mv_loading.value = true
    mv_index.value = index
    mv_params.area = index == 0 ? '' : mv_area[index]
    getNewMvList(mv_params)
  }

  onMounted(() => {
    getNewMvList(mv_params)
  })
  return {
    mv_area,
    mv_list,
    mv_index,
    mv_loading,
    chooseMvType
  }
}

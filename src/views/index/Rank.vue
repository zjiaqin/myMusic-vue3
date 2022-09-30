<template>
  <div class="rank">
    <rank-list
      class="ranklist"
      v-for="item in top_list"
      :key="item"
      :title="item.name"
      :updateTime="item.updateTime"
      :updateText="item.updateFrequency"
      :id="item.id"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import RankList from '@/components/RankList.vue'
import { toplist } from '@/api/home.js'
import { reactive, onMounted, ref } from 'vue'
const loading = ref(true)
const top_list = ref([])
// 获取热门排行榜名字
const getTopList = async () => {
  loading.value = true
  const { data: res } = await toplist()
  if (res.code !== 200) {
    return ElMessage.error(res.msg)
  }
  top_list.value = res.list.slice(0, 4)
  loading.value = false
}
onMounted(() => {
  getTopList()
})
</script>

<style lang="less" scoped>
.rank {
  display: flex;
  .ranklist {
    flex: 1;
  }
}
</style>

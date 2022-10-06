<template>
  <el-skeleton :loading="Art_loading" animated :count="12" :throttle="500">
    <template #template>
      <el-skeleton-item variant="image" class="image" />
    </template>
    <template #default>
      <el-carousel
        indicator-position="outside"
        arrow="never"
        autoplay
        pause-on-hover
        height="340px"
        :interval="5000"
      >
        <el-carousel-item
          v-for="(Group, index) in topArtistList"
          :key="index"
          class="group"
        >
          <router-link
            :to="{ path: '/singer', query: { id: item.id } }"
            class="item"
            v-for="item in Group"
            :key="item.id"
          >
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="item.name"
              placement="top"
            >
              <el-image :src="item.picUrl + '?param=100y100'">
                <template #placeholder>
                  <div class="image-slot">
                    <el-icon>
                      <i-ep-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </el-tooltip>
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </template>
  </el-skeleton>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { topArtists } from '@/api/home.js'
const Art_loading = ref(false)
const topArtistList = ref([])
const topArtist_params = { limit: 36, offset: 0 }
const getTopArtistList = async (params) => {
  const { data: res } = await topArtists(params)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  Art_loading.value = false
  topArtistList.value = splitGroup(res.artists, 12)
}

const splitGroup = (arr, subGroupLength) => {
  let index = 0
  let newArray = []
  while (index < arr.length) {
    newArray.push(arr.slice(index, (index += subGroupLength)))
  }
  return newArray
}

onMounted(() => {
  getTopArtistList(topArtist_params)
})
</script>

<style lang="less" scoped>
.el-skeleton {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  height: 340px;

  .image {
    width: 100px;
    height: 100px;
  }
}
.group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  .item {
    width: 100px;
    height: 100px;
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
}
</style>

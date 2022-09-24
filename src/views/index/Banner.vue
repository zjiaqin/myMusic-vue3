<template>
  <div class="banner">
    <el-skeleton :loading="loading" animated :count="4">
      <template #template>
        <el-skeleton-item class="skeleton-img" variant="image" />
      </template>
      <template #default>
        <swiper
          :slidesPerView="4"
          :spaceBetween="30"
          :autoplay="{ delay: 3000 }"
          :pagination="{
            clickable: true
          }"
          :navigation="false"
          :modules="modules"
          class="mySwiper"
        >
          <swiper-slide v-for="item of bannerList" :key="item.imageUrl">
            <el-image
              :src="item.imageUrl"
              :alt="item.typeTitle"
              :fit="contain"
              class="banner_img"
              @click="jumpPage(item)"
            >
              <template #placeholder>
                <div class="image-slot">
                  <el-icon><i-ep-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </swiper-slide>
        </swiper>
      </template>
    </el-skeleton>
  </div>
</template>
<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/pagination'

// import required modules
import { Pagination, Autoplay } from 'swiper'

import { getBanner } from '@/api/home.js'
const modules = [Pagination, Autoplay]
const loading = ref(true)

const bannerList = ref([])

// 从服务器获取轮播图列表
const getBannerList = async () => {
  const { data: res } = await getBanner()
  if (res.code !== 200) {
    return ElMessage.error('获取轮播图数据失败')
  } else {
    bannerList.value = res.banners
    loading.value = false
  }
}
// 点击轮播图跳转至相应的页面
const jumpPage = (params) => {
  console.log(params)
  switch (params.targetType) {
    case 1: //单曲
      router.push({ path: '/song', query: { id: params.targetId } })
      break
    case 10: //专辑
      router.push({ path: '/album', query: { id: params.targetId } })
      break
    case 1000: // 歌单
      router.push({ path: '/playlist', query: { id: params.targetId } })
      break
    case 1004: // MV
      router.push({ path: '/mvlist/mv', query: { id: params.targetId } })
      break
    case 3000: // 外链
      window.open(params.url, '_blank')
      break
  }
}

onMounted(() => {
  getBannerList()
})
</script>

<style lang="less" scoped>
// 轮播图的宽度
@w: calc((@mainWidth - 90px) / 4);

.el-skeleton {
  display: flex;
  padding-bottom: 30px;
  // justify-content: space-between;
  // padding: 40px 0;
  .skeleton-img {
    flex: 1;
    width: 100%;
    .calcHeight(@w, 1080, 400);
    margin-right: 30px;
    &:last-child {
      margin: 0;
    }
  }
}

.swiper {
  padding-bottom: 30px;
  .swiper-slide {
    .calcHeight(@w, 1080, 400);
    .banner_img {
      border-radius: 12px;
      .calcHeight(@w, 1080, 400);
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        font-size: 30px;
      }
    }
  }
  :deep(.swiper-pagination-bullet-active) {
    width: 15px;
    border-radius: 4px;
    background: var(--color-text-height);
  }
}
</style>

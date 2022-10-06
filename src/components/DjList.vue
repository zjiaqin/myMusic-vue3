<template>
  <el-skeleton :loading="hotDj_loading" animated :count="6" :throttle="500">
    <template #template>
      <div class="item">
        <el-skeleton-item variant="image" class="skeleton-image" />

        <div class="info">
          <el-skeleton-item
            variant="h3"
            class="skeleton-title"
            style="width: 40%"
          />
          <el-skeleton-item
            variant="text"
            style="width: 80%"
            class="skeleton-text"
          />
          <el-skeleton-item
            variant="text"
            style="width: 30%"
            class="skeleton-text"
          />
        </div>
      </div>
    </template>
    <template #default>
      <div class="djlist">
        <router-link
          :to="{ path: '/', query: { id: '前方正在施工' } }"
          class="item"
          v-for="item in hotDj_List"
          :key="item.id"
        >
          <el-image class="image" :src="item.picUrl + '?param=120y120'">
            <template #placeholder>
              <div class="image-slot">
                <el-icon>
                  <i-ep-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="info">
            <div class="dj-name" v-if="item.name">
              <i class="iconfont icon-dj"></i>
              {{ item.name }}
            </div>
            <div class="dj-rcmdtext" v-if="item.rcmdtext">
              {{ item.rcmdtext }}
            </div>
            <div class="dj-count">
              <span>共{{ $utils.formartNum(item.programCount) }}期</span>
              <span>订阅{{ $utils.formartNum(item.subCount) }}次</span>
            </div>
          </div>
        </router-link>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup>
import { getHotDj } from '@/api/home.js'
import { ref, onMounted } from 'vue'

const hotDj_List = ref([])
const hotDj_params = { limit: 6, offset: 0 }
const hotDj_loading = ref(true)

const getHotDjList = async (params) => {
  const { data: res } = await getHotDj(params)
  if (res.code !== 200) {
    return ElMessage.error('获取数据失败')
  }
  hotDj_List.value = res.djRadios
  hotDj_loading.value = false
}

onMounted(() => [getHotDjList(hotDj_params)])
</script>

<style lang="less" scoped>
.el-skeleton {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    display: flex;
    flex: 50%;
    margin: 0 20px 20px 0;
    max-width: calc((100% - 20px) / 2);
    &:nth-child(2n) {
      margin-right: 0;
    }
    .skeleton-image {
      width: 100px;
      height: 100px;
    }
    .info {
      flex: 1;
      margin: 10px 0 0 20px;
      .skeleton-text {
        margin-top: 10px;
      }
    }
  }
}
.djlist {
  display: flex;
  flex-wrap: wrap;

  .item {
    display: flex;
    flex: 50%;
    margin: 0 20px 20px 0;
    max-width: calc((100% - 20px) / 2);
    &:nth-child(2n) {
      margin-right: 0;
    }
    .image {
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
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s linear;

      margin: 10px 0 0 20px;
      border-bottom: 1px solid#eee;
      .dj-name {
        font-size: 18px;
        color: var(--color-text-main);
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;

        .icon-dj {
          color: var(--color-text-main);
          transition: all 0.3s linear;
        }
      }
      .dj-rcmdtext {
        color: var(--color-text);
      }
      .dj-count {
        display: flex;
        justify-content: space-between;
        color: var(--color-text);
        font-size: 12px;
        margin-bottom: 8px;
      }
    }
    &:hover {
      .info {
        border-bottom: 1px solid var(--color-text-height);
        .icon-dj {
          color: var(--color-text-height);
        }
      }
    }
  }
}
</style>

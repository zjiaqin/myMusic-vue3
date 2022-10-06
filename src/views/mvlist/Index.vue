<template>
  <div class="MV-list">
    <div
      class="MV-main infinite-list"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="disabled"
      infinite-scroll-distance="100"
    >
      <mv-list :loading="sk_loading" :mvList="mv_list" :num="24"></mv-list>
      <div class="loading" v-loading="mv_loading"></div>
      <p v-if="noMore">No more</p>
    </div>

    <div class="MV-side">
      <el-affix :offset="141">
        <div class="filter-box">
          <div class="rank">
            <div class="title">排序</div>
            <div class="filter-main">
              <span
                @click="selectType('order', index)"
                :class="index == filter.orderIndex ? 'active' : ''"
                v-for="(item, index) in filter.order"
                :key="index"
              >
                {{ item }}
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
                {{ item }}
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
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </el-affix>
    </div>
  </div>
</template>

<script setup>
import { mv } from '@/api/mv.js'
import MvList from '@/components/MvList.vue'
import {
  ref,
  onMounted,
  reactive,
  computed,
  watch,
  getCurrentInstance,
  watchEffect
} from 'vue'

const { proxy } = getCurrentInstance()

const filter = reactive({
  area: proxy.$common_list.MV_AREA,
  type: proxy.$common_list.MV_TYPE,
  order: ['上升最快', '最新'],
  areaIndex: 0,
  typeIndex: 0,
  orderIndex: 0
})

const params = reactive({
  area: '',
  type: '',
  order: '',
  limit: 30,
  offset: 0
})

const mv_list = ref([])
const mv_loading = ref(false) //下拉加载新数据
const sk_loading = ref(true) //骨架屏加载
const noMore = ref(false) //全部数据完成
const disabled = computed(() => {
  return mv_loading.value || noMore.value
})

const getMVlist = async (params) => {
  const { data: res } = await mv(params)

  if (res.code !== 200) {
    return ElMessage.error(res.msg)
  }
  mv_list.value =
    params.offset == 0 ? res.data : [...mv_list.value, ...res.data]
  mv_loading.value = false
  sk_loading.value = false
  noMore.value = !res.hasMore
}

const selectType = (type, index) => {
  sk_loading.value = true
  filter[type + 'Index'] = index
  mv_list.value = []
  params.offset = 0
  params[type] = filter[type][index]
}

const loadMore = () => {
  mv_loading.value = true
  params.offset = mv_list.value.length
}

onMounted(() => {
  getMVlist(params)
})

watchEffect(() => {
  getMVlist(params)
})
</script>

<style lang="less" scoped>
@w: calc((@mainWidth - 300px - 120px) / 6);
.MV-list {
  display: flex;
  .MV-main {
    flex: 1;
    :deep(.skeleton-image) {
      .calcHeight(@w,1079,1079 );
    }

    :deep(.faceImg) {
      position: relative;
      .calcHeight(@w,1079,1079 );
      .image {
        .el-image__inner {
          object-fit: cover;
        }
      }
    }
  }
  .MV-side {
    height: 100%;
    width: 300px;

    margin: 20px 0 0 20px;

    .filter-box {
      // box-sizing: border-box;
      padding: 20px;
      background: #fff;
      border-radius: 12px;
      box-shadow: -4px 4px 8px rgba(0, 0, 0, 0.2);

      .rank,
      .area,
      .type {
        .title {
          font-size: 16px;
          font-weight: 700;
        }
        .filter-main {
          margin: 10px 0 25px 0;

          span {
            margin-right: 12px;
            line-height: 25px;
            vertical-align: text-top;
            cursor: pointer;

            &.active {
              position: relative;
              z-index: 1;
              &::after {
                position: absolute;
                content: '';
                bottom: 0;
                left: 0;
                width: 100%;
                height: 6px;
                background-color: var(--color-text-height);
                z-index: -1;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="MV">
    <div class="MV-main" v-if="mv_Detail">
      <div class="MV-title">
        <div class="MV-info">
          <i class="iconfont icon-mv"></i>
          {{ mv_Detail.name }}
        </div>
        <router-link
          :to="{ path: '/singer', query: { id: author.id } }"
          class="song-author"
          v-for="(author, k) in mv_Detail.artists"
          :key="author.name"
        >
          {{ k !== 0 ? ' / ' + author.name : author.name }}
        </router-link>
      </div>
      <div class="MV-player">
        <videoPlay
          width="100%"
          height="100%"
          v-if="videoOptions.src"
          v-bind="videoOptions"
        />
      </div>
      <!-- 后续完善登录功能后增加评论模块 -->
      <div class="MV-comment"></div>
    </div>
    <div class="MV-side">
      <div class="info-box">
        <h3 class="aside-title">MV简介</h3>
        <div class="mv-info-count">
          <div class="info-time">发布时间：{{ mv_Detail.publishTime }}</div>
          <div class="info-count">
            播放量：{{ $utils.formartNum(mv_Detail.playCount) }}
          </div>
        </div>
        <div class="mv-desc">
          {{ mv_Detail.desc ? mv_Detail.desc : '暂无简介' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mvDetail, mvUrl } from '@/api/mv.js'
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play'

import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
const route = useRoute()
const router = useRouter()
const mvId = ref(null)

const mv_Detail = ref([])
const videoOptions = reactive({
  src: '', //视频源
  poster: '',
  autoPlay: false,
  loop: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0']
})
const getMvDetail = async (id) => {
  const { data: res } = await mvDetail(id)
  if (res.code !== 200) {
    return ElMessage.error(res.msg)
  }
  mv_Detail.value = res.data
  videoOptions.poster = res.data.cover
}

const getMvUrl = async (id) => {
  const { data: res } = await mvUrl(id)
  if (res.code !== 200) {
    return ElMessage.error(res.msg)
  }
  videoOptions.src = res.data.url
}

const init = (id) => {
  getMvDetail(id)
  getMvUrl(id)
}
onMounted(() => {
  mvId.value = route.query.id
  init(mvId.value)
})

onBeforeRouteUpdate((to) => {
  mvId.value = to.query.id
  init(mvId.value)
})
</script>

<style lang="less" scoped>
@w: calc((@mainWidth - 300px - 120px) / 6);
.MV {
  display: flex;
  .MV-main {
    flex: 1;
    .MV-title {
      display: flex;
      padding: 0 0 20px 0;
      .MV-info {
        padding-right: 20px;
        font-size: 24px;
        line-height: 24px;

        .icon-mv {
          margin-right: 5px;
          vertical-align: top;
          color: var(--color-text-height);
        }
      }
      .song-author {
        line-height: 24px;
        color: #666;
      }
    }
  }
  .MV-side {
    height: 100%;
    width: 350px;
    background: #fff;
    margin: 20px 0 0 20px;
    border-radius: 12px;
    .info-box {
      margin: 20px;
      .aside-title {
        border-left: 4px solid var(--color-text-height);
        padding-left: 6px;
      }
      .mv-info-count {
        margin: 14px 0;
        font-size: 12px;
        color: var(--color-text);
        .info-count {
          margin-top: 4px;
        }
      }
      .mv-desc {
        line-height: 25px;
        text-indent: 25px;
      }
    }
  }
}
</style>

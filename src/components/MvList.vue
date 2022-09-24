<template>
  <div class="mv-list">
    <el-skeleton :loading="loading" animated :count="12" :throttle="500">
      <template #template>
        <div class="item">
          <el-skeleton-item variant="image" class="skeleton-image" />
          <div class="info">
            <el-skeleton-item
              variant="text"
              class="skeleton-text"
              style="width: 40%"
            />
            <el-skeleton-item
              variant="text"
              class="skeleton-text"
              style="width: 30%"
            />
            <el-skeleton-item
              variant="text"
              class="skeleton-text"
              style="width: 50%"
            />
          </div>
        </div>
      </template>
      <template #default>
        <div class="mv-list">
          <div class="item" v-for="item in mvList" :key="item.id">
            <router-link
              class="faceImg"
              :to="{ path: '/mvlist/mv', query: { id: item.id } }"
            >
              <i class="iconfont icon-video-play"></i>
              <el-image class="image" :src="item.cover">
                <template #placeholder>
                  <div class="image-slot">
                    <el-icon><i-ep-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </router-link>

            <div class="mvinfo">
              <router-link
                :to="{ path: '/mvlist/mv', query: { id: item.id } }"
                class="mv_title"
              >
                {{ item.name }}
              </router-link>
              <div class="mv_author">
                <router-link
                  class="singer"
                  :to="{ path: '/singer', query: { id: item.artistId } }"
                >
                  {{ item.artistName }}
                </router-link>
              </div>
              <div class="mv-playCount">
                <i class="iconfont icon-mvlist"></i>
                {{ $utils.formartNum(item.playCount) }}
              </div>
              <div class="mv-time" v-if="item.publishTime">
                发布时间：{{ item.publishTime }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
  mvList: Array
})
</script>

<style lang="less" scoped>
@w: calc((@mainWidth - 140px) / 6);
.el-skeleton {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20px;
  .item {
    flex: 25%;
    margin: 20px 20px 0 0;
    max-width: calc((100% - 100px) / 6);
    &:nth-child(6n) {
      margin-right: 0;
    }
    .skeleton-image {
      .calcHeight(@w,1920,1079 );
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin: 10px 0 10px;
      height: 60px;
    }
  }
}

.mv-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .item {
    display: flex;
    flex-direction: column;
    flex: 25%;
    max-width: calc((100% - 100px) / 6);

    margin: 20px 20px 0 0;
    &:nth-child(6n) {
      margin-right: 0;
    }
    .faceImg {
      position: relative;
      display: block;
      .calcHeight(@w,1920,1079 );
      width: 100%;
      overflow: hidden;

      .icon-video-play {
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        color: rgba(255, 255, 255, 0);
        font-size: 10px;

        transform: translate(-50%, -50%);
        transition: all 0.5s ease-out;
      }
      .image {
        .calcHeight(@w,1920,1079 );
        transition: all 0.5s ease-out;
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
    .mvinfo {
      box-sizing: border-box;
      padding: 14px 0 0 0;
      height: 80px;
      .mv_author,
      .mv_title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
      }

      .singer {
        display: block;
        color: var(--color-text);
        font-size: 14px;
        line-height: 28px;
      }
      .mv-playCount {
        color: var(--color-text);
      }
      .mv-time {
        font-size: 12px;
      }
    }
    &:hover {
      .icon-video-play {
        font-size: 50px;
        color: rgba(255, 255, 255, 0.7);
      }
      .image {
        transform: scale(1.2);
      }
    }
  }
}
</style>

<template>
  <el-skeleton :loading="loading" animated :count="num">
    <template #template>
      <div class="item">
        <el-skeleton-item variant="image" class="skeleton-img" />
        <div class="info">
          <el-skeleton-item
            variant="text"
            style="width: 100%"
            class="skeleton-text"
          />
          <el-skeleton-item
            variant="text"
            style="width: 50%"
            class="skeleton-text"
          />
        </div>
        <div class="tags">
          <el-skeleton-item variant="text" class="tag" />
          <el-skeleton-item variant="text" class="tag" />
          <el-skeleton-item variant="text" class="tag" />
          <div></div>
        </div>
      </div>
    </template>

    <template #default>
      <div class="playlist">
        <div class="item" v-for="item in playList" :key="item.id">
          <router-link
            class="faceImg"
            :to="{ path: `/playlist/detail`, query: { id: item.id } }"
          >
            <el-image :src="item.coverImgUrl" lazy class="image">
              <template #placeholder>
                <div class="image-slot">
                  <el-icon><i-ep-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span class="playCount">
              <i class="iconfont icon-playnum" style="color: #fff" />
              <em>{{ $utils.formartNum(item.playCount) }}</em>
              /{{ item.trackCount + '首' }}
            </span>
          </router-link>
          <div class="info">
            <router-link
              :to="{ path: '/playlist/detail', query: { id: item.id } }"
              class="info_name"
            >
              {{ item.name }}
            </router-link>
            <div class="tags">
              <router-link
                :to="{ path: '/playlist', query: { cat: tag } }"
                class="tag"
                v-for="(tag, index) in item.tags"
                :key="index"
              >
                #{{ tag }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup>
const props = defineProps({
  playList: Array,
  loading: Boolean,
  num: Number
})
</script>

<style lang="less" scoped>
@w: calc((@mainWidth - 240px - 20px - 20px) / 6);
.el-skeleton {
  display: flex;
  flex-wrap: wrap;

  .item {
    flex: 16.6%;
    height: 100%;
    max-width: calc((100% - 240px) / 6);
    padding: 20px 40px 20px 0;

    .skeleton-img {
      width: 100%;
      .calcHeight(@w, 1024, 1024);
    }
    .info {
      box-sizing: border-box;
      display: block;
      padding-top: 10px;
      height: 54px;
      .skeleton-text {
        height: 16px;
      }
    }
    .tags {
      display: flex;
      height: 22px;
      .tag {
        flex: 1;
        margin-right: 8px;
      }
      div {
        flex: 2;
      }
    }
  }
}
.playlist {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 100%;
    flex: 16.6%;
    max-width: calc((100% - 240px) / 6);
    padding: 20px 40px 20px 0;

    .faceImg {
      z-index: 1;
      display: block;
      position: relative;
      width: 100%;
      .calcHeight(@w, 1024, 1024);
      .image {
        border-radius: 8px;
        .calcHeight(@w, 1024, 1024);
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
      .playCount {
        box-sizing: border-box;
        position: absolute;
        padding: 6px 10px 6px 10px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        width: 100%;
        left: 0;
        top: 0;
        background-image: linear-gradient(
          90deg,
          transparent,
          rgba(0, 0, 0, 0.5)
        );

        font-size: 12px;
        font-weight: 300;
        text-align: right;
        color: #fff;
      }
      &:after {
        display: block;
        content: '';
        border-radius: 2px;
        width: 80%;
        height: 80%;
        background-color: #d9d9d9;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;
        transform: translate(-33%, -50%);
        transition: all 0.4s;
        opacity: 0.6;
      }
      &:before {
        display: block;
        content: '';
        border-radius: 2px;
        width: 70%;
        height: 70%;
        background-color: #d9d9d9;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;
        transform: translate(-19%, -50%);
        opacity: 0.3;
        transition: all 0.5s;
      }
    }
    .info_name {
      display: block;
      height: 44px;
      margin-top: 10px;
      line-height: 22px;
      font-size: 16px;
      font-weight: 400;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
    }
    .tags {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
    }
    .tag {
      line-height: 22px;
      font-size: 12px;
      color: var(--color-text-height);
    }
    &:hover {
      .faceImg {
        &::after,
        &::before {
          background: var(--color-text-height);
        }
        &::after {
          left: 51%;
          transition: all 0.4s;
        }
        &::before {
          left: 52%;
          transition: all 0.5s;
        }
      }
    }
  }
}
</style>

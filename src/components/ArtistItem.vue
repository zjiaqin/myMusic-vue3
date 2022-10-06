<template>
  <div class="artist-list">
    <div class="artist-item" v-for="item in artistList" :key="item.id">
      <router-link
        class="faceImg"
        :to="{ path: '/singer', query: { id: item.id } }"
      >
        <el-image :src="item.picUrl + '?param=120y120'"></el-image>
      </router-link>
      <div class="info">
        <div class="top">
          <router-link :to="{ path: '/singer', query: { id: item.id } }">
            <div class="name">{{ item.name }}</div>
          </router-link>
          <i class="iconfont icon-collect"></i>
        </div>
        <div class="bottom">
          <span class="albumSize">
            <em>专辑</em>
            {{ item.albumSize }}
          </span>
          <span class="musicSize" v-show="item.musicSize">
            <em>单曲</em>
            {{ item.musicSize }}
          </span>
          <span class="fansSize" v-show="item.fansCount">
            <em>粉丝</em>
            {{ $utils.formartNum(item.fansCount) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  artistList: Array
})
</script>

<style lang="less" scoped>
.artist-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .artist-item {
    box-sizing: border-box;
    padding: 10px 0 10px 0;
    flex: 33%;
    max-width: calc((100% - 130px) / 3);

    display: flex;
    border-radius: 8px;
    margin: 20px 20px 0 30px;
    background: #fff;
    transition: all 0.3s ease-in-out;
    &:hover {
      border-bottom-left-radius: 80px;
      border-top-left-radius: 80px;
      max-width: calc((100% - 40px) / 3);

      margin: 20px 20px 0 0;
      padding: 10px 0 10px 10px;
      background: linear-gradient(
        45deg,
        rgb(249, 245, 143),
        rgb(253, 210, 192)
      );
      .faceImg {
        position: relative;
        left: 0px;
        .el-image {
          border-radius: 50%;
        }
      }
      .info {
        margin: 10px 10px 10px 20px;
      }
    }

    &:nth-child(3n) {
      margin-right: 0;
    }
    .faceImg {
      border-radius: 8px;
      transition: all 0.3s ease-in-out;
      position: relative;
      left: -30px;
      .el-image {
        transition: all 0.3s ease-in-out;
        border-radius: 8px;
        height: 100px;
        width: 100px;
      }
    }

    .info {
      transition: all 0.3s ease-in-out;
      flex: 1;
      margin: 10px 10px 10px -20px;
      .top {
        display: flex;
        justify-content: space-between;
        .name {
          font-size: 16px;
          font-weight: 700;
        }
      }
      .bottom {
        margin-top: 15px;
        width: 100%;

        display: flex;
        justify-content: space-between;
        span {
          text-align: center;
          display: block;
          font-size: 13px;
          color: #000;
          em {
            font-style: normal;
            display: block;
            color: var(--color-text);
          }
        }
      }
    }
  }
}
</style>

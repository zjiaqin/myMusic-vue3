<template>
  <div>
    <div class="home">
      <Banner />
      <!-- 热门推荐面板 -->
      <div class="panel">
        <div class="hot-list">
          <div class="h_title">
            <h3>热门推荐</h3>
            <span
              v-for="(item, index) in playlist_tags"
              :key="item.id"
              :class="index == playlist_index ? 'active' : ''"
              @click="choosePlayListType(index)"
            >
              {{ item.name }}
            </span>
          </div>
          <div class="wrapper">
            <play-list
              :playList="playlist_list"
              :loading="playlist_loading"
            ></play-list>
          </div>
        </div>
      </div>

      <!-- 新碟上架面板 -->
      <div class="panel">
        <div class="album_list">
          <div class="h_title">
            <h3>新碟上架</h3>
            <span
              :class="index === album_index ? 'active ' : ''"
              v-for="(item, index) in album_area"
              :key="item.code"
              @click="chooseAlbumListArea(index)"
            >
              {{ item.name }}
            </span>
          </div>
          <div class="wrapper">
            <album-list
              :loading="album_loading"
              :albumList="album_list"
            ></album-list>
          </div>
        </div>
      </div>
      <!-- 排行榜列表 -->
      <div class="top_list">
        <rank />
      </div>
      <!-- 最新MV面板 -->
      <div class="panel">
        <div class="MV_list">
          <div class="h_title">
            <h3>最新MV</h3>
            <span
              :class="index === mv_index ? 'active ' : ''"
              v-for="(item, index) in mv_area"
              :key="index"
              @click="chooseMvType(index)"
            >
              {{ item }}
            </span>
          </div>
          <div class="wrapper">
            <mv-list :loading="mv_loading" :mvList="mv_list"></mv-list>
          </div>
        </div>
      </div>
      <!-- 热门电台和热门歌手面板 -->
      <div class="dj-artist">
        <div class="panel dj">
          <div class="DJ_list">
            <div class="h_title">
              <h3>热门电台</h3>
            </div>
            <div class="wrapper">
              <dj-list />
            </div>
          </div>
        </div>
        <div class="panel artist">
          <div class="DJ_list">
            <div class="h_title">
              <h3>热门歌手</h3>
            </div>
            <div class="wrapper">
              <artist-list />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Banner from './Banner.vue'
import Rank from './Rank.vue'
import PlayList from '@/components/PlayList.vue'
import AlbumList from '@/components/AlbumList.vue'
import MvList from '@/components/MvList.vue'
import DjList from '@/components/DjList.vue'
import ArtistList from '@/components/ArtistList.vue'

import hot_recom from '@/utils/common/hot_recom.js'
import new_album from '@/utils/common/new_album.js'
import new_mv from '@/utils/common/new_mv.js'
const {
  playlist_tags,
  getHotTags,
  playlist_index,
  choosePlayListType,
  playlist_list,
  playlist_loading
} = hot_recom()

const {
  chooseAlbumListArea,
  getTopAlbumList,
  album_loading,
  album_list,
  album_area,
  album_index
} = new_album()

const { mv_area, mv_list, mv_index, mv_loading, chooseMvType } = new_mv()
</script>

<style lang="less" scoped>
.home {
  padding-bottom: 30px;
}
.h_title {
  padding: 30px 0 10px;
  h3 {
    display: inline-block;
    padding-right: 50px;
    font-size: 28px;
    font-weight: 700;
  }
  span {
    display: inline-block;
    font-size: 16px;
    margin-right: 40px;
    cursor: pointer;
    &.active {
      font-size: 16px;
      position: relative;
      z-index: 1;
      font-weight: 600;
      color: var(--color-text-main);
      &:after {
        position: absolute;
        content: '';
        left: 0;
        bottom: 1px;
        width: 100%;
        height: 6px;
        background: var(--color-text-height);
        z-index: -1;
      }
    }
  }
}

.panel {
  padding: 0 20px;
  margin-bottom: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}
.top_list {
  margin-bottom: 25px;
}
.dj-artist {
  display: flex;
  .dj {
    flex: 1;
  }
  .artist {
    margin-left: 20px;
    width: 440px;
  }
}
</style>

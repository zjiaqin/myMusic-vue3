<template>
  <div class="container">
    <div class="main">
      <div class="info">
        <div class="song-basic">
          <div class="song-info">
            <div class="panel"></div>
          </div>
          <div class="song-similar">
            <div class="panel"></div>
          </div>
        </div>
        <div class="song-lyric">
          <div class="panel"></div>
        </div>
      </div>
      <div class="comment">
        <div class="panel"></div>
      </div>
    </div>
    <div class="right-side">
      <div class="player">
        <div class="panel"></div>
      </div>
      <div class="list-similar">
        <div class="panel"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const route = useRoute()
const store = useStore()

// 数据
const songInfo = ref(null) //单曲信息
const simiSong = ref([]) //相似歌曲
const sID = route.query.id //歌曲ID
</script>

<style lang="less" scoped>
.panel {
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #fff;
  min-height: 80px;
  padding: 20px;
  margin-bottom: 20px;
}
.container {
  display: flex;
  .main {
    margin-right: 20px;
    flex: 1;
    .info {
      display: flex;

      .song-basic {
        margin-right: 20px;
        flex: 4;
      }
      .song-lyric {
        flex: 5;
      }
    }
  }
  .right-side {
    width: 350px;
  }
}
</style>

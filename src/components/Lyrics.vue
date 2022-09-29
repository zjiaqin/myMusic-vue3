<template>
  <div class="lyrics-main">
    <div class="lyrics" ref="lyricsRef" v-if="lyricObj" :style="transform">
      <p
        :class="index == currentIndex ? 'active' : ''"
        v-for="(item, index) in lyricObj"
        :key="item.time"
      >
        {{ item.text }}
      </p>
    </div>
    <div class="lyric-empty" v-else>
      <p v-if="hasLyric">歌词加载中....</p>
      <p v-else>纯音乐，无歌词</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { lyrics } from '@/api/home.js'

const props = defineProps({
  sId: String,
  currentTime: Number
})

const currentIndex = ref(0)
const lyricsRef = ref(null)
const lyricObj = reactive([])
const hasLyric = ref(true)

const getLyrics = async (id) => {
  const { data: res } = await lyrics(id)
  if (res.code !== 200) {
    return
  }
  formartLyric(res.lrc)
}

const formartLyric = (lrc) => {
  const lrcReg = /^\[(\d{2}):(\d{2}.\d{2,})\]\s*(.+)$/
  if (!lrc.lyric) {
    hasLyric.value = false
  }
  const lyricArr = lrc.lyric.split('\n')
  lyricArr.forEach((item) => {
    const arr = lrcReg.exec(item)
    if (!arr) return

    lyricObj.push({ time: arr[1] * 60 + arr[2] * 1, text: arr[3] })
  })
  lyricObj.sort((a, b) => {
    return a.time - b.time
  })
}

const findCurIndex = (t) => {
  for (let i = 0; i < lyricObj.length; i++) {
    if (t <= lyricObj[i].time) {
      return i
    }
  }
  return lyricObj.length
}

// 歌词实时滚动
const transform = computed(() => {
  if (currentIndex.value > 6) {
    return `transform: translateY(-${30 * (currentIndex.value - 6)}px)`
  } else {
    return 'transform: translateY(0)'
  }
})
onMounted(() => {
  getLyrics(props.sId)
})

watch(
  () => props.sId,
  (newVal) => {
    hasLyric.value = false
    lyricObj.splice(0)
    currentIndex.value = 0
    getLyrics(newVal)
  }
)

watch(
  () => props.currentTime,
  (newVal) => {
    // 无歌词的时候 不做动画滚动
    if (!lyricObj.length) {
      return
    }
    currentIndex.value = findCurIndex(newVal) - 1
  }
)
</script>

<style lang="less" scoped>
.lyrics-main {
  height: 100%;
  overflow-y: scroll;
  transition: all 1.5s ease-in-out;
}

.lyrics {
  font-size: 0;
  transform: translateY(0);
  transition: transform 1.5s ease-in-out;

  p {
    margin: 0;
    line-height: 30px;
    font-size: 14px;
    font-weight: 300;

    &.active {
      color: var(--color-text-height);
    }
  }
}
.lyric-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100px;
  font-size: 14px;
  color: var(--color-text-height);
}
</style>

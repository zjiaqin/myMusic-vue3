<template>
  <div class="box">
    <el-slider
      v-model="value"
      style="100px"
      max="200"
      :show-tooltip="false"
      @mousedown="fn1()"
      @mouseup="fn2()"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fn1 = () => {
  console.log(111)
}
const fn2 = () => {
  console.log(222)
}
const value = ref(100)
</script>
<style scoped>
.box {
  width: 100px;
}
/* 进度条样式 */
:deep(.el-slider__bar) {
  background: pink;
  border-radius: 4px;
  height: 4px;
}
/* 控制端头是否显示 */
:deep(.el-slider__button-wrapper) {
  /* display: none; */
}
/* 进度条背景样式 */
:deep(.el-slider__runway) {
  height: 4px;
}
/* 拖拽圆点样式 */
:deep(.el-slider__button) {
  background-color: pink;
  border: 1px;
  height: 12px;
  width: 12px;
}
</style>

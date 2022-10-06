<template>
  <div class="side-main">
    <router-link to="/" class="logo">
      <span class="red"></span>
      <span class="yellow"></span>
      <span class="green"></span>
    </router-link>
    <ul class="nav">
      <li
        v-for="item in menuList"
        :key="item.path"
        :class="{ 'is-active': menuActived.indexOf(item.path) != -1 }"
        @click="menuChange(item.path)"
      >
        <i :class="`iconfont icon-${item.path}`" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <div class="info"></div>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, reactive } from 'vue'

const route = useRoute()
const router = useRouter()
// 当前选择的菜单
const menuActived = computed(() => {
  return route.path
})

// 改变菜单的方法
const menuChange = (path) => {
  router.push({
    path: '/' + path
  })
}

const menuList = reactive([
  {
    name: '首页',
    path: 'index'
  },
  {
    name: '排行榜',
    path: 'rank'
  },
  {
    name: '歌单',
    path: 'playlist'
  },
  {
    name: 'MV',
    path: 'mvlist'
  },
  {
    name: '歌手',
    path: 'artist'
  }
])
</script>
<style lang="less" scoped>
.side-main {
  text-align: center;
}
.logo {
  margin-top: 20px;
  padding: 0 85px;
  display: flex;
  height: 80px;
  justify-content: space-around;
  align-items: center;
  span {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    opacity: 0.7;
  }
  .red {
    background-color: var(--color-text-height);
  }
  .yellow {
    background-color: yellow;
  }
  .green {
    background-color: yellowgreen;
  }
}
.nav {
  padding: 30px 35px 0;
  border-top: 1px solid #f5f5f5;
  li {
    display: flex;

    padding: 10px 16px;
    color: var(--color-text-main);
    border-radius: 8px;
    text-align: left;
    font-weight: 300;
    cursor: pointer;
    &.is-active {
      font-weight: 400;
      background-color: #fff;
      box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
      .iconfont {
        color: #fff;
        background-color: var(--color-text-height);
      }
    }
    span {
      line-height: 32px;
    }
    .iconfont {
      display: flex;
      width: 32px;
      height: 32px;
      background-color: #fff;
      /* offset-x | offset-y | blur-radius | color */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      font-size: 18px;
      color: var(--color-text);
      vertical-align: top;
    }
  }
}
</style>

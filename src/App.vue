<template>
  <el-container>
    <el-aside>
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header>
        <Navbar />
      </el-header>
      <el-main>
        <!-- 一级路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <PlayBar />
    <Login />
  </el-container>
</template>
<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Playbar from '@/components/PlayBarTmp/PlayBar.vue'
import Login from '@/components/Login.vue'
</script>

<style></style>

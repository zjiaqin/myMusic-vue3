import { defineConfig } from 'vite'
//vue的插件
import vue from '@vitejs/plugin-vue'
//按需引入组件的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
//按需引入组件的插件的element解析器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 引入path模块中的resolve方法
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})

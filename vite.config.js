import { defineConfig } from 'vite'
//vue的插件
import vue from '@vitejs/plugin-vue'
//按需引入组件的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
//按需引入组件的插件的element解析器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 按需引入element图标的插件
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// 引入path模块中的resolve方法
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        // 自动 导入 ElementPlus组件
        ElementPlusResolver(),
        // 自动 导入 图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    Components({
      resolvers: [
        // 自动 注册 Element组件
        ElementPlusResolver(),
        // 自动 注册 图标组件
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/less/main.less'
          )}";`
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: '0.0.0.0'
  }
})

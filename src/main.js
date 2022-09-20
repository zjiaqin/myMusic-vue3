// 引入app
import app from '@/utils/app'
import router from '@/router/index'
import store from '@/store'

// 引入样式
import 'normalize.css'

import '@/assets/css/global.css'
import '@/assets/less/reset.less'
import '@/assets/fonts/fonts.css'

app.use(router).use(store).mount('#app')

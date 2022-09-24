// 引入app
import app from '@/utils/app'
import router from '@/router/index'
import store from '@/store'
import util from '@/utils/util'
import common_list from './utils/common/common_list.js'

// 引入样式
import 'normalize.css'

import '@/assets/css/global.css'
import '@/assets/less/reset.less'
import '@/assets/fonts/fonts.css'

app.config.globalProperties['$utils'] = util
app.config.globalProperties['$common_list'] = common_list

app.use(router).use(store).mount('#app')

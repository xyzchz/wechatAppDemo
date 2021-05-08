import Vue from 'vue'
import App from './App'

import 'plu/useUView'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

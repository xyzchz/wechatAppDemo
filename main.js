import Vue from 'vue'
import App from './App'
import store from './store/index';
import protoUtils from './utils/protoUtils.js'

import 'plu/useUView'

Vue.config.productionTip = false

Vue.use(protoUtils);

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()

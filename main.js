import Vue from 'vue'
import App from './App'
import store from './store/index';

import 'plu/useUView'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()

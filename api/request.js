import { getToken } from './auth.js'

const request = (config) => {
	// 处理 apiUrl
	config.url = 'http://www.bagorders.com/api/admin/' + config.url;
	if(!config.data){
		config.data = {};
	}
	
	const token = getToken()	
	if(token) {
		config.header = { 'Authorization': 'Bearer ' + token }
	}
	
	let promise = new Promise((resolve, reject) => {
		console.log(config,55)
		if(!config.showLoading){
			uni.showLoading({
				title: '加载中...'
			})
		}
		uni.request(config).then(responses => {
			// 异常
			if (responses[0]) {
				reject({message : "网络超时"});
			} else {
				let response = responses[1].data; 
				// console.log(response.status_code)
				if(response.status_code === 422) {
					const key = Object.keys(response.errors)[0]
					uni.showToast({
						title: response.errors[key][0],
						icon: 'none',
						duration: 3000
					}) 
				} else if(response.success) {
						
				} else if(response.status_code == 401) {
					uni.clearStorageSync()
					uni.showToast({
						title: '登录已失效，请重新登录',
						icon: 'none',
						duration: 3000
					})
					
					uni.navigateTo({
						url: '/pages/user/login/login',
						
					})
					
				} else {
					uni.showToast({
						title: response.message,
						icon: 'none',
						duration: 3000
					})
				}
				resolve(response);
				uni.hideLoading()
			}
		}).catch(error => {
			reject(error);
		})
	})
	return promise;
};

export default request;
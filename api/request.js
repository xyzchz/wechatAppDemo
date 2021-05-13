import store from '../store/index.js';

let requestNumber = 0
const requestContinue = 100;

const request = (config) => {
	// 处理 apiUrl
	config.url = 'https://docsapi.foxitcloud.cn/' + config.url;
	if (!config.data) {
		config.data = {};
	}
	
	if (!config.header) {
			config.header = {
			appKey: 'uw8PbyY2',
			token: uni.getStorageSync('token') || '',
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		}
	} else {
		Object.assign(config.header, {
			'appKey': 'uw8PbyY2',
			'token': uni.getStorageSync('token') || ''
		})
	}

	const promise = new Promise((resolve, reject) => {
		if (!config.hideLoading) {
			requestNumber++;
			uni.showLoading({
				title: '加载中...'
			})
		}
		uni.request(config).then(responses => {
			if(!config.hideLoading) {
				console.log(requestNumber)
				requestNumber--;
				if (requestNumber === 0) uni.hideLoading();
			}
			console.log(responses)
			// 异常
			if (responses[0]) {
				reject({
					message: "网络超时"
				});
			} else {
				const { data } = responses[1];
				if (data.code === 200) return resolve(data);
				switch (data.code) {
					case 401: 
					uni.clearStorageSync()
					uni.showToast({
						title: '登录已失效，请重新登录',
						icon: 'none',
						duration: 3000
					})
					uni.redirectTo({
						url: '/pages/index/index',
					})
						break;
					default: uni.showToast({
						title: data.msg,
						icon: 'none',
						duration: 3000
					})
				}
			}
		}).catch(error => {
			if(!config.hideLoading) {
				requestNumber--;
				if (requestNumber === 0) uni.hideLoading();
			}
			reject(error);
		})
	})
	return promise;
};

export default request;

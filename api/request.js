import store from '../store/index.js';
import { REQUEST_URL, APPKEY } from '../const/const.js'
import { checkDocToken } from 'utils/login.js'

let requestNumber = 0
const requestContinue = 100;

const request = async (config) => {
	// 处理 apiUrl
	config.url = REQUEST_URL + config.url;
	if (!config.data) {
		config.data = {};
	}
	
	if (!config.header) {
			config.header = {
			appKey: APPKEY,
			token: uni.getStorageSync('token')?.token || '',
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		}
	} else {
		Object.assign(config.header, {
			'appKey': 'uw8PbyY2',
			'token': uni.getStorageSync('token') || ''
		})
	}
	
	if (config.url.indexOf('/user/getTokenByWxToken') === -1) {
		try {
			await checkDocToken()
		} catch (e) {
			return
		}
	}

	const promise = new Promise((resolve, reject) => {
		if (!config.hideLoading) {
			requestNumber++;
			uni.showLoading({
				title: '加载中...',
				mask: true,
			})
		}
		uni.request(config).then(responses => {
			if(!config.hideLoading) {
				requestNumber--;
				if (requestNumber === 0) uni.hideLoading();
			}
			// 异常
			if (responses[0]) {
				reject({
					message: "网络超时"
				});
			} else {
				const { data } = responses[1];
				if (data.code === 0) return resolve(data);
				switch (data.code) {
					case 401: 
					if (config.url.indexOf("getTokenByWxToken") !== -1) break;
					uni.removeStorageSync('token')
					uni.showLoading({
						title: '重新获取登陆信息...',
						mask: true,
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/folder/folder',
						})
					}, 1000)
						break;
					default: uni.showToast({
						title: data.msg,
						icon: 'none',
						duration: 3000
					})
				}
				return reject(data)
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

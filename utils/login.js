import {
	getToken
} from 'api'
import store from '../store/index.js'

function wxLogin() {
	return new Promise((resolve, reject) => {
		doWxlogin()
			.then(res => {
				resolve(res)
			})
			.catch(msg => {
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				store.commit('user/UPDATE_INIT_STATUS', false);
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 1400)
			})
	})
}

/**
 * 获取微信登陆
 */
function doWxlogin() {
	return new Promise((resolve, reject) => {
		getCode().then(res => {
			return getWxToken(res.code).then((res) => {
				resolve(res)
			})
		}).catch((msg) => {
			reject(msg)
		})
	})
}

/**
 * 获取微信code 过期5分钟
 */
function getCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			success: (res) => {
				resolve(res)
			},
			fail: () => {
				reject("网络错误, 请重试");
			}
		})
	})
}

/**
 * 获取微信token
 * 
 */
function getWxToken(code) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://wechatmp.foxitreader.cn/api/miniProgramLogin',
			data: {
				code,
				appid: "wxeeeee850023ae299"
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (data) => {
				if (data.data.ret == 0) {
					uni.setStorageSync('wxToken', data.data.data.token);
					delay(2000).then(res => {
						checkLogin().then(checkLoginRes => {
							return getCloudDocToken(data.data.data.token).then(res => {
								resolve(res)
							})
						}).catch((msg) => {
							reject(msg);
						})
					})
				} else {
					reject('用户code认证授权失败！');
					uni.hideLoading();
				}
			},
			fail: function(res) {
				reject("网络错误, 请重试")
			},
		})
	})
}

/**
 * 用户信息验证
 * 
 */
function checkLogin() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://wechatmp.foxitreader.cn/api/miniProgramCheckLogin',
			data: {
				...uni.getStorageSync('globalData'),
				token: uni.getStorageSync('wxToken')
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function(res) {
				if (res.data.ret === 0) {
					const globalData = uni.getStorageSync('globalData');
					//用户userId
					globalData.userInfo.userId = res.data.data.userId;
					//用户绑定手机
					globalData.userInfo.tel = res.data.data.tel;
					//用户绑定邮箱
					globalData.userInfo.email = res.data.data.email;
					//用户登录来源
					globalData.userInfo.type = res.data.data.type;
					//缓存用户信息
					wx.setStorageSync({
						key: "globalData",
						data: globalData
					})
					wx.setStorageSync("isLogin", true)
					resolve(res)
				} else {
					reject('登陆认证失败,签名有误!');
				}
			},
			fail: function(res) {
				reject('登陆认证失败!');
			},
		})
	})
}

/**
 * 获取云文档token
 * 
 */
function getCloudDocToken() {
	return new Promise((resolve, reject) => {
		getToken({
				wxToken: uni.getStorageSync('wxToken')
			})
			.then((res) => {
				uni.setStorageSync('token', {
					token: res.data.token,
					expireTime: new Date().getTime() + res.data.expireTime * 1000 - 300 * 1000
				})
				resolve(res)
			})
			.catch((res) => {
				console.log(res)
				reject('docToken获取错误');
			})
	})
}

/**
 * 重新获取token
 * 
 */
function reGetToken() {
	return new Promise((resolve, reject) => {
		uni.getUserInfo({
			success: res => {
				const globalData = {
					userInfo: res.userInfo,
					encryptedData: res.encryptedData,
					iv: res.iv,
					rawData: res.rawData,
					signature: res.signature
				}
				uni.showLoading({
					mask: true
				});
				uni.setStorageSync('globalData', globalData)
				wxLogin()
					.then((res) => {
						uni.hideLoading();
						resolve(res)
					})
					.catch((msg) => {
						uni.hideLoading();
						reject(msg)
					})
			},
			fail: (res) => {
				reject("网络错误, 请重试");
			}
		})
	})
}

// 验证token是否过期 过期重新获取
function checkDocToken() {
	return new Promise(async (resolve, reject) => {
		if (!uni.getStorageSync('token') || Number(uni.getStorageSync('token').expireTime) < Number(
				new Date().getTime())) {
			// 重新获取token
			try {
				// 首次尝试重新获取docToken
				console.log('获取云文档token')
				const tokenRes = await getToken({
					wxToken: uni.getStorageSync('wxToken') || false
				})
				uni.setStorageSync('token', {
					token: tokenRes.data.token,
					expireTime: new Date().getTime() + tokenRes.data.expireTime * 1000 - 300 * 1000
				})
				resolve();
			} catch (msg) {
				// 初次获取doctoken失败后，重新获取wxToken后再获取DocToken
				try {
					console.log('获取微信token', msg)
					const reGetTokenRes = await reGetToken()
					resolve()
				} catch (msg) {
					console.log('获取微信token错误', msg)
					uni.showToast({
						icon: 'none',
						title: msg
					})
					reject()
				}
			}
		} else {
			resolve()
		}
	})
}

function delay(time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, time)
	})
}

export {
	wxLogin,
	reGetToken,
	checkDocToken
}

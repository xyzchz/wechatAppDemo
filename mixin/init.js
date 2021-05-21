import {
	certification,
	getUserInfo,
	getRootFolderId,
	findDocSettingList,
	getToken,
} from "api";
import {
	mapMutations,
	mapState,
	mapActions
} from "vuex";
import {
	reGetToken
} from '../utils/login.js'
import {
	REQUEST_URL
} from '../const/const.js'
export default {
	computed: {
		...mapState('user', [
			"initStatus",
		]),
	},
	methods: {
		...mapMutations('user', [
			"UPDATE_CERTIFICATION",
			"UPDATE_USER_INFO",
			"UPDATE_USER_ROOT_FOLDER",
			"UPDATE_USER_DOC_SETTING",
			"UPDATE_INIT_STATUS",
		]),
		...mapActions('label', ["GET_LABEL_LIST"]),
		/**
		 * [findDocSettingList 获取用户限制参数设置]
		 *
		 * @return  {[type]}  [return description]
		 */
		findDocSettingList() {
			return new Promise((resolve, reject) => {
				findDocSettingList().then(
					(res) => {
						this.UPDATE_USER_DOC_SETTING(res.data);
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
			});
		},
		/**
		 * [获取用户根文档ID]
		 *
		 * @return  {[type]}       [return description]
		 */
		getRootFolderId() {
			if (uni.getStorageSync('rootFolder')) return Promise.resolve({
				...uni.getStorageSync('rootFolder'),
				code: 0
			});
			return new Promise((resolve, reject) => {
				getRootFolderId().then(
					(res) => {
						uni.setStorageSync('rootFolder', res.data);
						resolve(res)
					}
				);
			});
		},
		/**
		 * [certification 认证]
		 *
		 * @return  {[type]}       [return description]
		 */
		certification() {
			return new Promise((resolve, reject) => {
				certification().then(
					(res) => {
						if (res.code === 0) {
							this.UPDATE_CERTIFICATION(res.data);
						}
						resolve(res)
					},
					(err) => {
						reject(err);
					}
				);
			})
		},
		/**
		 * [获取用户信息]
		 *
		 * @return  {[type]}       [return description]
		 */
		getUserInfo() {
			return new Promise((resolve, reject) => {
				getUserInfo().then(
					(res) => {
						this.UPDATE_USER_INFO(res.data);
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
			})
		},
		/**
		 * [initUserInfo 初始化用户信息]
		 *
		 * @return  {[type]}  [return description]
		 */
		initUserInfo() {
			return new Promise((resolve, reject) => {
				Promise.all([
					this.certification(),
					this.getUserInfo(),
					this.getRootFolderId(),
					this.findDocSettingList(),
					this.GET_LABEL_LIST(),
				]).then(res => {
					const isSuccess = res.every(item => item.code === 0)
					if (isSuccess) resolve(res)
					if (!isSuccess) {
						localStorage.clear();
						window.location.href = `${REQUEST_URL}/logout?url=${window.location.href}`;
					} // 登出 
				})
			})
		},
		/**
		 * [init 初始化]
		 *
		 * @return  {[type]}  [return description]
		 */
		init() {
			if (uni.getStorageSync('token') && Number(uni.getStorageSync('token').expireTime) > Number(new Date()
					.getTime())) {
				if (!this.initStatus) {
					return new Promise((resolve, reject) => {
						this.initUserInfo().then(() => {
							this.UPDATE_INIT_STATUS(true)
							resolve()
						})
					})
				}
				return new Promise((resolve => {
					resolve()
				}))
			} else {
				return new Promise((resolve, reject) => {
					getToken({
							wxToken: uni.getStorageSync('wxToken') || false
						})
						.then(res => {
							uni.setStorageSync('token', {
								token: res.data.token,
								expireTime: new Date().getTime() + res.data.expireTime * 1000 - 300 * 1000 // 提早5分钟过期
							})
							this.initUserInfo().then(() => {
								this.UPDATE_INIT_STATUS(true)
								resolve();
							})
						})
						.catch((err) => {
							reGetToken().then(() => {
								resolve();
							})
						})
				})
			}
		},
	},
};

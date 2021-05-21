export default {
	methods: {
		setSelectedTabbar(index) {
			if (typeof this.$mp.page.getTabBar === 'function' &&
				this.$mp.page.getTabBar()) {
				this.$mp.page.getTabBar().setData({
					selected: index
				})
			}
		},
		// 拦截未登录跳转 wxf51b2594be7627c4
		beforeSwitch(index) {
			if (index === 1) return true
			if (index !== 1) {
				if (uni.getStorageSync('isLogin')) {
					if(index !== 3) return true;
					uni.navigateToMiniProgram({
						appId: "wxf51b2594be7627c4"
					})
					return false
				}
				uni.redirectTo({
					url: '/pages/login/login?url=/pages/folder/folder'
				});
			} else return false;
		},
	}
}
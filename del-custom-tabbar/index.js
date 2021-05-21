Component({
	data: {
		selected: 0,
		"borderStyle": "white",
		"backgroundColor": "#FFFFFF",
		"color": "#999999",
		"selectedColor": "#3370ff",
		"list": [{
			"pagePath": "pages/index/index",
			"iconPath": "/static/img/tabs/home.png",
			"selectedIconPath": "/static/img/tabs/home_.png",
			"text": "首页"
		}, {
			"pagePath": "pages/folder/folder",
			"iconPath": "/static/img/tabs/folder.png",
			"selectedIconPath": "/static/img/tabs/folder_.png",
			"text": "文档"
		}, {
			"pagePath": "pages/appCenter/appCenter",
			"iconPath": "/static/img/tabs/appCenter.png",
			"selectedIconPath": "/static/img/tabs/appCenter_.png",
			"text": "应用"
		}, {
			"pagePath": "pages/userCenter/userCenter",
			"iconPath": "/static/img/tabs/userCenter.png",
			"selectedIconPath": "/static/img/tabs/userCenter_.png",
			"text": "我的"
		}]
	},
	attached() {},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			if(data.index !== 1 && !wx.getStorageSync('token')) {
				return wx.redirectTo({
					url: '/pages/login/login?url=' + 'data.path'
				})
			}
			wx.switchTab({
				url: '/' + data.path
			})
		}
	}
})

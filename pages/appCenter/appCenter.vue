<template>
	<div class="container">
		<h3>我的应用</h3>
		<ul class="list">
			<li>
				<div @click="toWebviewApp(`https://edit.foxitcloud.cn`)">
					<img src="/static/img/appCenter/ybj_s.png" />
					<span>云编辑</span>
				</div>
			</li>
			<li>
				<div @click="navigateToMiniProgram('wx4ada77ce25d35650')">
					<img src="/static/img/appCenter/yhy_s.png" />
					<span>云会议</span>
				</div>
			</li>
			<li>
				<div @click="toWebviewApp('https://sj.pdf365.cn')">
					<img src="/static/img/appCenter/ysj_s.png" />
					<span>云收集</span>
				</div>
			</li>
			<li>
				<div @click="navigateToMiniProgram('wx2bacd60eedbd9065')">
					<img src="/static/img/appCenter/ymb_s.png" />
					<span>云模板</span>
				</div>
			</li>
			<li>
				<div @click="navigateToMiniProgram('wx16c7354ce301319d')">
					<img src="/static/img/appCenter/yfy_s.png" />
					<span>云翻译</span>
				</div>
			</li>
		</ul>
		<u-tabbar :before-switch="beforeSwitch" :list="tabbar" height="88" active-color="#3370ff" icon-size="30" inactive-color="#999999"></u-tabbar>
	</div>
</template>

<script>
	import tabbarMixin from 'mixin/tabbarMixin'
	import {
		TABBAR
	} from 'const/const.js'
	export default {
		data() {
			return {
				tabbar: ''
			}
		},
		methods: {
			navigateToMiniProgram(appId) {
				uni.navigateToMiniProgram({appId})
			},
			toWebviewApp(url) {
				if (url.indexOf('edit') !== -1) {
					url = encodeURIComponent(`${url}?token=${uni.getStorageSync('wxToken')}`)
				} else {
					url = encodeURIComponent(url)
				}
				uni.navigateTo({
					url: `/pages/webViewApp/webViewApp?url=${url}`
				})
			},
		},
		mixins: [tabbarMixin],
		onShow() {
			this.setSelectedTabbar(2)
		},
		onLoad(e) {
			this.tabbar = TABBAR;
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 55rpx 40rpx 0;
		background-color: #F7F7F7;
		height: 100vh;

		h3 {
			height: 30rpx;
			font-family: MicrosoftYaHei;
			font-size: 28rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 1rpx;
			color: #333333;
			margin-bottom: 20rpx;
		}

		.list {
			background-color: rgb(242, 242, 242);
			height: calc(100% - 55rpx - 50rpx - 88rpx);
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			align-content: flex-start;

			li {
				height: 87rpx;
				width: 325rpx;
				border-radius: 4rpx;
				background-color: #ffffff;
				border: solid 1rpx #dddddd;
				margin-bottom: 20rpx;

				div {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;
				}

				img {
					width: 58rpx;
					height: 58rpx;
					margin-left: -8rpx;
				}

				span {
					margin-left: 15rpx;
					font-family: MicrosoftYaHei;
					font-size: 24rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #333333;
				}
			}
		}
	}
</style>

<!--
 * @Author: your name
 * @Date: 2021-04-21 15:04:45
 * @LastEditTime: 2021-04-25 18:11:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\common\app\Tabs.vue
-->
<template>
	<div class="tabsContainer">
		<div v-if="route === 'pages/index/index'">
			<img src="/static/img/tabs/home_.png" />
			<span class="actived">主页</span>
		</div>
		<div v-else @click="to('index')">
			<img src="/static/img/tabs/home.png" />
			<span>主页</span>
		</div>
		<div v-if="route === 'pages/folder/folder'">
			<img src="/static/img/tabs/folder_.png" />
			<span class="actived">文档</span>
		</div>
		<div v-else @click="to('folder')">
			<img src="/static/img/tabs/folder.png" />
			<span>文档</span>
		</div>
		<div v-if="route === 'pages/appCenter/appCenter'">
			<img src="/static/img/tabs/appCenter_.png" />
			<span class="actived">应用</span>
		</div>
		<div v-else @click="$router.push({ name: 'AppCenter' })">
			<img src="/static/img/tabs/appCenter.png" />
			<span>应用</span>
		</div>
		<div v-if="route === 'pages/userCenter/userCenter'">
			<img src="/static/img/tabs/userCenter_.png" />
			<span class="actived">我的</span>
		</div>
		<div v-else @click="$router.push({ name: 'UserCenter' })">
			<img src="/static/img/tabs/userCenter.png" />
			<span>我的</span>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title: "底部tabbar",
			};
		},
		mounted() {
			console.log(this.route)
		},
		props: {
			route: {
				type: String,
			},
		},
		methods: {
			to(name) {
				uni.redirectTo({
				    url: `/pages/${name}/${name}`,
						disableScroll: true
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tabsContainer {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&>div {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex: 1;
			height: 88rpx;
			padding: 15rpx;

			span {
				height: 20rpx;
				font-family: MicrosoftYaHei;
				font-size: 20rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 40rpx;
				letter-spacing: 0rpx;
				color: #999999;
			}
		}

		img {
			width: 30rpx;
			height: 30rpx;
		}

		.actived {
			color: #3370ff!important;
		}
	}
</style>

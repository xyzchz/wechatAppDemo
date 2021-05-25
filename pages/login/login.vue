<template>
	<view class="container">
		<image class='prompt' src='/static/img/login/icon.png'></image>
		<view class='text'>请授权小程序以继续使用福昕云文档服务</view>
		<button class='getUserInfo' @click="handleGetUserInfo ">
			<image src='/static/img/login/wx.png'></image>
			<view class='line'></view>
			<view class='lines'></view>
			<text>微信授权登录</text>
		</button>
		<button class='getUserInfo onphone' bindtap='onPhone'>
			<image src='/static/img/login/phone.png'></image>
			<view class='line'></view>
			<!-- <view class='lines'></view> -->
			<text>账号密码登录</text>
		</button>
		<view class='tip' @click='goHome'>暂不登录</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { wxLogin } from '../../utils/login.js'

	export default {
		data() {
			return {
			}
		},

		created() {
			uni.clearStorage();
		},

		methods: {
			...mapMutations('user', [
				"UPDATE_GLOBAL_DATA",
			]),
			/**
			 * 返回文档页
			 */
			goHome() {
				wx.reLaunch({
					url: '/pages/folder/folder'
				})
			},
			/**
			 * 获取用户授权
			 * 
			*/
			handleGetUserInfo() {
				// 授权
				uni.getUserProfile({
					desc: 'Login', // 这个参数是必须的
					success: res => {
						const globalData = {
							userInfo: res.userInfo,
							encryptedData: res.encryptedData,
							iv: res.iv,
							rawData: res.rawData,
							signature: res.signature
						}
						uni.showLoading({
							title: '授权中...',
							mask: true,
						})
						uni.setStorageSync('globalData', globalData);
						wxLogin().then((res) => {
							uni.hideLoading();
							uni.showToast({
								title: '授权成功',
								icon: 'success'
							})
							uni.reLaunch({
								url: this.$mp.page.options.url || '/pages/folder/folder'
							})
						})
					},
					fail: (res) => {
						uni.showToast({
							title: '授权失败，请重试',
							icon: 'none'
						})
					}
				})
			},
		},
	}
</script>

<style>
	.prompt {
		width: 200rpx;
		height: 243rpx;
		display: block;
		margin: 270rpx auto 110rpx;
	}

	.text {
		color: #666666;
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 50rpx;
	}

	.getUserInfo {
		width: 86%;
		height: 90rpx;
		line-height: 90rpx;
		margin: 0 auto;
		border-radius: 5rpx;
		background: #38b54a;
		position: relative;
		border: none;
	}

	.getUserInfo image {
		width: 39rpx;
		height: 32rpx;
		position: absolute;
		left: 30rpx;
		top: 50%;
		margin-top: -16rpx;
	}

	.getUserInfo text {
		color: #fff;
		font-size: 32rpx;
	}

	.getUserInfo .line {
		height: 60rpx;
		position: absolute;
		top: 50%;
		margin-top: -30rpx;
		width: 2rpx;
		background: #DDD;
		left: 100rpx;
		z-index: 99999;
	}

	.getUserInfo .lines {
		height: 60rpx;
		position: absolute;
		top: 50%;
		width: 2rpx;
		left: 103rpx;
		margin-top: -30rpx;
		background: #57cb67;
	}

	.onphone {
		margin-top: 30rpx;
		background: #fff;
	}

	.onphone image {
		height: 38rpx;
	}

	.onphone text {
		color: #666666;
		font-size: 32rpx;
	}

	.tip {
		float: right;
		text-align: right;
		padding-right: 100rpx;
		margin-top: 30rpx;
		font-size: 32rpx;
		color: #999999;
		text-decoration: underline;
		width: 100%;
	}
</style>

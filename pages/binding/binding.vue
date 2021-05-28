<template>
	<view class="share-binding">
		<view class="share-binding-w">
			<image src="/static/img/bindTel.png"></image>
			<text>应国家法规对账号实名的要求，</text>
			<text>分享需绑定手机号</text>
			<button @click="jumpBiningTel">立即绑定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				
			}
		},
		methods: {
			jumpBiningTel() {
				uni.navigateTo({
					url: `/pages/bindPhone/bindPhone?docId=${this.$mp.page.options.docId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.share-binding {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.share-binding image {
	width: 273rpx;
	height: 267rpx;
	display: block;
	margin: 0 auto 50rpx;
}
.share-binding text {
	display: block;
	font-size: 28rpx;
	color: #666666;
	text-align: center;
	margin-bottom: 10rpx;
}
.share-binding button {
	width: 670rpx;
	height: 92rpx;
	line-height: 92rpx;
	border-radius: 5rpx;
	background: #4096ff;
	color: #fff;
	font-size: 28rpx;
	margin-top: 100rpx;
}
</style>

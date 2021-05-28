<template>
	<view class="search" @click="toSearch">
		<image src="/static/img/home/search.png" />
		搜索
	</view>
</template>

<script>
	
	export default {
		name:"search",
		data() {
			return {
				
			};
		},
		methods:{
			toSearch() {
				if (!uni.getStorageSync('isLogin')) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				} else {
					// todo toSearch
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.search {
		width: 690rpx;
		height: 60rpx;
		background-color: #F7F7F7;
		border-radius: 8rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		font-family: MicrosoftYaHei;
		font-size: 24rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 1rpx;
		color: #bbbbbb;

		image {
			width: 25rpx;
			height: 25rpx;
			margin-right: 15rpx;
		}
	}
</style>

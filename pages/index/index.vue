<template>
	<view class="content">
		<view class="header">
			<Header />
		</view>
		<view class="line" />
		<view class="list">
			<view class="tabs">
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" bar-height="3"
					active-color="#333333" inactive-color="#999999"></u-tabs-swiper>
			</view>
			<view class="listContent">
				<swiper height="300rpx" :current="swiperCurrent" @transition="transition"
					@animationfinish="animationfinish">
					<swiper-item class="swiper-item" :key="index">
						000
					</swiper-item>
					<swiper-item class="swiper-item" :key="index">
						111
					</swiper-item>
					<swiper-item class="swiper-item" :key="index">
						222
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="shadow" />
	</view>
</template>

<script>
	import Header from '../../components/header.vue'

	export default {
		data() {
			return {
				route: this.$mp.page.route,
				list: [{
					name: '最近'
				}, {
					name: '分享'
				}, {
					name: '标签',
				}],
				current: 0,
				swiperCurrent: 0,
			}
		},
		onLoad(e) {},
		components: {
			Header,
		},
		methods: {
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				const dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				const current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
		},
	}
</script>

<style>
	page {
		background: #F8F8F8
	}
</style>

<style scoped lang="scss">
	.content {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		height: 274rpx;
		width: 100vw;
		background-color: white;
	}

	.line {
		height: 20rpx;
		width: 100vw;
	}

	.bottomTabs {
		position: absolute;
		bottom: 0;
		z-index: 100;
		height: 88rpx;
		width: 100%;
	}

	.list {
		flex: auto;
		background-color: white;
		display: flex;
		flex-direction: column;

		swiper {
			height: 100%;
		}

		.tabs {
			width: 100vw;
		}

		.listContent {
			flex: auto;
		}
	}

	.shadow {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 1px;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
	}
</style>

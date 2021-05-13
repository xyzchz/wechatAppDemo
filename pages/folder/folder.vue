<template>
	<view class="content">
		<text class="title">{{title}}</text>
		<div v-if="isShowTabs" class="bottomTabs">
			<Tabs :route="route" />
		</div>
		<view class="shadow" />
	</view>
</template>

<script>
	import Tabs from '../../components/tabbar.vue'

	export default {
		data() {
			return {
				title: '文档',
				isShowTabs: false,
				route: this.$mp.page.route
			}
		},
		onLoad(e) {
		},
		components: {
			Tabs,
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.bottomTabs {
		position: absolute;
		bottom: 0;
		z-index: 100;
		height: 88rpx;
		width: 100%;
	}
	.shadow{
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 1px;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
	}
</style>

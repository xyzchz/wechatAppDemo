<template>
	<view class="content">
		<text class="title">{{title}}</text>
		<div v-if="isShowTabs" class="bottomTabs">
			<Tabs :route="route" />
		</div>
	</view>
</template>

<script>
	import Tabs from '../../components/tabbar.vue'

	export default {
		data() {
			return {
				title: '首页',
				isShowTabs: true,
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
</style>

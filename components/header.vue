<template>
	<div class="header">
		<div class="main">
			<Search />
			<div class="toolsBox">
				<div class="item">
					<img class="toolImg" src="/static/img/home/ybj.png" />
					<span>云编辑</span>
				</div>
				<div class="item">
					<img class="toolImg" src="/static/img/home/yhy.png" />
					<span>云会议</span>
				</div>
				<div class="item">
						<img class="toolImg" src="/static/img/home/ysj.png" />
						<span>云收集</span>
				</div>
				<div class="item">
						<img class="toolImg" src="/static/img/home/ymb.png" />
						<span>云模板</span>
				</div>
				<div class="item" @click="toAppCenter">
					<img class="toolImg" src="/static/img/home/moreTools.png" />
					<span>更多工具</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Search from './search.vue'
	import {
		mapState
	} from "vuex";

	export default {
		data() {
			return {};
		},
		components:{
			Search
		},
		methods: {
			toAppCenter() {
				uni.switchTab({
					url: '/pages/appCenter/appCenter'
				})
			},
		},
		mounted() {},
	};
</script>

<style scoped lang="scss">
	.header {
		height: 274rpx;
		padding-top: 41rpx;
		display: flex;
		flex-direction: column;
	}

	.main {
		height: 233rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.line {
		height: 20rpx;
		width: 100%;
		background-color: rgb(242, 242, 242);
	}

	.toolsBox {
		display: flex;
		align-items: center;
		flex: auto;
		justify-content: space-around;
		.toolImg {
			height: 90rpx;
			width: 90rpx;
			margin-bottom: 15rpx;
		}

		&>div {
			flex: 1;
			letter-spacing: 1rpx;
			color: #333333;
		}

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex: auto;
			padding-top: 15rpx;

			span {
				font-family: MicrosoftYaHei;
				font-size: 20rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 17rpx;
				letter-spacing: 1rpx;
				letter-spacing: 1rpx;
				color: #333333;
			}
		}
	}
</style>

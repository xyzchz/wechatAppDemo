<template>
	<view class="container">
		<scroll-view class="pullRefresh" :refresher-triggered="triggered" @refresherrefresh="onRefresh" refresher-enabled scroll-y="true">
			<u-cell-group class="labelPage_cell_group_skeleton" v-if="showSkeleton">
				<u-cell-item :key="index" v-for="index in 20" :arrow="false">
					<text slot="icon" class="icon"></text>
					<text slot="title" class="title"></text>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group v-if="!showSkeleton && labelList && labelList.length > 0" class="labelListPage_cell_group">
				<u-cell-item :key="item.id" v-for="item in labelList" :arrow="false" :hover-class="false">
					<text slot="icon" :style="{ backgroundColor: item.labelColor }" class="icon"></text>
					<text slot="title" class="title">{{ item.labelName }}</text>
					<view slot="right-icon" class="right-icon" @click="showMenu(item)"><image class="optPng" mode="widthFix" src="/static/img/menu/opt.png"></image></view>
				</u-cell-item>
			</u-cell-group>
			<view class="no-list-w" v-else>
				<image class="no-share" src="/static/img/noShare.png"></image>
				<text class="tips">您还没有标签！</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
import { LABEL_COLOR } from 'const/const';


export default {
	data() {
		return {
			showSkeleton: true,
			triggered: false,
			_freshing: false,
		};
	},
	computed:{
		labelList () {
			return this.$store.state.label.labelList;
		}
	},
	methods: {
		...mapActions('label', ['GET_LABEL_LIST']),
		// 下拉刷新
		onRefresh() {
			if (this._freshing) {
				this.triggered = false;
				return;
			}
			this._freshing = true;
			if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true
			const callback = () => {
				this.triggered = false;
				this._freshing = false;
			};
			this.GET_LABEL_LIST({ hideLoading: true })
				.then(res => {
					callback();
				})
				.catch(err => {
					callback();
				});
		},
		showMenu(item) {
			this.$emit("showLabelPupup", item)
		},
		init() {
			if (this.$store.state.label.labelList) {
				this.showSkeleton = false;
				return;
			}
			this.GET_LABEL_LIST().then(res => {
				this.showSkeleton = false;
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.container {
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	height: 100%;
	width: 100%;
}

.labelPage_cell_group_skeleton {
	.icon {
		height: 24rpx;
		width: 24rpx;
		border-radius: 12rpx;
		background-color: $skeColor;
		margin-right: 29rpx;
	}
}

.pullRefresh {
	height: 100%;
	.icon {
		height: 24rpx;
		width: 24rpx;
		border-radius: 12rpx;
		margin-right: 29rpx;
	}
	.title {
		font-family: MicrosoftYaHei;
		font-size: 28rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 1rpx;
		color: #333333;
	}
	.right-icon {
		height: 100rpx;
		display: flex;
		align-items: center;
		.optPng {
			width: 34rpx;
			height: auto;
		}
	}
}

.no-list-w {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	.no-share {
		width: 291rpx;
		height: 233rpx;
		margin: 0 auto 30rpx;
		display: block;
	}
	.tips {
		font-size: 32rpx;
		color: #999999;
		text-align: center;
		display: block;
	}
}
</style>

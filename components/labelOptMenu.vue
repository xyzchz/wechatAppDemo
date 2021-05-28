<template>
	<u-popup v-model="show" mode="bottom" border-radius="0" closeOnClickOverlay class="popup">
		<ul class="otherOpt">
			<li @click.stop="toCreateLabel">
				<image class="img" mode="widthFix" src="/static/img/menu/addLabel.png" />
				<span>新建标签</span>
			</li>
			<li @click.stop="rename">
				<image class="img" mode="widthFix" src="/static/img/menu/share.png" />
				<span>编辑标签</span>
			</li>
			<li @click.stop="removeItem">
				<image class="img" mode="widthFix" src="/static/img/menu/del.png" />
				<span>删除标签</span>
			</li>
		</ul>
		<div class="line" />
		<view class="btn" @click="show = false">取消</view>
	</u-popup>
</template>

<script>
import Bus from 'utils/bus';

export default {
	data() {
		return {
			show: false
		};
	},
	methods: {
		toggleModal() {
			this.show = !this.show;
		},
		toCreateLabel() {
			this.show = false;
			uni.navigateTo({
				url: '/pages/createLabel/createLabel'
			});
		},
		rename() {
			this.show = false;
			const { labelColor, id, labelName } = this.listItem;
			uni.navigateTo({
				url: this.urlPlusOptions('/pages/createLabel/createLabel', { labelColor, id, labelName })
			});
		},
		removeItem() {
			this.show = false;
			this.$emit('showLabelDelModal');
		}
	},
	props: {
		listItem: {
			required: true,
			type: Object | null
		}
	}
};
</script>

<style lang="scss" scoped>
.height584 {
	height: 584rpx !important;
}
.popup {
	overflow: hidden;
	height: 682rpx;
	border-radius: 10rpx 10rpx 0 0;
	.otherOpt {
		width: 100%;
		overflow: hidden;
		li:not(:last-child):after {
			content: '';
			height: 1px;
			background-color: #eeeeee;
			transform: scaleY(0.5);
			position: absolute;
			display: block;
			left: 40rpx;
			bottom: 0;
			width: calc(100% - 80rpx);
		}
		li:hover {
			background-color: $skeColor;
		}
		li {
			width: 700rpx;
			padding-left: 50rpx;
			width: 100%;
			position: relative;
			height: 110rpx;
			display: flex;
			align-items: center;
			.img {
				width: 33rpx;
				margin-right: 30rpx;
			}
			span {
				font-family: MicrosoftYaHei;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1rpx;
				color: #333333;
			}
		}
	}
}
.btn {
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	width: 100%;
	background-color: white;
	font-family: MicrosoftYaHei;
	font-size: 32rpx;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 2rpx;
	color: #333333;
	&:hover {
		color: #666666;
		background-color: $skeColor;
	}
}

.line {
	width: 100%;
	height: 14rpx;
	background-color: #f7f7f7;
}
</style>

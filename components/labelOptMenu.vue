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
			})
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
	.head {
		height: 24rpx;
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		.block {
			width: 72rpx;
			height: 8rpx;
			background-color: #dee0e3;
			border-radius: 4rpx;
		}
	}
	.fileInfo {
		padding: 0 30rpx;
		height: 107rpx;
		display: flex;
		align-items: center;
		img {
			width: 66rpx;
			height: 66rpx;
			margin-right: 24rpx;
		}
		.fileName {
			font-family: MicrosoftYaHei;
			font-size: 0;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 1rpx;
			color: #333333;
			display: block;
			width: 489rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			& > span:nth-child(1) {
				font-family: MicrosoftYaHei;
				font-size: 30rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 2rpx;
				color: #333333;
				display: inline-block;
				max-width: 370rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			& > span:nth-child(2) {
				font-family: MicrosoftYaHei;
				font-size: 30rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 2rpx;
				color: #333333;
				width: 100rpx;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.line {
		width: 100%;
		height: 10rpx;
		background-color: #f7f7f7;
	}

	.otherOpt {
		width: 100%;
		overflow: hidden;
		li:not(:last-child) {
			border-bottom: 1px solid #eeeeee;
		}
		li {
			width: 700rpx;
			margin-left: 50rpx;
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
</style>

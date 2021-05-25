<template>
	<view v-if="!info" class="container">
		<view class="fileName_skeleton"><view class="title" /></view>
		<view class="list_skeleton">
			<u-cell-group class="labelPage_cell_group_skeleton">
				<u-cell-item :key="index" v-for="index in 20" :arrow="false" :hover-class="false">
					<text slot="icon" class="icon"></text>
					<text slot="title" class="title"></text>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
	<view v-else class="container">
		<view class="fileName">
			<view class="title">
				<p class="fileName_p">
					<span>{{ info | formatListName }}</span>
					<span v-if="info.docId">{{ getExtName(info.fileName) ? `.${getExtName(info.fileName)}` : '' }}</span>
				</p>
			</view>
		</view>
		<view class="list" v-if="totalLabelList && totalLabelList.length > 0">
			<u-cell-group class="labelPage_cell_group">
				<u-cell-item :key="item.id" v-for="item in totalLabelList" @click="checkedLabel(item.id)" :arrow="false">
					<text slot="icon" :style="{ backgroundColor: item.labelColor }" class="icon"></text>
					<text slot="title" class="title">{{ item.labelName }}</text>
					<image mode="widthFix" :src="item.checked?'/static/img/labelSelect.png':''" slot="right-icon" class="right-icon"></image>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="no-list-w" v-else>
			<image class="no-share" src="/static/img/noShare.png"></image>
			<text>您还没有标签！</text>
		</view>
		<view class="button">
			<view class="line" />
			<u-button @click="toCreateLabel">新建标签</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { getDocFile, getDocFolder, bindDocFolderLabel, unbindDocFolderLabel, bindDocFile, unbindDocFile } from 'api';
import { LABEL_COLOR } from 'const/const';

export default {
	data() {
		return {
			info: null,
			labelList: [],
			loading: false,
		};
	},
	computed: {
		totalLabelList() {
			const tempLabelList = this.$store.state.label.labelList;
			// 选中已存在label
			const totalLabelList = tempLabelList.map(item => {
				if (this.labelList.some(current => current.id === item.id)) {
					item.checked = true;
					return item;
				} else {
					item.checked = false
				}
				return item;
			});
			return totalLabelList;
		}
	},
	onShow() {
		const { docId, folderId } = this.$mp.page.options;
	  const req = docId? getDocFile: getDocFolder;
		const data = docId? { docId }: { folderId };
		req(data).then(res => {
			this.info = res.data;
			this.labelList = res.data.labelList || [];
		});
	},
	methods: {
		toCreateLabel() {
			uni.navigateTo({
				url: '/pages/createLabel/createLabel'
			});
		},
		checkedLabel(id) {
			uni.showLoading({
				title: '执行中...',
				mask: true,
			})
			const label = this.totalLabelList.find(item => {
				return item.id === id;
			});
			const { docId, folderId } = this.$mp.page.options;
			const params = docId? {docId, labelId: id}: {folderId, labelId: id}
			if (label.checked) {
				// 已存在 移除该标签
				const reqFunction = docId? unbindDocFile: unbindDocFolderLabel;
				reqFunction(params).then(res => {
					const index = this.labelList.findIndex(item => item.id === id)
					this.labelList.splice(index, 1)
					uni.hideLoading();
					this.$refs.uToast.show({
						title: '标签取消成功',
						duration: 1000,
					})
				})
			} else {
				// 未存在添加
				const reqFunction = docId? bindDocFile: bindDocFolderLabel;
				reqFunction(params).then(res => {
					this.labelList.push(label);
					uni.hideLoading();
					this.$refs.uToast.show({
						title: '标签选择成功',
						duration: 1000,
					})
				})
			}
		}
	}
};
</script>

<style scoped lang="scss">
.container {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.fileName_skeleton {
	display: flex;
	align-items: center;
	height: 94rpx;
	background-color: rgb(242, 242, 242);
	padding-left: 40rpx;
	flex-shrink: 0;
	.title {
		background-color: $skeColor;
		height: 30rpx;
		width: 70%;
	}
}

.fileName {
	display: flex;
	align-items: center;
	height: 94rpx;
	background-color: rgb(242, 242, 242);
	padding-left: 40rpx;
	flex-shrink: 0;
	.title {
		height: 30rpx;
	}
}

.list::-webkit-scrollbar,
.list_skeleton::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}
.list_skeleton {
	flex: auto;
	background-color: white;
	overflow-y: auto;
	.icon {
		height: 24rpx;
		width: 24rpx;
		border-radius: 12rpx;
		background-color: $skeColor;
		margin-right: 29rpx;
	}
	.right-icon {
		width: 27rpx;
	}
}

.list {
	flex: auto;
	background-color: white;
	overflow-y: auto;
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
		width: 27rpx;
	}
}

.no-list-w {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	image {
		width: 297rpx;
		height: 276rpx;
		margin: 0 auto 30rpx;
		display: block;
	}
	.no-share {
		width: 291rpx;
		height: 233rpx;
	}
	text {
		font-size: 32rpx;
		color: #999999;
		text-align: center;
		display: block;
	}
}

.fileName_p {
	font-family: MicrosoftYaHei;
	font-size: 0;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 1rpx;
	color: #333333;
	display: block;
	width: 489rpx;
	line-height: 48rpx;
	height: 48rpx;
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
.button {
	width: 100%;
	height: 120rpx;
	.line {
		height: 20rpx;
		background-color: rgb(242, 242, 242);
	}
	/deep/ .u-btn {
		height: 100rpx;
		border: 0;
		font-size: 28rpx;
		color: #3370ff;
	}
	/deep/ .u-btn:after {
		border-radius: 0;
		border: 0;
	}
}
</style>

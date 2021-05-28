<template>
	<u-popup v-model="showUploadPopup" mode="bottom">
		<view class="container">
			<view class="left">
				<text class="title">创建</text>
				<view class="item" @click="toggleUploadModal">
					<img class="img" src="/static/img/folder/uploadWx.png" />
					<text class="des">文件夹</text>
				</view>
			</view>
			<view class="right">
				<text class="title">导入文件</text>
				<view class="box">
					<view class="alignLeft" @click="uploadLocal">
						<view class="item">
							<img class="img" src="/static/img/folder/local.png" />
							<text class="des">本地文件</text>
						</view>
					</view>
					<view class="alignRight" @click="uploadWxFile">
						<view class="item">
							<img class="img" src="/static/img/folder/uploadWx.png" />
							<text class="des">微信文件</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
import { checkDocToken } from '../utils/login.js';

export default {
	data() {
		return {
			showUploadPopup: false
		};
	},
	methods: {
		toggleUploadModal() {
			this.$emit('toggleFolderModal');
		},
		uploadWxFile() {
			this.$store.commit('list/SET_UPLOAD_STATUS', true);
			this.showUploadPopup = false;
			this.$emit('uploadWxFile');
		},
		getFolderId() {
			const routeInfo = this.$mp.page || this.$root.$mp.page
			if (routeInfo.options.folderId) return routeInfo.options.folderId
			const folderId = wx.getStorageSync('rootFolder').folderId;
			return folderId
		},
		async uploadLocal() {
			try {
				await checkDocToken()
			} catch (e) {
				return
			}
			this.showUploadPopup = false;
			wx.navigateTo({
				url: '/pages/localUpload/localUpload?folderId=' + this.getFolderId(),
			});
		}
	}
};
</script>

<style scoped lang="scss">
.container {
	height: 330rpx;
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 2fr;
	.title {
		font-family: MicrosoftYaHei;
		font-size: 24rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 1rpx;
		color: #999999;
	}
	.left {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-top: 46rpx;
		padding-left: 60rpx;
		.item {
			flex: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.des {
				font-family: MicrosoftYaHei;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1rpx;
				color: #333333;
			}
			.img {
				width: 90rpx;
				height: 90rpx;

				margin-bottom: 25rpx;
			}
		}
	}
	.left::after {
		content: '';
		display: block;
		position: absolute;
		width: 1px;
		height: 50rpx;
		background-color: #dddddd;
		right: 0;
		top: 146rpx;
	}
	.right {
		padding-top: 46rpx;
		padding-left: 97rpx;
		padding-right: 60rpx;
		display: flex;
		flex-direction: column;
		.box {
			display: flex;
			justify-content: space-between;
			flex: auto;
		}
		.alignLeft {
			display: flex;
			width: 100%;
			justify-content: flex-start;
		}
		.alignRight {
			display: flex;
			width: 100%;
			justify-content: flex-end;
		}
		.item {
			display: flex;
			height: 100%;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.des {
				font-family: MicrosoftYaHei;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1rpx;
				color: #333333;
			}
			.img {
				width: 90rpx;
				height: 90rpx;
				margin-bottom: 25rpx;
			}
		}
	}
}
</style>

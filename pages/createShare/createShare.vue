<template>
	<view class="container">
		<template v-if="!expired && ready">
			<view class="line" />
			<view class="box">
				<u-cell-group class="createShare_cell">
					<u-cell-item title="分享权限" @click="showEncrypted = true" :value="isEncrypted ? '加密分享' : '公开分享'"></u-cell-item>
					<u-cell-item title="链接有效期" :value="activeDays | formatDay" @click="show = true"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="btn_box">
				<view class="icon_item" @click="showShareModal">
					<image src="/static/img/folder/uploadWx.png" mode="widthFix" />
					微信
				</view>
				<view class="icon_item" @click="showShareModal">
					<image src="/static/img/folder/uploadWx.png" mode="widthFix" />
					复制链接
				</view>
				<view class="icon_item" @click="showQrcode">
					<image src="/static/img/folder/uploadWx.png" mode="widthFix" />
					二维码
				</view>
			</view>
			<u-popup v-model="show" mode="bottom" border-radius="0" closeOnClickOverlay class="popup">
				<ul class="otherOpt">
					<li v-for="day in options" :key="day" @click.stop="selectDay(day)">{{ day | formatDay }}</li>
				</ul>
				<div class="line" />
				<view class="btn" @click="show = false">取消</view>
			</u-popup>
			<u-popup v-model="showEncrypted" mode="right">
				<view class="encryptedBox">
					<u-cell-group class="createShare_cell createShare_cell_height">
						<u-cell-item title="公开分享" label="适用于文件公开分享，仅限查看" @click="setIsEncrypted(false)" :arrow="false">
							<image mode="widthFix" :src="!isEncrypted ? '/static/img/labelSelect.png' : ''" slot="right-icon" class="right-icon"></image>
						</u-cell-item>
						<u-cell-item title="加密分享" label="适用于隐私文件，访问时需输入密码，仅限查看" @click="setIsEncrypted(true)" :arrow="false">
							<image mode="widthFix" :src="isEncrypted ? '/static/img/labelSelect.png' : ''" slot="right-icon" class="right-icon"></image>
						</u-cell-item>
					</u-cell-group>
					<view class="btn_box">
						<view class="cancel" @click="showEncrypted = false">取消</view>
						<view class="confirm" @click="confirmEncrypted">确定</view>
					</view>
				</view>
			</u-popup>
			<u-popup v-model="showQrcodeModal" mode="right">
				<view class="encryptedBox">
					<view class="btn_box diy_btn">
						<view class="confirm" @click="saveImg">保存图片</view>
					</view>
				</view>
			</u-popup>
			<u-modal
				title="复制并分享给好友"
				v-model="showModal"
				:confirm-text="isEncrypted ? '复制链接和密码' : '复制链接'"
				show-confirm-button
				show-cancel-button
				border-radius="8"
				confirm-color="#3370ff"
				negative-top="150"
				@confirm="copy"
			>
				<view class="tips">
					<text>{{ shareInfo.shareUrl || '' }}</text>
					<br />
					<view class="stash" />
					<text v-if="isEncrypted">密码：{{ shareInfo.drawCode }}</text>
				</view>
			</u-modal>
			<u-toast ref="uToast" />
		</template>
		<view class="expired" v-if="expired && ready">
			<view class="tip_box">
				<image class="tip_img" src="../../static/img/login/icon.png" mode="widthFix"></image>
				<view class="tip_text">分享链接已过期</view>
			</view>
			<view class="btn_box diy_btn">
				<view class="confirm" @click="reShare">重新分享</view>
			</view>
		</view>
	</view>
</template>

<script>
import { createShare, getDocShare, updateShare, getQrCodeH5OrWx } from 'api';
import { REQUEST_URL } from '../../const/const.js'

export default {
	data() {
		return {
			show: false, // 天数选择popup开关
			showEncrypted: false, // 展示加密选择popup开关
			activeDays: 7,
			isEncrypted: false,
			hadShare: false, // 判断是否已经分享过了, 区别调用修改接口还是新建分享
			showModal: false,
			shareInfo: {},
			ready: false, // 初始化页面，用于判断分享状态，过期等
			expired: false,
			qrcodePopup: false,
		};
	},
	computed: {
		options() {
			return [0, 1, 7, 30];
			return this.$store.state.user.userDocSetting.find(item => item.paramKey === 'shareActiveDays').paramValue.split(',');
		}
	},
	mounted() {
		const { docId } = this.$mp.page.options;
		getDocShare({ docId }).then(res => {
			if (res.data) {
				this.setShareInfo(res.data);
			}
			this.ready = true;
		});
	},
	methods: {
		//选择有效时间
		selectDay(day) {
			if (!this.hadShare) {
				this.activeDays = day;
				this.show = false;
			} else {
				if(Number(this.activeDays) === Number(day)) return this.show = false;
				// 修改分享有效时间
				this.activeDays = day;
				this.show = false;
				// 修改分享信息
				updateShare({
					shareId: this.shareInfo.id,
					activeDays: this.activeDays
				}).then(res => {
					this.setShareInfo(res.data);
					this.$refs.uToast.show({
						title: '修改分享信息成功'
					});
				});
			}
		},
		// 设置是否加密
		setIsEncrypted(bool) {
			this.isEncrypted = bool;
		},
		confirmEncrypted() {
			this.showEncrypted = false;
			if (this.hadShare && this.pastIsEncrypted !== this.isEncrypted) {
				// 修改分享信息
				updateShare({
					shareId: this.shareInfo.id,
					isEncrypted: this.isEncrypted
				}).then(res => {
					this.setShareInfo(res.data);
					this.$refs.uToast.show({
						title: '修改分享信息成功'
					});
				});
			}
		},
		showShareModal(type) {
			this.createShareInfo('url');
		},
		showQrcode() {
			this.createShareInfo('qrCode');
		},
		createShareInfo(type) {
			if (this.hadShare) {
				if (type === 'url') return this.showModal = true;
				if (type === 'qrCode') return this.qrcodePopup = true;
			} else {
				if(this.shareInfo.id) {
					// 有分享信息但hadShare为false 表示 分享信息过期 重新分享 需要调用update接口
					uni.showLoading({
						mask: true,
						title: '重新分享中'
					});
					const params = {
						shareId: this.shareInfo.id,
						isEncrypted: this.isEncrypted,
						activeDays: this.activeDays,
					}
					updateShare(params, { hideLoading: true }).then(res => {
						uni.hideLoading();
						this.setShareInfo(res.data);
						if(type === 'url') return this.showModal = true;
						if (type === 'qrCode') return this.qrcodePopup = true;
					})
				} else {
					// 创建全新的分享记录
					uni.showLoading({
						mask: true,
						title: '创建分享中'
					});
					const { docId } = this.$mp.page.options;
					const params = {
						docId,
						isEncrypted: this.isEncrypted,
						activeDays: this.activeDays,
						owner: wx.getStorageSync('globalData')?.userInfo?.nickName || '云文档用户'
					};
					createShare(params, { hideLoading: true }).then(res => {
						uni.hideLoading();
						this.setShareInfo(res.data);
						if(type === 'url') return this.showModal = true;
						if (type === 'qrCode') return this.qrcodePopup = true;
					});
				}
			}
		},
		// 复制按钮
		copy() {
			this.showModal = false;
			let copyText = this.shareInfo.shareUrl;
			if (this.shareInfo !== true) {
				copyText += '  密码：';
				copyText += this.shareInfo.drawCode;
			}
			uni.setClipboardData({
				data: copyText,
				success: function() {
					this.$refs.uToast.show({
						title: '复制成功'
					});
				}
			});
		},
		// 分享后重置组件分享状态
		setShareInfo(data) {
			this.shareInfo = data;
			const { activeDays, drawCode, expireTime } = data;
			// 判断文件是否过期，提前5分钟
			if (expireTime) {
				const timestamp = Number(new Date(expireTime).valueOf());
				if (Number(new Date().valueOf()) > timestamp - 60000 * 5) {
					this.expired = true;
				}
			}
			this.activeDays = activeDays;
			this.isEncrypted = (drawCode && drawCode !== true) || !!drawCode;
			this.pastIsEncrypted = (drawCode && drawCode !== true) || !!drawCode;
			this.hadShare = true;
			this.shareInfo.qrCode = `${REQUEST_URL}/qrCode/getQrCodeH5OrWx?target=${data.shareUrl}`;
		},
		// 重新分享
		reShare() {
			this.expired = false;
			this.hadShare = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
.line {
	background-color: #f7f7f7;
	height: 14rpx;
	width: 100%;
}
.box {
	flex: auto;
	background-color: white;
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
			left: 40rpx;
			bottom: 0;
			width: calc(100% - 80rpx);
		}
		li:hover {
			background-color: $skeColor;
		}
		li {
			position: relative;
			width: 100%;
			height: 110rpx;
			display: flex;
			justify-content: center;
			align-items: center;
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
.btn_box {
	position: fixed;
	bottom: 100rpx;
	width: 540rpx;
	display: flex;
	justify-content: space-between;
	left: calc(50vw - 270rpx);
	font-family: MicrosoftYaHei;
	font-size: 20rpx;
	font-weight: normal;
	font-stretch: normal;
	color: #666666;
	.icon_item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		image {
			width: 94rpx;
			height: auto;
			margin-bottom: 15rpx;
		}
	}
}
.encryptedBox {
	height: 100vh;
	width: 100vw;
	position: relative;
}

.tips {
	padding: 40rpx 70rpx 0;
	text-align: left;
	word-break: break-all;
	margin-bottom: 40rpx;
	font-family: MicrosoftYaHei;
	font-size: 28rpx;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 1px;
	color: #666666;
}

.stash {
	height: 10rpx;
}

.right-icon {
	width: 27rpx;
	height: auto;
}

.expired {
	background-color: white;
	z-index: 10;
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
	.tip_box{
		height: calc(100vh - 200rpx);
		justify-content: center;
		align-items: center;
		width: 100vw;
		flex-direction: column;
		display: flex;
		.tip_text{
			font-family: MicrosoftYaHei;
			font-size: 32rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 2rpx;
			color: #333333;
			text-align: center;
		}
		.tip_img{
			width: 188rpx;
			height: auto;
			display: block;
			margin-bottom: 20rpx;
		}
	}
}

.btn_box {
	position: absolute;
	bottom: calc(80rpx + env(safe-area-inset-bottom));
	display: flex;
	left: 0;
	justify-content: space-between;
	width: 100%;
	padding: 0 40rpx;
	.cancel {
		width: 324rpx;
		line-height: 90rpx;
		background-color: #ffffff;
		border-radius: 4rpx;
		text-align: center;
		border: solid 1rpx #dddddd;
		color: #999999;
		font-size: 28rpx;
	}
	.cancel:hover {
		background-color: $skeColor;
	}
	.confirm {
		width: 324rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background-color: #3370ff;
		border-radius: 4rpx;
		color: white;
		font-size: 28rpx;
	}
	.confirm:hover {
		background-color: #206eff;
	}
}

.diy_btn{
	justify-content: center;
	.confirm{
		width: 670rpx;
	}
}
</style>

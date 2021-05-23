<template>
	<view class="container">
		<view class="header"><Search /></view>
		<view v-if="!isLogin" class="noLogin">
			<view class="noLogin-c">
				<image src="/static/img/folder/noContent.png"></image>
				<view class="text">
					<view class="i"></view>
					简单高效的管理文档
				</view>
				<view class="text">
					<view class="i"></view>
					手机、电脑操作多端同步
				</view>
				<view class="text">
					<view class="i"></view>
					电脑版请访问 doc.foxitcloud.cn
				</view>
				<button @click="doLogin">立即使用</button>
			</view>
		</view>
		<view class="content" v-else-if="showPage">
			<FolderList
				ref="list"
				@initList="initList"
				@handleTdClick="handleTdClick"
				@loadMore="loadMore({ listType: 'folder' })"
				:totalList="totalList"
				:listClosure="listClosure"
				@showPopup="showPopup"
				:isShowSkeleton="true"
				:labelListData="labelListData"
				:rollLoad="rollLoad"
			/>
		</view>
		<OptMenu ref="menu" :item="editItem" />
		<u-modal v-model="showConfirm" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff" negative-top="150" @confirm="confirm">
			<view class="tips">您是否想要删除该{{ !editItem.docId ? '文档' : '文件' }}？</view>
		</u-modal>
		<u-modal title="重命名" v-model="showPrompt" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff" negative-top="150" @confirm="prompt">
			<div class="inputContainer"><input type="text" v-model="name" /></div>
		</u-modal>
		<image v-if="isLogin" @click="toggleUploadPopup" class="upload_btn" src="/static/img/list/btn.png" />
		<UploadPopup ref="uploadPopup" @toggleFolderModal="toggleFolderModal" @uploadWxFile="uploadWxFile" />
		<OptModal ref="optModal" @submitFolderName="submitFolderName" />
		<u-toast ref="uToast" />
		<u-tabbar :before-switch="beforeSwitch" :list="tabbar" height="88" active-color="#3370ff" icon-size="30" inactive-color="#999999"></u-tabbar>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { TABBAR } from 'const/const.js';
import Search from 'com/search.vue';
import OptMenu from 'com/optMenu.vue';
import OptModal from 'com/optModal.vue';
import UploadPopup from 'com/UploadPopup.vue';
import FolderList from 'com/folderList.vue';
import tabbarMixin from 'mixin/tabbarMixin';
import listMixin from 'mixin/listMixin';
import init from 'mixin/init';
import Bus from 'utils/bus.js';

export default {
	data() {
		return {
			tabbar: '',
			isShowTabs: false,
			isLogin: uni.getStorageSync('isLogin'),
			showPage: false,
			route: this.$mp.page.route,
			editItem: null,
			name: '',
			showConfirm: false,
			showPrompt: false,
			showCreateFolder: false,
		};
	},
	computed: {
		...mapState('user', ['globalData'])
	},
	mixins: [tabbarMixin, init, listMixin],
	onLoad(e) {
		this.tabbar = TABBAR;
	},
	onShow() {
		this.setSelectedTabbar(1);
		if (uni.getStorageSync('isLogin')) {
			this.init().then(() => {
				this.showPage = true;
				this.getList({
					listType: 'folder'
				});
			});
		}
		// 重置folderlist子组件下拉刷新 在小程序后台挂机时重进可能存在未初始化问题
		this.$nextTick(() => {
			setTimeout(() => {
				this.$refs.list.triggered = false
				this.$refs.list._freshing = false
			}, 500)
		})
		//解除绑定
		Bus.$off('listOption');
		//监听文件操作
		Bus.$on('listOption', (type, listItem, fileType) => {
			if (type === 'delete') {
				this.showConfirm = true;
			} else if (type === 'rename') {
				this.showPrompt = true;
			} else {
				this.listDataUpdate(type, listItem, fileType);
			}
		});
	},
	components: {
		Search,
		OptMenu,
		FolderList,
		UploadPopup,
		OptModal
	},
	methods: {
		toggleUploadPopup() {
			this.$refs.uploadPopup.showUploadPopup = !this.$refs.uploadPopup.showUploadPopup;
		},
		toggleFolderModal() {
			this.toggleUploadPopup();
			this.$refs.optModal.folderName = ""; // 初始化文件名
			this.$refs.optModal.showModal = true;
		},
		doLogin() {
			uni.redirectTo({
				url: '/pages/login/login?url=/pages/folder/folder'
			});
		},
		// 初始化
		initList(callback) {
			this.getList({
				listType: 'folder',
				callback
			});
		},
		// 打开文件菜单
		showPopup(item) {
			this.editItem = item;
			this.name = item.folderName || item.fileName;
			this.$refs.menu.show = true;
		},
		// 新建文件夹() {
		submitFolderName (inputValue) {
			this.listDataUpdate('addFolder', '', '', inputValue);
		},
		// 确认删除
		confirm() {
			this.listDataUpdate('delete', this.editItem);
		},
		// 确认重命名
		prompt() {
			this.listDataUpdate('rename', this.editItem, '', this.name);
		},
	}
};
</script>

<style scoped lang="scss">
.container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.header {
	width: 100vw;
	background-color: white;
}

.noLogin {
	flex: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}

.noLogin image {
	width: 297rpx;
	height: 276rpx;
	margin: 0 auto 40rpx;
	display: block;
}

.noLogin .text {
	text-align: center;
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 20rpx;
}

.noLogin .text .i {
	display: inline-block;
	width: 10rpx;
	height: 10rpx;
	border-radius: 50%;
	line-height: 10rpx;
	background: #999;
	position: relative;
	top: -5rpx;
	left: -10rpx;
}

.noLogin button {
	width: 300rpx;
	height: 78rpx;
	background: #4096ff;
	color: #fff;
	text-align: center;
	line-height: 79rpx;
	margin: 0 auto;
	margin-top: 54rpx;
	font-size: 31rpx;
	border-radius: 74rpx;
}

.content {
	flex: auto;
	height: calc(100vh - 92rpx - 60rpx - env(safe-area-inset-bottom));
	overflow: hidden;
}

.tips {
	height: 155rpx;
	padding-top: 40rpx;
	text-align: center;
	font-family: MicrosoftYaHei;
	font-size: 28rpx;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 1px;
	color: #666666;
}

.inputContainer {
	padding: 35rpx;
	width: 100%;
	margin-bottom: 45rpx;
	display: flex;
	justify-content: center;
	box-sizing: border-box;
	input {
		display: block;
		width: 81%;
		height: 80rpx;
		padding: 0 30rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		border: solid 1px #dddddd;
		font-family: MicrosoftYaHei;
		font-size: 28rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 1rpx;
		color: #333333;
	}
}
.upload_btn {
	display: block;
	position: fixed;
	bottom: calc(150rpx + env(safe-area-inset-bottom));
	right: 50rpx;
	height: 100rpx;
	width: 100rpx;
}
.upload {
	height: 330rpx;
	width: 100%;
}
</style>

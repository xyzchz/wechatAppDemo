<template>
	<view class="container">
		<view class="header">
			<Search />
		</view>
		<view class="content" v-if="showPage">
			<FolderList ref="list" @initList="initList" @handleTdClick="handleTdClick"
				@loadMore="loadMore({ listType: 'folder' })" :totalList="totalList" :listClosure="listClosure"
				@showPopup="showPopup" :isShowSkeleton="true" :labelListData="labelListData" :rollLoad="rollLoad" />
		</view>
		<optMenu ref="menu" :item="editItem" />
		<u-modal v-model="showConfirm" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff"
			negative-top="150" @confirm="confirm">
			<view class="tips">
				您是否想要删除该{{!editItem.docId ? '文档' : '文件'}}？
			</view>
		</u-modal>
		<u-modal title="重命名" v-model="showPrompt" show-confirm-button show-cancel-button border-radius="8"
			confirm-color="#3370ff" negative-top="150" @confirm="prompt">
			<div class="inputContainer">
				<input type="text" v-model="name" />
			</div>
		</u-modal>
		<image @click="toggleUploadPopup" class="upload_btn" src="/static/img/list/btn.png" />
		<UploadPopup ref="uploadPopup" @toggleFolderModal="toggleFolderModal" @uploadWxFile="uploadWxFile" />
		<OptModal ref="optModal" @submitFolderName="submitFolderName" />
		<u-toast ref="uToast" v-model="index" />
		<u-tabbar :before-switch="beforeSwitch" :list="tabbar" height="88" active-color="#3370ff" icon-size="30" inactive-color="#999999"></u-tabbar>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		TABBAR
	} from 'const/const.js'
	import Search from 'com/search.vue'
	import optMenu from 'com/optMenu.vue'
	import OptModal from 'com/optModal.vue';
	import UploadPopup from 'com/UploadPopup.vue';
	import FolderList from 'com/folderList.vue'
	import tabbarMixin from 'mixin/tabbarMixin'
	import listMixin from 'mixin/listMixin'
	import init from 'mixin/init'
	import Bus from 'utils/bus.js'

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
				index: 1,
			}
		},
		computed: {
			...mapState('user', ['globalData'])
		},
		mixins: [tabbarMixin, init, listMixin],
		onShow() {
			this.setSelectedTabbar(1);
			// 初始化数据
			if (uni.getStorageSync('isLogin')) {
				this.init().then(() => {
					this.showPage = true;
					this.getList({
						listType: "folder"
					});
				})
			};
			//解除绑定
			Bus.$off("listOption");
			//监听文件操作
			Bus.$on("listOption", (type, listItem, fileType) => {
				if (type === 'delete') {
					this.showConfirm = true;
				} else if (type === 'rename') {
					this.showPrompt = true;
				} else {
					this.listDataUpdate(type, listItem, fileType);
				}
			});
		},
		onLoad(e) {
			this.tabbar = [{
				"pagePath": "/pages/index/index",
				"iconPath": "/static/img/tabs/home.png",
				"selectedIconPath": "/static/img/tabs/home_.png",
				"text": "首页"
			}, {
				"pagePath": "/pages/folder/folder",
				"iconPath": "/static/img/tabs/folder_.png",
				"selectedIconPath": "/static/img/tabs/folder_.png",
				"text": "文档"
			}, {
				"pagePath": "/pages/appCenter/appCenter",
				"iconPath": "/static/img/tabs/appCenter.png",
				"selectedIconPath": "/static/img/tabs/appCenter_.png",
				"text": "应用"
			}, {
				"pagePath": "/pages/userCenter/userCenter",
				"iconPath": "/static/img/tabs/userCenter.png",
				"selectedIconPath": "/static/img/tabs/userCenter_.png",
				"text": "我的"
			}];
		},
		components: {
			Search,
			optMenu,
			FolderList,
			OptModal,
			UploadPopup,
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
			// 新建文件夹() {
			submitFolderName (inputValue) {
				this.listDataUpdate('addFolder', '', '', inputValue);
			},
			doLogin() {
				uni.redirectTo({
					url: '/pages/login/login?url=/pages/folder/folder'
				})
			},
			// 初始化
			initList(callback) {
				this.getList({
					listType: "folder",
					callback
				});
			},
			// 打开文件菜单
			showPopup(item) {
				this.editItem = item
				this.name = item.folderName || item.fileName
				this.$refs.menu.show = true
			},
			// 确认删除
			confirm() {
				this.listDataUpdate('delete', this.editItem);
			},
			// 确认重命名
			prompt() {
				this.listDataUpdate('rename', this.editItem, '', this.name);
			}
		}
	}
</script>

<style scoped lang="scss">
	/deep/ .u-tabbar__content .u-tabbar__content__item:nth-child(2) .u-tabbar__content__item__text {
		color: #3370ff !important;
	}

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
</style>

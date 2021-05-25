<template>
	<div class="container">
		<div class="list">
			<FolderList ref="list" @initList="initList" @handleTdClick="handleTdClick"
				@loadMore="loadMore({ listType: 'folder' })" :totalList="totalList" :listClosure="listClosure"
				:isShowSkeleton="true" :labelListData="labelListData" :rollLoad="rollLoad" hideMenu />
		</div>
		<div :class="showCopy ? 'btnContainer' : 'btnContainer center'">
			<u-button v-if="showCopy" @click="handleCopy()" :disabled="moveLoading" :loading="copyLoading" type="primary">复制</u-button>
			<u-button @click="handleMove()" :disabled="copyLoading" :loading="moveLoading" type="primary">移动</u-button>
		</div>
		<u-toast ref="uToast" />
	</div>
</template>

<script>
	import FolderList from "com/folderList";
	import listMixin from "mixin/listMixin";
	import init from "mixin/init";
	import {
		moveDocFolder,
		moveDocFile,
		copyDocFile
	} from "api";
	import Bus from "utils/bus";

	export default {
		components: {
			FolderList,
		},
		mixins: [listMixin, init],
		data() {
			return {
				copyLoading: false,
				moveLoading: false,
				showCopy: true,
			};
		},
		methods: {
			initList(callback) {
				this.getList({
					listType: "folder",
					callback
				});
			},
			handleCopy() {
				if (!uni.getStorageSync("moveInfo")) {
					this.$refs.uToast.show({
						title: '文件/文件夹不存在!',
					})
					return
				}
				uni.showLoading({
					title: "复制中...",
					mask: true,
				});
				this.copyLoading = true;
				const moveInfo = uni.getStorageSync("moveInfo");
				const {
					route,
					options,
					docId,
					fileName
				} = moveInfo;
				const rootFolder = uni.getStorageSync("rootFolder").folderId;
				const params = {
					fileName,
					docId,
					targetFolderId: this.$mp.page.options.folderId || rootFolder,
				};
				copyDocFile(params, {
					hideLoading: true
				})
					.then((res) => {
						if (res.code !== 0) return;
						uni.removeStorageSync("moveInfo");
						uni.hideLoading();
						this.$refs.uToast.show({
							title: '复制成功!',
						})
						setTimeout(() => {
							// 跳转到进入前页面 返回键有问题 暂时注释
							// if(route === 'pages/folder/folder') return uni.switchTab({
							// 	url: '/pages/folder/folder'
							// })
							// uni.navigateTo({
							// 	url: this.urlPlusOptions(`/${route}`, options),
							// });
							uni.reLaunch({
								url: '/pages/folder/folder'
							});
						}, 1500);
					})
					.catch((error) => {
						this.copyLoading = false;
					});
			},
			handleMove() {
				if (!uni.getStorageSync("moveInfo")) {
					this.$refs.uToast.show({
						title: '文件/文件夹不存在!',
					})
					return
				}
				uni.showLoading({
					title: "移动中...",
					mask: true,
				});
				this.moveLoading = true;
				const moveInfo = uni.getStorageSync("moveInfo");
				const {
					folderId,
					folderName,
					route,
					options,
					docId,
					fileName
				} = moveInfo;
				const rootFolder = uni.getStorageSync("rootFolder").folderId;
				const reqFunction = docId ? moveDocFile : moveDocFolder;
				const params = docId ?
					{
						fileName,
						docId,
						targetFolderId: this.$mp.page.options.folderId || rootFolder,
					} :
					{
						folderName,
						folderId,
						targetFolderId: this.$mp.page.options.folderId || rootFolder,
					};
				reqFunction(params, {
						hideLoading: true
					})
					.then((res) => {
						if (res.code !== 0) return;
						uni.removeStorageSync("moveInfo");
						uni.hideLoading();
						this.$refs.uToast.show({
							title: '移动成功!',
						})
						setTimeout(() => {
							// 跳转到进入前页面 返回键有问题 暂时注释
							// if(route === 'pages/folder/folder') return uni.switchTab({
							// 	url: '/pages/folder/folder'
							// })
							// uni.navigateTo({
							// 	url: this.urlPlusOptions(`/${route}`, options),
							// });
							uni.reLaunch({
								url: '/pages/folder/folder'
							});
						}, 1500);
					})
					.catch((error) => {
						this.moveLoading = false;
					});
			},
		},
		mounted() {
			this.getList({
				listType: "folder"
			});
		},
		created() {
			const moveInfo = uni.getStorageSync("moveInfo");
			const {
				docId
			} = moveInfo;
			if (!docId) this.showCopy = false;
		},
	};
</script>

<style scoped lang="scss">
	.container {
		position: fixed;
		z-index: 200;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.list {
		height: calc(100vh - 170rpx);
		width: 100%;
	}

	.center {
		justify-content: center !important;
	}

	.btnContainer {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0 40rpx;
		flex: auto;
		margin-top: 10rpx;
		/deep/ .u-btn {
		  width: 324rpx;
		  height: 90rpx;
		  background-color: #3370ff;
		  border-radius: 4rpx;
		  border: 1px solid #3370ff;
		}
	}
</style>

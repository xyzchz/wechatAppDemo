<template>
	<view class="content">
		<view class="header"><Header /></view>
		<view class="line" />
		<view class="list">
			<view class="tabs">
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" bar-height="3" active-color="#333333" inactive-color="#999999"></u-tabs-swiper>
			</view>
			<view class="listContent" v-if="showPage">
				<swiper height="300rpx" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
					<swiper-item class="swiper-item" :key="index">
						<FolderList
							ref="list"
							@initList="initList"
							@handleTdClick="handleTdClick"
							@loadMore="loadMore({ listType: 'recently' })"
							:totalList="totalList"
							:listClosure="listClosure"
							@showPopup="showPopup"
							:needShowSkeleton="true"
							:showSkeleton="showSkeleton"
							:labelListData="labelListData"
							:rollLoad="rollLoad"
						/>
					</swiper-item>
					<swiper-item class="swiper-item" :key="index">111</swiper-item>
					<swiper-item class="swiper-item" :key="index"><LabelList ref="labelList" @showLabelPupup="showLabelPopup" /></swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 文件上传菜单 -->
		<image @click="toggleUploadPopup" class="upload_btn" src="/static/img/list/btn.png" />
		<UploadPopup ref="uploadPopup" @toggleFolderModal="toggleFolderModal" @uploadWxFile="uploadWxFile" />
		<OptModal ref="optModal" @submitFolderName="submitFolderName" />
		<!-- 文件上传菜单 -->
		<!-- 最近分享列表菜单及模态弹窗 -->
		<OptMenu ref="menu" :item="editItem" showRemove />
		<u-modal v-model="showConfirm" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff" negative-top="150" @confirm="confirmRemove">
			<view class="tips heightAuto">
				是否从最近列表中移除？移除后，该内容在最近列表将不可见
			</view>
			<view class="checkbox">
				<u-checkbox label-size="24" @change="checkboxChange" v-model="deleteFileCheck">同时删除文档</u-checkbox>
			</view>
		</u-modal>
		<u-modal title="重命名" v-model="showPrompt" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff" negative-top="150" @confirm="prompt">
			<div class="inputContainer"><input type="text" v-model="name" /></div>
		</u-modal>
		<!-- 最近分享列表及模态弹窗 -->
		<!-- 标签菜单及模态弹窗 -->
		<labelOptMenu ref="labelOptMenu" :listItem="editLabel" @showLabelDelModal="showLabelDelModal" />
		<u-modal v-model="showLabelDel" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff" negative-top="150" @confirm="delLabel">
			<view class="tips">
				确定要删除标签{{ `"${editLabel.labelName}"` }}？
				相关文档也将移除此标签
			</view>
		</u-modal>
		<!-- 标签菜单及模态弹窗 -->
		<u-toast ref="uToast" />
		<u-tabbar :before-switch="beforeSwitch" :list="tabbar" height="88" active-color="#3370ff" icon-size="30" inactive-color="#999999"></u-tabbar>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import { deleteDocUserLabel } from 'api';
import Header from '../../components/header.vue';
import listMixin from 'mixin/listMixin';
import FolderList from 'com/folderList.vue';
import LabelList from '../../components/labelList.vue';
import OptMenu from 'com/optMenu';
import OptModal from 'com/optModal.vue';
import UploadPopup from 'com/UploadPopup.vue';
import labelOptMenu from 'com/labelOptMenu';
import { TABBAR } from 'const/const.js';
import tabbarMixin from 'mixin/tabbarMixin';
import init from 'mixin/init';
import Bus from 'utils/bus';

export default {
	data() {
		return {
			tabbar: '',
			route: this.$mp.page.route,
			list: [
				{
					name: '最近'
				},
				{
					name: '分享'
				},
				{
					name: '标签'
				}
			],
			current: 0,
			swiperCurrent: 0,
			showPage: false,
			editLabel: null, // 标签列表编辑Item
			showLabelDel: false, // 确认删除标签弹窗
			editItem: null, // 最近列表编辑Item
			showConfirm: false, // 最近列表confirm弹窗
			showPrompt: false, // 重命名弹窗
			name: '', // 重命名时文件名
			deleteFileCheck: false, // 是否同时删除文件选项
		};
	},
	mixins: [tabbarMixin, init, listMixin],
	onHide() {
		if(this.$store.state.list.uploadStatus) return
		// 重置状态 避免tabbar页面被自动缓存， 导致加载骨架屏时闪屏
		this.showSkeleton = true;
		this.folderList = [];
		this.fileList = [];
	},
	onShow() {
		if(this.$store.state.list.uploadStatus) {
			this.$store.commit('list/SET_UPLOAD_STATUS', false);
			return
		}
		this.setSelectedTabbar(0);
		//解除绑定
		Bus.$off('listOption');
		//监听文件操作
		Bus.$on('listOption', (type, listItem, fileType) => {
			if (type === 'remove') {
				this.deleteFileCheck = false;
				this.showConfirm = true;
			} else if (type === 'rename') {
				this.showPrompt = true;
			} else {
				this.listDataUpdate(type, listItem, fileType);
			}
		});
		if (uni.getStorageSync('isLogin')) {
			this.init().then(() => {
				this.showPage = true;
				this.$nextTick(() => {
					// tabbar页面缓存问题，需要手动初始化子组件
					this.$refs.labelList.init();
					this.getList({
						listType: 'recently'
					});
				});
			});
		}
	},
	onLoad(e) {
		this.tabbar = TABBAR;
	},
	components: {
		Header,
		FolderList,
		OptMenu,
		LabelList,
		labelOptMenu,
		OptModal,
		UploadPopup,
	},
	methods: {
		...mapMutations('label', ['DELETE_LABEL']),
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		// 初始化
		initList(callback) {
			this.getList({
				listType: 'recently',
				callback
			});
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			const dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			const current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
		// 展示标签菜单
		showLabelPopup(label) {
			this.editLabel = label;
			this.$refs.labelOptMenu.show = true;
		},
		toast(title) {
			this.$refs.uToast.show({
				title
			});
		},
		// 展示删除标签弹窗
		showLabelDelModal() {
			this.showLabelDel = true;
		},
		// 删除标签
		delLabel() {
			this.showLabelDel = false;
			deleteDocUserLabel({ id: this.editLabel.id }).then(res => {
				this.DELETE_LABEL(this.editLabel.id);
				this.$refs.uToast.show({
					title: '删除成功'
				});
			});
		},
		// 打开最近列表菜单
		showPopup(item) {
			this.editItem = item;
			this.name = item.folderName || item.fileName;
			this.$refs.menu.show = true;
		},
		// 确认重命名
		prompt() {
			this.listDataUpdate('rename', this.editItem, '', this.name);
		},
		// 修改checkbox值
		checkboxChange(e) {
			this.deleteFileCheck = e.value;
		},
		// 移除最近记录
		confirmRemove() {
			this.listDataUpdate('deleteRecently', this.editItem, '', this.deleteFileCheck);
		},
		// 文件上传菜单显示切换
		toggleUploadPopup() {
			this.$refs.uploadPopup.showUploadPopup = !this.$refs.uploadPopup.showUploadPopup;
		},
		// 新建文件夹弹窗显示切换
		toggleFolderModal() {
			this.toggleUploadPopup();
			this.$refs.optModal.folderName = ''; // 初始化文件名
			this.$refs.optModal.showModal = true;
		},
		// 新建文件夹() {
		submitFolderName (inputValue) {
			this.listDataUpdate('addFolder', '', '', inputValue);
		},
	}
};
</script>

<style scoped lang="scss">
.content {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.header {
	height: 274rpx;
	width: 100vw;
	background-color: white;
}

.line {
	height: 20rpx;
	width: 100vw;
}

.bottomTabs {
	position: absolute;
	bottom: 0;
	z-index: 100;
	height: 88rpx;
	width: 100%;
}

.list {
	flex: auto;
	background-color: white;
	display: flex;
	flex-direction: column;

	swiper {
		height: 100%;
	}

	.tabs {
		width: 100vw;
	}

	.listContent {
		flex: auto;
	}
}
.tips {
	height: 155rpx;
	padding: 40rpx 70rpx 0;
	text-align: left;
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
.checkbox{
	padding-left: 70rpx;
	height: 95rpx;
	font-family: MicrosoftYaHei;
	font-size: 24rpx;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 1rpx;
	color: #999999;
}
.heightAuto{
	height: auto!important;
	margin-bottom: 24rpx;
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

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
					<swiper-item class="swiper-item" :key="index">000</swiper-item>
					<swiper-item class="swiper-item" :key="index">111</swiper-item>
					<swiper-item class="swiper-item" :key="index">
						<LabelList ref="labelList" @showLabelPupup="showLabelPopup" />
					</swiper-item>
				</swiper>
			</view>
		</view>
		<labelOptMenu ref="labelOptMenu" :listItem="editLabel" @showLabelDelModal="showLabelDelModal" />
		<u-modal v-model="showLabelDel" show-confirm-button show-cancel-button border-radius="8" confirm-color="#3370ff" negative-top="150" @confirm="delLabel">
			<view class="tips">确定要删除标签{{`"${editLabel.labelName}"`}}？<br />相关文档也将移除此标签</view>
		</u-modal>
		<u-toast ref="uToast" />
		<u-tabbar :before-switch="beforeSwitch" :list="tabbar" height="88" active-color="#3370ff" icon-size="30" inactive-color="#999999"></u-tabbar>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import { deleteDocUserLabel } from 'api';
import Header from '../../components/header.vue';
import LabelList from '../../components/labelList.vue';
import labelOptMenu from 'com/labelOptMenu';
import { TABBAR } from 'const/const.js';
import tabbarMixin from 'mixin/tabbarMixin';
import init from 'mixin/init';

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
			editLabel: null,
			showLabelDel: false,
		};
	},
	mixins: [tabbarMixin, init],
	onShow() {
		this.setSelectedTabbar(0);
		this.$refs.labelOptMenu
		if (uni.getStorageSync('isLogin')) {
			this.init().then(() => {
				this.showPage = true;
				this.$nextTick(() => {
					// tabbar页面缓存问题，需要手动初始化子组件
					this.$refs.labelList.init();
				})
			});
		}
	},
	onLoad(e) {
		this.tabbar = TABBAR;
	},
	components: {
		Header,
		LabelList,
		labelOptMenu,
	},
	methods: {
		...mapMutations('label', ['DELETE_LABEL']),
		tabsChange(index) {
			this.swiperCurrent = index;
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
			})
		},
		// 展示删除标签弹窗
		showLabelDelModal() {
			this.showLabelDel = true;
		},
		// 删除标签
		delLabel() {
			this.showLabelDel = false;
			deleteDocUserLabel({ id: this.editLabel.id }).then((res) => {
				this.DELETE_LABEL(this.editLabel.id);
				this.$refs.uToast.show({
					title: '删除成功'
				})
			})
		}
	}
};
</script>

<style>
page {
	background: #f8f8f8;
}
</style>

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
	padding-top: 40rpx;
	text-align: center;
	font-family: MicrosoftYaHei;
	font-size: 28rpx;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 1px;
	color: #666666;
}
</style>

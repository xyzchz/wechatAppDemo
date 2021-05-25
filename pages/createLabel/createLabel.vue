<template>
	<div class="container">
		<u-input v-model="labelName" placeholder="请输入标签名称，最多只能输入6个字" maxlength="6" :clearable="false" />
		<ul>
			<li v-for="color in colorList" :key="color" @click.stop="selectColor(color)">
				<span class="colorBtn" :style="{ backgroundColor: color }" />
				<span v-if="onSelect === color" class="actived"></span>
			</li>
		</ul>
		<u-button :disabled="!labelName.length" :class="labelName.length > 0 ? 'blue' : 'gray'" :loading="isLoading" type="primary" @click="createLabel">确定</u-button>
		<u-toast ref="uToast" />
	</div>
</template>

<script>
import { addDocUserLabel, updateDocUserLabel } from 'api';
import { LABEL_COLOR } from 'const/const';

export default {
	data() {
		return {
			labelName: '',
			colorList: LABEL_COLOR,
			onSelect: '#ff6260',
			isLoading: false
		};
	},
	computed: {
		labelList() {
			return this.$store.state.label.labelList;
		}
	},
	methods: {
		selectColor(color) {
			this.onSelect = color;
		},
		createLabel() {
			const { labelName: oldLableName, labelColor, id } = this.$mp.page.options;
			this.isLoading = true;
			const { labelName } = this;
			if (!labelName.trim()) {
				this.$refs.uToast.show({
					title: '请输入标签名称'
				});
				this.isLoading = false;
			}
			if (oldLableName) {
				// 编辑操作
				// 修改时如无变化直接返回
				if (oldLableName === labelName.trim() && labelColor === this.onSelect) {
					return uni.navigateBack();
				}
				const current = this.labelList.find(item => item.labelColor === this.onSelect && item.labelName === labelName.trim() && item.id !== id);
				if (current) {
					this.isLoading = false;
					this.$refs.uToast.show({
						title: '已存在相同标签'
					});
					return;
				}
				updateDocUserLabel({ labelName: labelName.trim(), labelColor: this.onSelect, id }).then(res => {
					if (res.code === 0) {
						this.$store.commit('label/UPDATE_LABEL_LIST', { labelName: labelName.trim(), labelColor: this.onSelect, id });
						this.$refs.uToast.show({
							title: '标签修改成功',
							duration: 1500
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				});
			} else {
				// 新增
				const current = this.labelList.find(item => item.labelColor === this.onSelect && item.labelName === labelName.trim());
				if (current) {
					this.isLoading = false;
					this.$refs.uToast.show({
						title: '已存在相同标签'
					});
					return;
				}
				addDocUserLabel({ labelName: labelName.trim(), labelColor: this.onSelect })
					.then(res => {
						if (res.code === 0) {
							this.$store.dispatch('label/GET_LABEL_LIST', { hideLoding: true }).then(() => {
								this.$refs.uToast.show({
									title: '标签创建成功',
									duration: 1500
								});
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							});
						}
					})
					.catch(e => {
						this.isLoading = false;
					});
			}
		}
	},
	mounted() {
		const { labelName, labelColor } = this.$mp.page.options;
		this.labelName = labelName;
		this.onSelect = labelColor;
	}
};
</script>

<style lang="scss" scoped>
.container {
	background-color: rgb(242, 242, 242);
	padding-top: 40rpx;
	height: 100%;
	.blue {
		/deep/ .u-btn {
			background-color: #3370ff;
		}
	}
	.gray {
		/deep/ .u-btn {
			background-color: #bbbbbb !important;
		}
	}
	/deep/ .u-input {
		background-color: white;
		height: 100rpx;
		width: 100%;
		.u-input__input {
			height: 100%;
			padding-left: 40rpx;
		}
	}
	/deep/ .u-btn {
		width: 670rpx;
		margin: 90rpx auto;
		font-size: 28rpx;
		color: #ffffff;
		border-radius: 4rpx;
	}
	/deep/ .u-btn:after {
		border-radius: 0;
		border: 0;
	}
	ul {
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		margin-top: 30rpx;
		li {
			align-items: center;
			width: 80rpx;
			height: 80rpx;
			justify-content: center;
			position: relative;
			.colorBtn {
				position: absolute;
				left: 20rpx;
				top: 20rpx;
				display: block;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				z-index: 1;
			}
			.actived {
				position: absolute;
				left: 10rpx;
				top: 10rpx;
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				background-color: #66a1ff;
				z-index: 0;
				opacity: 0.15;
			}
		}
	}
}
</style>

<template>
	<view class="container">
		<view class="form">
			<view class="input_item">
				<text class="label">手机号</text>
				<view class="input"><input type="number" placeholder="请输入手机号" v-model="form.phone" /></view>
			</view>
			<view class="input_item">
				<text class="label">验证码</text>
				<view class="input"><input type="text" placeholder="请输入手机验证码" v-model="form.code" /></view>
				<view class="right_btn">
					<text v-if="step === 1" @click="$u.debounce(getCode, 500)">获取验证码</text>
					<text v-if="step === 2">{{ num }}秒</text>
					<text v-if="step === 3" @click="$u.debounce(getCode, 500)">重新获取</text>
				</view>
			</view>
		</view>
		<view class="btn" @click="$u.debounce(bindPhone, 500)">立即绑定</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapMutations } from 'vuex'
import { certSendMsg, doCertificate } from 'api';

export default {
	data() {
		return {
			step: 1,
			num: 60,
			form: {
				phone: '',
				code: ''
			}
		};
	},
	methods: {
		...mapMutations('user', [
			"UPDATE_CERTIFICATION",
		]),
		getCode() {
			const { phone } = this.form;
			if (!phone.trim())
				return this.$refs.uToast.show({
					title: '请输入手机号码'
				});
			if (this.$u.test.mobile(phone.trim())) {
				certSendMsg({ tel: phone.trim() }, { hideLoading: true }).then(res => {
					this.$refs.uToast.show({
						title: '验证码已发送'
					});
					this.setTimer(60);
				});
			} else {
				this.$refs.uToast.show({
					title: '手机号码输入有误'
				});
			}
		},
		setTimer(num) {
			this.step = 2;
			this.num = num;
			this.timer = setInterval(() => {
				this.num--;
				if (this.num == 0) {
					clearInterval(this.timer);
					this.step = 3;
				}
			}, 1000);
		},
		bindPhone() {
			if (this.$store.state.user.isCertification)
				return this.$refs.uToast.show({
					title: '无需重复绑定'
				});
			const { phone, code } = this.form;
			if (!phone.trim())
				return this.$refs.uToast.show({
					title: '请输入手机号码'
				});
			if (!this.$u.test.mobile(phone.trim()))
				return this.$refs.uToast.show({
					title: '手机号码输入有误'
				});
			if (!code.trim())
				return this.$refs.uToast.show({
					title: '请输入验证码'
				});
			const { docId } = this.$mp.page.options
			doCertificate({ tel: phone, code }, { hideLoading: true }).then(res => {
				if(res.data) {
					this.UPDATE_CERTIFICATION(res.data);
					this.$refs.uToast.show({
						title: '绑定成功',
						callback: () => {
							uni.navigateTo({
								url: `/pages/createShare/createShare?docId=${docId}`
							})
						}
					});
				} else {
					this.$refs.uToast.show({
						title: '验证码错误，请重试',
					});
				}
			})
		}
	},
	destroyed() {
		clearInterval(this.timer);
	}
};
</script>

<style scoped lang="scss">
.container {
	background-color: #F7F7F7;
	padding-top: 40rpx;
	width: 100vw;
	height: 100vh;
}
.form {
	width: 100%;
	background-color: white;
	padding: 0 40rpx;
	.input_item {
		width: 100%;
		height: 100rpx;
		position: relative;
		display: flex;
		align-items: center;
		.label {
			font-family: MicrosoftYaHei;
			font-size: 28rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 100rpx;
			letter-spacing: 1rpx;
			color: #333333;
			width: 120rpx;
		}
		.right_btn {
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			width: auto;
			height: 100%;
			padding-left: 40rpx;
			text-align: right;
			color: #4096ff;
		}
		.input {
			width: 300rpx;
			height: 100rpx;
			flex: 1;
			input {
				height: 100%;
				width: 100%;
				font-family: MicrosoftYaHei;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 16rpx;
				letter-spacing: 1rpx;
				color: #333333;
			}
		}
	}
	.input_item:after {
		content: '';
		height: 1px;
		background-color: #eeeeee;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		transform: scaleY(0.5);
	}
}
.btn {
	width: 670rpx;
	margin: 0 auto;
	height: 90rpx;
	background-color: #3370ff;
	border-radius: 4rpx;
	color: #ffffff;
	margin-top: 100rpx;
	text-align: center;
	line-height: 90rpx;
}
.btn:hover {
	background-color: #2a7cff;
}
</style>

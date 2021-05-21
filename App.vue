<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	page {
		height: 100%;
	}

	.u-tabbar__content__item__text {
		bottom: 11rpx;

		.u-line-1 {
			font-size: 20rpx;
		}
	}

	.u-tabbar__content {
		box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.2);
	}

	.u-toast {
		width: 413rpx !important;
		background-color: #000000;
		border-radius: 4rpx;
		opacity: 0.6;
		min-height: 90rpx;
	}
</style>

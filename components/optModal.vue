<template>
	<view>
		<u-modal
			title="新建文件夹"
			v-model="showModal"
			show-confirm-button
			show-cancel-button
			border-radius="8"
			confirm-color="#3370ff"
			negative-top="150"
			@confirm="submitFolderName"
			:zoom="false"
		>
			<div class="inputContainer"><input type="text" placeholder="请输入文件夹名称" v-model="folderName" /></div>
		</u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showModal: false,
			folderName: '',
		};
	},
	methods: {
		submitFolderName() {
			this.showModal = false;
			this.$emit('submitFolderName', this.folderName)
		}
	},
};
</script>

<style scoped lang="scss">
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
</style>

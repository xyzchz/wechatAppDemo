<template>
	<view v-if="src"><web-view :src="src"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			src: ''
		};
	},
	onShow() {
		const { folderId } = this.$mp.page.options
		const { userDocSetting } = this.$store.state.user;
		const uploadMaxLimit = userDocSetting.find(item => item.paramKey === 'uploadMaxLimit').paramValue;
		const uploadFileNotFormat = userDocSetting.find(item => item.paramKey === 'uploadFileNotFormat').paramValue;
		this.src = `http://localhost:8082/miniprogram/localupload?token=${
			wx.getStorageSync('token').token
		}&folderId=${folderId}&uploadMaxLimit=${uploadMaxLimit}&uploadFileNotFormat=${uploadFileNotFormat}`;
		console.log(this.src)
	}
};
</script>

<style></style>

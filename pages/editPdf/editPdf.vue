<template>
	<view v-if="src"><web-view :src="src"></web-view></view>
</template>

<script>
import { REQUEST_URL, APPKEY } from 'const/const'

export default {
	data() {
		return {
			src: ''
		};
	},
	onShow() {
		const { docId } = this.$mp.page.options;
		const url = `${REQUEST_URL}/docFile/downloadFile?token=${uni.getStorageSync('token').token}&appKey=${APPKEY}&docId=${docId}`
		this.src = `https://edit.foxitcloud.cn?token=${uni.getStorageSync('wxToken')}&url=${encodeURIComponent(url)}`;
	}
};
</script>

<style></style>
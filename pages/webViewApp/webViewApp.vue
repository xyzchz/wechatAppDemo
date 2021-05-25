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
		const { url } = this.$mp.page.options;
		console.log(url)
		this.src = decodeURIComponent(url);
	}
};
</script>

<style></style>

<template>
	<div>1111</div>
</template>

<script>
		import tabbarMixin from 'mixin/tabbarMixin'
		
		export default{
			mixins: [tabbarMixin],
			onShow() {
			  this.setSelectedTabbar(3)
			},
			methods: {
				navigateToMiniProgram(appid) {
					uni.navigateToMiniProgram(appid)
				}
			},
		}
</script>

<style>
</style>

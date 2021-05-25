<template>
	<image v-if="type==='folder'" class="img" mode="widthFix" src="/static/img/list/folder.png" alt="folder" />
	<image v-else-if="['pdf'].includes(extName)" mode="widthFix" class="img" src="/static/img/list/pdf.png" alt="pdf" />
	<image
		v-else-if="['doc', 'docx'].includes(extName)"
		class="img"
		src="/static/img/list/word.png"
		alt="word"
		mode="widthFix"
	/>
	<image
		v-else-if="['wmv', 'mp4', 'avi'].includes(extName)"
		class="img"
		src="/static/img/list/video.png"
		alt="video"
		mode="widthFix"
	/>
	<image
		v-else-if="['xls', 'xlsx'].includes(extName)"
		class="img"
		src="/static/img/list/excel.png"
		alt="excel"
		mode="widthFix"
	/>
	<image
		v-else-if="['ppt', 'pptx'].includes(extName)"
		class="img"
		src="/static/img/list/ppt.png"
		alt="ppt"
		mode="widthFix"
	/>
	<image
		v-else-if="['jpg', 'png', 'jpeg'].includes(extName)"
		class="img"
		src="/static/img/list/jpg.png"
		alt="jpg"
		mode="widthFix"
	/>
	<image
		v-else-if="['zip', 'rar', 'iso'].includes(extName)"
		class="img"
		src="/static/img/list/zip.png"
		alt="zip"
		mode="widthFix"
	/>
	<image v-else mode="widthFix" class="img" src="/static/img/list/other.png" />
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: ['extName', 'type'],
	}
</script>

<style scoped lang="scss">
	.img{
		width: 100%;
		height: auto;
	}
</style>

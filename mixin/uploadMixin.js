import {
	addDocFolder
} from 'api'

export default {
	data() {
		return {
			uploadData: {
				showUploadPopup: false,
				showModal: false,
				folderName: ''
			},
		}
	},
	methods: {
		toggleUploadPopup() {
			this.uploadData.showUploadPopup = !this.uploadData.showUploadPopup;
		},
		toggleUploadModal() {
			this.toggleUploadPopup()
			this.uploadData.folderName = "";
			this.uploadData.showModal = !this.uploadData.showModal;
		},
		submitFolderName() {
			const inputValue = this.uploadData.folderName
			if (!inputValue.trim()) return this.$refs.uToast.show({
				title: `文件夹名称不能为空`
			})
			if (/^\./.test(inputValue.trim())) return this.$refs.uToast.show({
				title: `文件夹名称首位字符不能为.`
			})
			if (!this.specialSymbol(inputValue.trim())) return this.$refs.uToast.show({
				title: `名称中包含不被允许的非法字符 / \\ : " * ? < > | %`
			})
			const params = {
				folderName: inputValue.trim()
			}
			this.$refs.uToast.show({
				title: '创建成功！'
			})
			return
			addDocFolder(params).then(() => {
				this.$refs.uToast.show({
					title: '创建成功！'
				})
				this.updataDataList(listItem, 'name', inputValue.trim())
			})
		}
	}
}

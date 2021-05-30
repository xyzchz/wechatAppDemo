import {
	mapState,
	mapMutations
} from 'vuex';
import {
	APPKEY,
	REQUEST_URL
} from 'const/const'
import {
	checkDocToken
} from '../utils/login.js'
import {
	findDocFolder,
	findDocFile,
	removeDocFile,
	removeDocFolder,
	renameFile,
	renameFolderName,
	getRecent,
	openDocFile,
	deleteDocFileRecent,
	addDocFolder,
} from 'api';
export default {
	data() {
		return {
			folderList: [], // 文件夹列表
			fileList: [], // 文件列表
			listClosure: true, // 列表加载开关（防止重复请求）
			rollLoad: false, // 是否滚动加载
			page: 1, // 当前页
			limit: 15, // 是否为ie10
			labelListData: [], // 标签列表数据
			listType: 'folder',
			tempFileLength: 0,
			showSkeleton: true, //骨架屏展示开关
		};
	},
	computed: {
		...mapState('list', ['listStatus']),
		totalList() {
			return [...this.folderList, ...this.fileList]
		}
	},
	mounted() {},
	methods: {
		...mapMutations('list',
			[
				'UPDATE_LIST_STATUS',
				'UPDATE_VIEW_FOLDER_ID',
				'UPDATE_EDIT_FOLDER_ID'
			]),
		/**
		 * [getList 获取文件列表数据]
		 *
		 * @params
		 * @return  {[type]}  [return description]
		 */
		getList(params) {
			const {
				listType
			} = params
			this.listType = listType;
			switch (listType) {
				case 'recently':
					this.recentOpenDocuments(params)
					break;
				case 'folder':
					this.getFolder(params)
					break;
			}
		},
		/**
		 * [getFolder 获取文件列表数据]
		 *
		 * @params
		 * @return  {[type]}  [return description]
		 */
		getFolder(params) {
			if (!this.listClosure) {
				return
			}
			// 刷新重置
			this.page = 1
			this.limit = 15,
			this.listClosure = false;
			this.showSkeleton = true;
			const folderId = this.getFolderId()
			const pageParams = {
				folderId,
				page: this.page,
				limit: this.limit,
			}
			const config = {
				hideLoading: true
			};
			Promise.all([findDocFolder({
				folderId
			}, config), findDocFile(pageParams, config)]).then(
				(res) => {
					this.listClosure = true; // 开启按钮防止重复请求
					this.showSkeleton = false; // 关闭骨架屏
					const [resFolderList, resFileList] = res
					if (resFolderList.code !== 0 || resFileList.code !== 0) return
					this.folderList = resFolderList.data || []
					this.fileList = resFileList.data.records || []
					if (resFileList.data.pages > resFileList.data.current) this.rollLoad = true // 还有更多数据时开启滚动加载
					if (params && params.callback) params.callback()
				},
				err => {
					this.listClosure = true; // 开启按钮防止重复请求
					this.showSkeleton = false; // 关闭骨架屏
				});
		},
		/**
		 * [getFolderId 获取所需查询列表的folderId]
		 *
		 * @params
		 * @return  {[type]}  [return description]
		 */
		getFolderId() {
			if (this.$mp.page.options.folderId) return this.$mp.page.options.folderId
			const folderId = wx.getStorageSync('rootFolder').folderId;
			return folderId
		},
		/**
		 * [loadMore 加载更多]
		 *
		 * @return  {[type]}  [return description]
		 */
		loadMore(params) {
			if (!this.listClosure || !this.rollLoad) {
				return
			}
			const {
				listType
			} = params
			this.listType = listType
			this.listClosure = false;
			this.rollLoad = false;
			this.showSkeleton = true;
			const folderId = this.getFolderId()
			this.page += 1
			const pageParams = {
				folderId,
				page: this.page,
				limit: this.limit,
			}
			let requestFunc
			switch (listType) {
				case 'recently':
					requestFunc = getRecent
					break;
				default:
					requestFunc = findDocFile
			}
			if (listType === 'recently') {
				delete pageParams.folderId
			}
			const config = {
				hideLoading: true
			};
			requestFunc(pageParams, config).then(resFileList => {
				this.listClosure = true; // 开启按钮防止重复请求
				this.showSkeleton = false;
				if (resFileList.code !== 0) return
				this.fileList = [...this.fileList, ...resFileList.data.records]
				if (resFileList.data.pages > resFileList.data.current) this.rollLoad = true // 还有更多数据时开启滚动加载
				if (params && params.callback) params.callback()
			})
		},
		/**
		 * [recentOpenDocuments 获取最近文件列表数据]
		 *
		 * @return  {[type]}  [return description]
		 */
		recentOpenDocuments(params) {
			if (!this.listClosure) {
				return
			}
			// 刷新重置
			this.page = 1;
			this.limit = 10;
			this.listClosure = false;
			this.showSkeleton = true;
			const pageParams = {
				page: this.page,
				limit: this.limit,
			}
			const config = {
				hideLoading: true
			};
			getRecent(pageParams, config)
				.then(
					(resFileList) => {
						this.listClosure = true; // 开启按钮防止重复请求
						this.showSkeleton = false;
						if (resFileList.code !== 0) return
						this.folderList = []
						this.fileList = resFileList.data.records || []
						if (resFileList.data.pages > resFileList.data.current) this.rollLoad = true // 还有更多数据时开启滚动加载
						if (params && params.callback) params.callback()
					},
					err => {
						this.listClosure = true;
						this.showSkeleton = false;
					});
		},
		/**
		 * [listDataUpdate 更新列表数据]
		 *
		 * @param   {[object]}  listDataItem  [listDataItem 单条数据（文件/文件夹）]
		 * @param   {[string]}  action        [action 对数据做的操作类型]
		 * @param   {[string]}  objectId      [objectId 文件/文件夹id]
		 *
		 * @return  {[type]}                [return description]
		 */
		listDataUpdate(action, listItem, type, inputValue) {
			switch (action) {
				case 'add':
					// 添加列表数据
					this.addDataObject(listItem, type);
					break;
				case 'delete':
					// 删除数组中指定对象(删除文件/文件夹)
					this.deleteDataObject(listItem);
					break;
				case 'deleteRecently':
					// 删除最近记录
					this.deleteRecenlyDataObject(listItem, inputValue);
					break;
				case 'rename':
					// 重命名
					this.rename(listItem, inputValue);
					break;
				case 'addFolder':
					// 新建文件夹
					this.addFolder(inputValue);
					break;
				case 'open':
					// 打开文件
					this.handleTdClick(listItem)
				default:
					break;
			}
		},
		/**
		 * [deleteListData 删除数组中指定对象]
		 *
		 * @param   {[object]}  objectId  [objectId 文件/文件夹id]
		 *
		 * @return  {[type]}            [return description]
		 */
		deleteDataObject(listItem) {
			const removeItem = (item) => {
				// 由于后端接口分页参数限制，不支持直接替换
				// if (!item.docId) {
				//   const index = this.folderList.findIndex(item => item.folderId === listItem.folderId);
				//   this.folderList.splice(index, 1);
				// } else {
				//   const index = this.fileList.findIndex(item => item.docId === listItem.docId);
				//   this.fileList.splice(index, 1);
				// }
				if (!item.docId) {
					const index = this.folderList.findIndex(item => item.folderId === listItem.folderId);
					this.folderList.splice(index, 1);
				} else {
					this.fileList = []
					this.folderList = []
					this.getFolder()
				}
			}
			const removeFunc = !listItem.docId ? removeDocFolder : removeDocFile;
			const params = !listItem.docId ? {
				folderId: listItem.folderId
			} : {
				docId: listItem.docId
			};
			removeFunc(params)
				.then((res) => {
					if (res.code !== 0) return
					removeItem(listItem)
					this.$refs.uToast.show({
						title: '删除成功!'
					})
				})
		},
		/**
		 * [deleteListData 删除数组中指定对象]
		 *
		 * @param   {[object]}  objectId  [objectId 文件/文件夹id]
		 *
		 * @return  {[type]}            [return description]
		 */
		deleteRecenlyDataObject(listItem, checked) {
			const removeItem = (item) => {
				// if (!item.docId) {
				//   const index = this.folderList.findIndex(item => item.folderId === listItem.folderId);
				//   this.folderList.splice(index, 1);
				// } else {
				//   const index = this.fileList.findIndex(item => item.docId === listItem.docId);
				//   this.fileList.splice(index, 1);
				// }
				// 由于分页参数问题 暂时无法实现前端控制 必须刷新列表
				this.fileList = []
				this.folderList = []
				this.recentOpenDocuments();
			}
			uni.showLoading({
				mask: true,
				message: "正在移除...",
			})
			const params = {
				docId: listItem.docId
			}
			deleteDocFileRecent(params, {
					hideLoading: true
				})
				.then((res) => {
					if (res.code !== 0) return
					if (!checked) {
						removeItem(listItem);
						uni.hideLoading();
						this.$refs.uToast.show({
							title: '移除成功!'
						})
					} else {
						removeDocFile(params)
							.then((res) => {
								if (res.code !== 0) return
								removeItem(listItem);
								uni.hideLoading();
								this.$refs.uToast.show({
									title: '移除成功!'
								})
							})
					}
				})
		},
		/**
		 * [rename 重命名]
		 * @param   {[object]}  listItem  [listItem 单条数据（文件/文件夹）]
		 *
		 * @return  {[type]}                [return description]
		 */
		rename(listItem, inputValue) {
			const {
				docId,
				folderId,
				folderName,
				fileName
			} = listItem;
			const defaultValue = folderName || fileName
			if (inputValue === defaultValue) return
			if (!inputValue.trim()) return this.$refs.uToast.show({
				title: `${docId ? '文件名不能为空' : '文件夹名称不能为空'}`
			})
			if (/^\./.test(inputValue.trim())) return this.$refs.uToast.show({
				title: `${docId ? '文件' : '文件夹'}名称首位字符不能为.`
			})
			if (!this.specialSymbol(inputValue.trim())) return this.$refs.uToast.show({
				title: `名称中包含不被允许的非法字符 / \\ : " * ? < > | %`
			})
			const requestFunc = docId ? renameFile : renameFolderName
			const params = docId ? {
				docId,
				fileName: inputValue.trim()
			} : {
				folderId,
				folderName: inputValue.trim()
			}
			requestFunc(params).then(() => {
				this.$refs.uToast.show({
					title: '修改成功！'
				})
				this.updataDataList(listItem, 'name', inputValue.trim())
			})
		},
		/**
		 * [updataDataList 更新列表字段数据]
		 *
		 * @param   {[Array]}  listItem      [listItem 单条数据（文件/文件夹）]
		 * @param   {[object]}  field  [field 更新字段名]
		 *
		 * @return  {[type]}                [return description]
		 */
		updataDataList(listItem, field, value) {
			const {
				id,
				docId
			} = listItem;
			if (docId) {
				const index = this.fileList.findIndex(item => {
					return item.id === id;
				});
				this.fileList[index].fileName = value
			} else {
				const index = this.folderList.findIndex(item => {
					return item.id === id;
				});
				this.folderList[index].folderName = value
			}
		},
		/**
		 * [addDataObject 添加列表数据]
		 *
		 * @param   {[Array]}  listData      [listData 总数据（文件/文件夹）]
		 * @param   {[object]}  listDataItem  [listDataItem 单条数据（文件/文件夹）]
		 *
		 * @return  {[type]}                [return description]
		 */
		addDataObject(listDataItem, type) {
			// 由于分页参数问题 暂时无法实现前端控制 必须刷新列表
			if (type === 'file') {
				this.fileList = []
				this.folderList = []
				this.getFolder()
			} else {
				this.folderList.push(listDataItem)
			}
		},
		/**
		 * [tagFileLabel 整合标签和列表数据]
		 *
		 * @param   {[Array]}  listData  [listData 列表数据]
		 *
		 * @return  {[type]}            [return 返回整合好的数组]
		 */
		tagFileLabel(listData = []) {
			for (let i = 0, max = listData.length; i < max; i++) {
				if (
					listData[i].description !== '' &&
					JSON.parse(listData[i].description).label
				) {
					let labelDescription = this.labelListData.filter(function(item) {
						return JSON.parse(listData[i].description).label.includes(
							item.label
						);
					});
					listData[i].labelDescription = labelDescription.splice(0, 4);
				}
			}
			return listData;
		},
		/**
		 * [handleTdClick 监听用户点击列表]
		 *
		 * @param   {[object]}  listHeadDataItem  [listHeadDataItem 列表类型数据]
		 *
		 * @return  {[type]}                    [return description]
		 */
		handleTdClick(listItem = {}) {
			let type;
			if (listItem.docId) {
				type = 'file'
			} else {
				type = 'folder'
			}
			if (type === 'folder') {
				// 打开文件夹
				this.openFolder(listItem.folderId);
			} else {
				// 打开文件
				this.openFile(listItem);
			}
		},
		/**
		 * [openFolder 打开文件夹]
		 *
		 * @param   {[string]}  folderId    [文件id]
		 *
		 * @return  {[type]}        [return description]
		 */
		openFolder(folderId) {
			let url = ''
			const {
				route
			} = this.$mp.page
			switch (route) {
				case 'pages/folder/folder':
					url = '/pages/childrenList/childrenList'
					break;
				case 'pages/move/move':
					url = '/pages/move/move'
					break;
				default:
					url = '/pages/childrenList/childrenList'
			}
			uni.navigateTo({
				url: `${url}?folderId=${folderId}`
			})
		},
		/**
		 * [openFile 打开文件]
		 *
		 * @param   {[string]}  id    [id 文件id]
		 * @param   {[string]}  name  [name 文件名]
		 *
		 * @return  {[type]}        [return description]
		 */
		openFile(listItem) {
			const getExtName = function(fileName) {
				const fileNameArr = fileName.split('.')
				if (fileNameArr.length !== 0 && fileNameArr.length > 2) {
					return fileNameArr.pop().toLowerCase()
				}
				if (fileNameArr.length === 2) {
					return fileNameArr[1].toLowerCase()
				}
				return ''
			}
			const id = listItem.docId
			const type = getExtName(listItem.fileName)
			if (type === 'pdf') {
				openDocFile({
					docId: listItem.docId
				})
			}
			// pdf打开暂未实现
			// openDocFile({ docId: id })
			// window.open(`https://edit.foxitcloud.cn?url=${encodeURIComponent(`https://docsapi.foxitcloud.cn/docFile/downloadFile?docId=${listItem.docId}&token=${JSON.parse(token).token}&appKey=${appKey}`)}`);

			// 下载文件
			const filename = listItem.folderName || listItem.fileName
			this.downLoadFile(id, filename, type)
		},
		/**
		 * [downLoadFile 下载文件]
		 *
		 * @param   {[string]}  id  [id 文件的docId]
		 *
		 * @return  {[type]}      [return description]
		 */
		async downLoadFile(docId, filename, type) {
			try {
				await checkDocToken()
			} catch (e) {
				return
			}
			const url =
				`${REQUEST_URL}/docFile/downloadFile?docId=${docId}&appKey=${APPKEY}&token=${uni.getStorageSync('token').token}`;
			const isOpenDocument = type === "pdf" || type === "xls" || type === "doc" || type === "ppt" || type ===
				"docx" || type === "xlsx" || type === "pptx" || type === "jpeg" || type === "png" || type === "jpg";
			//新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
			if (isOpenDocument) {
				if (type === "jpeg" || type === "png" || type === "jpg") {
					uni.previewImage({
						urls: [url]
					})
				} else if (type === "pdf") {
					uni.navigateTo({
						url: `/pages/editPdf/editPdf?docId=${docId}`
					})
				} else {
					uni.downloadFile({
						url,
						success: (res) => {
							console.log(res)
							const filePath = res.tempFilePath
							uni.openDocument({
								filePath
							})
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
			} else {
				this.$refs.uToast.show({
					title: '该文件不支持在小程序内打开!',
				})
			}
		},
		/**
		 * [addFolder 下载文件]
		 *
		 * @return  {[type]}      [return description]
		 */
		addFolder(inputValue) {
			if (!inputValue.trim()) return this.$refs.uToast.show({
				title: `文件夹名称不能为空`
			})
			if (/^\./.test(inputValue.trim())) return this.$refs.uToast.show({
				title: `文件夹名称首位字符不能为.`
			})
			if (!this.specialSymbol(inputValue.trim())) return this.$refs.uToast.show({
				title: `名称中包含不被允许的非法字符 / \\ : " * ? < > | %`
			})
			this.checkText(inputValue.trim())
				.then(() => {
					const params = {
						folderName: inputValue.trim(),
						parentId: this.getFolderId(),
					}
					uni.showLoading({
						title: '正在创建...',
						mask: true,
					})
					addDocFolder(params).then((res) => {
						uni.hideLoading();
						this.$refs.uToast.show({
							title: '创建成功！'
						})
						if(this.$root.$mp.page.route === 'pages/index/index') return
						this.addDataObject(res.data, 'folder')
					})
				})
				.catch(() => {
					uni.showToast({
						title: '含有违法违规内容',
						icon: 'none',
						duration: 2000
					})
				})
		},
		/**
		 * 检测文本内容(内容是否含有违法违规内容)
		 */
		checkText(text) {
			return new Promise((resolve, reject) => {
				let url = 'https://wechatmp.foxitreader.cn/security/checkText';
				let sendData = {
					appId: 'wxeeeee850023ae299',
					content: text
				}
				uni.request({
					url: url,
					method: "POST",
					data: sendData,
					header: {
						// "Authorization": 'Bearer ' + this.cmis_token, 似乎可以不传
						'content-type': 'application/x-www-form-urlencoded'
					},
				}).then((res) => {
					if (res[0]) return reject('网络错误,请重试！');
					if (res[1].data.ret === 0) {
						resolve(res)
					} else if (res[1].data.ret === 87014) {
						reject('含有违法违规内容');
					}
				}).catch(() => {
					reject('含有违法违规内容');
				})
			})
		},
		/**
		 * 微信文件上传
		 */
		async uploadWxFile() {
			try {
				await checkDocToken()
			} catch (e) {
				return
			}
			uni.chooseMessageFile({
				count: 10,
				success: async (res) => {
					this.tempFileLength = res.tempFiles.length;
					uni.showLoading({
						mask: true,
						title: '上传中...'
					});
					const {
						userDocSetting
					} = this.$store.state.user
					const uploadMaxLimit = userDocSetting.find(item => item.paramKey ===
							'uploadMaxLimit')
						.paramValue
					const uploadFileNotFormat = userDocSetting.find(item => item.paramKey ===
						'uploadFileNotFormat').paramValue.split(',')
					const err = [];
					for (let i = 0, max = res.tempFiles.length; i < max; i++) {
						let uploadFilePath = res.tempFiles[i].path;
						let uploadFileName = res.tempFiles[i].name;
						let size = res.tempFiles[i].size
						let extName = this.getExtName(uploadFileName)
						if (uploadFileNotFormat.find(item => item === extName)) {
							uni.hideLoading();
							this.$refs.uToast.show({
								title: '含有不支持上传的文件类型！'
							})
							return;
						}
						if (Number(size) > Number(uploadMaxLimit)) {
							uni.hideLoading();
							this.$refs.uToast.show({
								title: '上传的文件过大！'
							})
							return;
						}
						// 检测文本内容(内容是否含有违法违规内容)
						try {
							let checkRes = await this.checkText(uploadFileName);
						} catch (e) {
							this.$refs.uToast.show({
								title: '含有违法违规内容！'
							})
							return;
						}
					}
					for (let i = 0, max = res.tempFiles.length; i < max; i++) {
						let uploadFilePath = res.tempFiles[i].path;
						let uploadFileName = res.tempFiles[i].name;
						uni.getFileInfo({
							filePath: uploadFilePath,
							success: (fileRes) => {
								const md5 = res.fileRes;
								this.setUploadFile(uploadFilePath, uploadFileName, md5, res
									.tempFiles.length, err)
							}
						})
					}
				}
			});
		},
		/**
		 * 上传文件请求
		 */
		setUploadFile(uploadFilePath, uploadFileName, md5, total, err) {
			wx.uploadFile({
				url: `${REQUEST_URL}/docFile/upload?fileName=${uploadFileName}&md5=${md5}&folderId=${this.getFolderId()}`,
				filePath: uploadFilePath,
				name: 'file',
				header: {
					"token": uni.getStorageSync('token').token,
					"appKey": APPKEY,
					"content-type": 'multipart/form-data'
				},
				success: (data) => {
					console.log(data)
					this.tempFileLength--;
					// 添加异常备用
					if (JSON.parse(data.data).code !== 0) {
						err.push(JSON.parse(data.data).msg)
					}
					if (this.tempFileLength !== 0) {
						return
					}
					uni.hideLoading();
					if (err.length > 0) {
						if (total === err.length) {
							return this.$refs.uToast.show({
								title: '文件重名，上传失败!'
							})
						} else {
							if(this.$root.$mp.page.route !== 'pages/index/index') {
								this.fileList = [];
								this.folderList = [];
								this.getFolder();
							}
							return this.$refs.uToast.show({
								title: '部分文件重名，上传失败!'
							})
						}
					} else {
						this.$refs.uToast.show({
							title: '上传成功!'
						})
						if(this.$root.$mp.page.route !== 'pages/index/index') {
							this.fileList = [];
							this.folderList = [];
							this.getFolder();
						}
					}
				},
				fail: (data) => {
					err.push('上传失败!');
					this.tempFileLength--;
				}
			})
		},
	},
};

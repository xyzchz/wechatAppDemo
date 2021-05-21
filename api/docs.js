import request from './request.js'

/**
 * @description: 获取令牌
 * @param {*}
 * @return {*}
 */
export const getToken = (data = {}, config = {}, header) => request({
	url: `/user/getTokenByWxToken`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 获取用户信息
 * @param {*}
 * @return {*}
 */
export const getUserInfo = (data = {}, config = {}, header) => request({
	url: `/user/getUserInfo`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 是否认证
 * @param {*}
 * @return {*}
 */
export const certification = (data = {}, config = {}, header) => request({
	url: `/certification/hasCertification`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 获取用户根目录ID
 * @param {*}
 * @return {*}
 */
export const getRootFolderId = (data = {}, config = {}, header) => request({
	url: `/docFolder/getRootFolder`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 获取用户所有参数
 * @param {*}
 * @return {*}
 */
export const findDocSettingList = (data = {}, config = {}, header) => request({
	url: `/docSetting/findDocSettingList`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 获取标签列表
 * @param {*}
 * @return {*}
 */
export const findDocUserLabelList = (data = {}, config = {}, header) => request({
	url: `/docUserLabel/findDocUserLabelList`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 获取文件列表数据
 * @param {*}
 * @return {*}
 */
export const findDocFile = (data = {}, config = {}, header) => request({
	url: `/docFile/findDocFile`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 获取目录列表数据
 * @param {*}
 * @return {*}
 */
export const findDocFolder = (data = {}, config = {}, header) => request({
	url: `/docFolder/findDocFolder`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 删除文档
 * @param {*}
 * @return {*}
 */
export const deleteDocFile = (data = {}, config = {}, header) => request({
	url: `/docFile/deleteDocFile`,
	method: 'DELETE',
	data,
	header,
	...config
});

/**
 * @description: 删除目录
 * @param {*}
 * @return {*}
 */
export const deleteDocFolder = (data = {}, config = {}, header) => request({
	url: `/docFolder/deleteDocFolder`,
	method: 'DELETE',
	data,
	header,
	...config
});

/**
 * @description: 文档重命名
 * @param {*}
 * @return {*}
 */
export const renameFile = (data = {}, config = {}, header) => request({
	url: `/docFile/rename`,
	method: 'POST',
	data,
	header,
	...config
});

/**
 * @description: 目录重命名
 * @param {*}
 * @return {*}
 */
export const renameFolderName = (data = {}, config = {}, header) => request({
	url: `/docFolder/rename`,
	method: 'POST',
	data,
	header,
	...config
});


/**
 * @description: 最近打开列表
 * @param {*}
 * @return {*}
 */
export const getRecent = (data = {}, config = {}, header) => request({
	url: `/docFileRecentOpen/findPage`,
	method: 'GET',
	data,
	header,
	...config
});

/**
 * @description: 上传最近打开记录
 * @param {*}
 * @return {*}
 */
export const openDocFile = (data = {}, config = {
	hideLoading: true
}, header) => request({
	url: `/docFileRecentOpen/openDocFile`,
	method: 'POST',
	data,
	header,
	...config
});

/**
 * @description: 删除打开记录
 * @param {*}
 * @return {*}
 */
export const deleteDocFileRecent = (data = {}, config = {}, header) => request({
	url: `/docFileRecentOpen/deleteDocFileRecent/` + data.docId,
	method: 'DELETE',
	data,
	header,
	...config
});

/**
 * @description: 移动文档
 * @param {*}
 * @return {*}
 */
export const moveDocFile = (data = {}, config = {}, header) => request({
	url: `/docFile/moveDocFile`,
	method: 'POST',
	data,
	header,
	...config
});

/**
 * @description: 移动目录
 * @param {*}
 * @return {*}
 */
export const moveDocFolder = (data = {}, config = {}, header) => request({
	url: `/docFolder/moveDocFolder`,
	method: 'POST',
	data,
	header,
	...config
});

/**
 * @description: 复制文档
 * @param {*}
 * @return {*}
 */
export const copyDocFile = (data = {}, config = {}, header) => request({
	url: `/docFile/copyDocFile`,
	method: 'POST',
	data,
	header,
	...config
});

/**
 * @description: 新建文件夹
 * @param {*}
 * @return {*}
 */
export const addDocFolder = (data = {}, config = {}, header) => request({
  url: `/docFolder/addDocFolder`,
  method: 'POST',
  data,
  header,
  ...config
});
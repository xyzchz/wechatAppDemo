/*
 * @Author: your name
 * @Date: 2021-04-30 11:29:30
 * @LastEditTime: 2021-04-30 11:37:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \cloud_doc\src\base\utils\util.js
 */
export default {
	install: function(Vue, opt) {
		// 时间转换
		Vue.filter('formatTime', function(time) {
			const date = new Date(Number(time));
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			const formatNumber = n => {
				n = n.toString();
				return n[1] ? n : '0' + n;
			};
			return [year, month, day].map(formatNumber).join('-');
		});
		// 文件大小转换
		Vue.filter('bytesToSize', function(bytes) {
			if (bytes === 0 || bytes === "0") return '0 B';
			let k = 1024;
			let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			let i = Math.floor(Math.log(bytes) / Math.log(k));
			let num = (bytes / Math.pow(k, i));
			return num.toFixed(2) + sizes[i];
		});
		Vue.filter('fileIcon', (fileType) => {
			return 'webImg/list/pdf.png';
		});
		// 判断文件特殊符号
		Vue.prototype.specialSymbol = function(str) {
			let myReg = /[%*/|<>?"\\:]/;
			if (!myReg.test(str) && str.trim() !== '') {
				return true;
			}
			return false;
		};
		// 列表文件名展示
		Vue.filter('formatListName', function(item) {
			if (item.folderName) return item.folderName
			const fileNameArr = item.fileName.split('.')
			if (fileNameArr.length !== 0 && fileNameArr.length > 2) {
				fileNameArr.pop()
				return fileNameArr.join('.')
			}
			if (fileNameArr.length !== 0) {
				return fileNameArr[0]
			}
		});
		Vue.filter('extName', (item) => {
			const fileNameArr = item.fileName.split('.')
			if (fileNameArr.length !== 0 && fileNameArr.length > 2) {
				return fileNameArr.pop()
			}
			if (fileNameArr.length === 2) {
				return fileNameArr[1]
			}
			return ''
		});
		/**
		 * @description: 转化数字为时间显示
		 * @param {*}
		 * @return {*}
		 */
		Vue.filter('formatDay', function(num) {
			if(Number(num) === 0) return '永久';
			return `${num}天`;
		})
		/**
		 * @description: 获取extName
		 * @param {*}
		 * @return {*}
		 */
		Vue.prototype.getExtName = function(fileName) {
			const fileNameArr = fileName.split('.')
			if (fileNameArr.length !== 0 && fileNameArr.length > 2) {
				return fileNameArr.pop().toLowerCase()
			}
			if (fileNameArr.length === 2) {
				return fileNameArr[1].toLowerCase()
			}
			return ''
		};
		/**
		 * @description: 拼接url参数
		 * @param {*}
		 * @return {*}
		 */
		Vue.prototype.urlPlusOptions = function(url, options) {
			if (!options) return url
			Reflect.ownKeys(options).forEach((key, index) => {
				console.log(key)
				if (index === 0) {
					url += `?${key}=${options[key]}`
				} else {
					url += `&${key}=${options[key]}`
				}
			})
			return url
		};
	},

};

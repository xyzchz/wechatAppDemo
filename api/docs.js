import request from './request.js'

/**
 * @description: 获取令牌
 * @param {*}
 * @return {*}
 */
 export const getToken = (config) => request({
  url: `user/getToken`,
	method: 'GET',
  ...config
});
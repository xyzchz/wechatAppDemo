/*
 * @Author: your name
 * @Date: 2021-04-26 16:03:51
 * @LastEditTime: 2021-04-26 16:30:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\store\modules\request.js
 */

import {
  UPDATE_ADD_REQUEST_COUNT,
  UPDATE_SUBTRACT_REQUEST_COUNT,
} from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    requestCount: 0,
  }),
  mutations: {
    // 更新增加记录请求数量
    [UPDATE_ADD_REQUEST_COUNT](state) {
      state.requestCount = state.requestCount + 1;
    },
    // 更新减少记录请求数量
    [UPDATE_SUBTRACT_REQUEST_COUNT](state) {
      state.requestCount = state.requestCount - 1;
      if (state.requestCount < 0) state.requestCount = 0;
    },
  },
}
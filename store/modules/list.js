/*
 * @Author: your name
 * @Date: 2021-04-26 16:03:34
 * @LastEditTime: 2021-04-26 16:26:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\store\modules\list.js
 */

import {
  UPDATE_LIST_STATUS,
} from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    listStatus: 'view',
  }),
  mutations: {
    // 当前列表状态
    [UPDATE_LIST_STATUS](state, type) {
      state.listStatus = listStatus
    },
  },
}
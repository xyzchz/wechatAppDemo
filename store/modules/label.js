/*
 * @Author: zeng_cheng
 * @Date: 2021-04-29 14:04:11
 * @LastEditTime: 2021-04-30 14:17:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\store\modules\label.js
 */
/*
 * @Author: your name
 * @Date: 2021-04-26 16:03:38
 * @LastEditTime: 2021-04-29 11:08:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\store\modules\user.js
 */

import {
  SET_LABEL_LIST,
} from '../mutation-types'

import {
  GET_LABEL_LIST,
} from '../action-types'

import { findDocUserLabelList } from 'api'

export default {
  namespaced: true,
  state: () => ({
    labelList: [],
  }),
  mutations: {
    // 用户限制参数  预留 暂未使用 例如 用于文件上传
    [SET_LABEL_LIST](state, labelList) {
      state.labelList = labelList
    },
  },
  actions: {
    [GET_LABEL_LIST]({commit}, config = {}) {
      return new Promise((resolve) => {
        findDocUserLabelList({}, config).then(res=>{
          resolve(res)
          commit(SET_LABEL_LIST, res.data)
        })
      })
    }
  }
}
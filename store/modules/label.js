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
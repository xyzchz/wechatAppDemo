import {
  SET_LABEL_LIST,
	DELETE_LABEL,
	UPDATE_LABEL_LIST,
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
    [SET_LABEL_LIST](state, labelList = []) {
			console.log(labelList)
      state.labelList = labelList
    },
		// 移除标签
		[DELETE_LABEL](state, id) {
			const index = state.labelList.findIndex(current => current.id === id)
		  state.labelList.splice(index, 1)
		},
		// 更新标签
		[UPDATE_LABEL_LIST](state, { labelColor, labelName, id }) {
			const index = state.labelList.findIndex(current => current.id === id)
			state.labelList[index].labelColor = labelColor;
			state.labelList[index].labelName = labelName;
		}
  },
  actions: {
    [GET_LABEL_LIST]({commit}, config = {}) {
      return new Promise((resolve) => {
        findDocUserLabelList({}, config).then(res=>{
          resolve(res);
				  commit(SET_LABEL_LIST, res.data);
        })
      })
    }
  }
}
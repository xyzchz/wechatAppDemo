/*
 * @Author: your name
 * @Date: 2021-04-26 16:03:34
 * @LastEditTime: 2021-04-26 16:26:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\store\modules\list.js
 */

import {
  UPDATE_USER_ROOT_FOLDER,
  UPDATE_VIEW_FOLDER_ID,
  UPDATE_EDIT_FOLDER_ID,
  UPDATE_LIST_STATUS,
} from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    viewFolderId: "",
    editFolderId: "",
    listStatus: 'view',
    initStatus: false
  }),
  mutations: {
    // 当前浏览目录ID
    [UPDATE_VIEW_FOLDER_ID](state, folderId) {
      state.viewFolderId = folderId
    },
    // 当前编辑目录ID
    [UPDATE_EDIT_FOLDER_ID](state, folderId) {
      state.editFolderId = folderId
    },
    // 当前列表状态
    [UPDATE_LIST_STATUS](state, type) {
      state.listStatus = listStatus
    },
  },
}
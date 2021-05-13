/*
 * @Author: your name
 * @Date: 2021-04-26 16:03:38
 * @LastEditTime: 2021-04-29 14:16:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\store\modules\user.js
 */

import {
  UPDATE_CERTIFICATION,
  UPDATE_USER_INFO,
  UPDATE_USER_ROOT_FOLDER,
  UPDATE_USER_DOC_SETTING,
  UPDATE_INIT_STATUS,
} from '../mutation-types'

export default {
  namespaced: true,
  state: () => ({
    isCertification: false,
    token: uni.getStorageSync('token')|| {},
    userInfo: "",
  }),
  mutations: {
    // 认证状态
    [UPDATE_CERTIFICATION](state, isCertification) {
      state.isCertification = isCertification;
    },
    // 更新用户信息
    [UPDATE_USER_INFO](state, userInfo) {
      state.userInfo = userInfo
    },
    // 用户根目录信息
    [UPDATE_USER_ROOT_FOLDER](state, folder) {
      state.userRootFolder = folder
    },
    // 用户限制参数  预留 暂未使用 例如 用于文件上传
    [UPDATE_USER_DOC_SETTING](state, setting) {
      state.userDocSetting = setting
    },
    // 初始化状态
    [UPDATE_INIT_STATUS](state, status) {
      state.initStatus = status
    },
  },
}
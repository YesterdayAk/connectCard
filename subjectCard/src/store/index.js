import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {},   // 用户信息
    // modelURL: "http://localhost:8081/model.json",
    // metadataURL: "http://localhost:8081/metadata.json",
    modelURL: "https://zxsbzzqjk.qdszgh.cn/model.json",
    metadataURL: "https://zxsbzzqjk.qdszgh.cn/metadata.json",
    baseUrl: "https://zxsbzzqjk.qdszgh.cn/api",
  },
  getters: {
    getToken: state => {
      let tokens = sessionStorage.getItem("token")
      if (tokens) {
        return tokens;
      }
      return state.token
    },
    getUserInfo: state => {
      let userInfos = JSON.parse(sessionStorage.getItem("userInfo"))
      if (userInfos) {
        return userInfos;
      }
      return state.userInfo
    },
    getModelURL: state => {
      let modelURL = JSON.parse(localStorage.getItem("modelURL"))
      if (modelURL) {
        return modelURL;
      }
      return state.modelURL
    },
    getMetadataURL: state => {
      let metadataURL = JSON.parse(localStorage.getItem("metadataURL"))
      if (metadataURL) {
        return metadataURL;
      }
      return state.metadataURL
    },
    getBaseUrl: state => {
      return state.baseUrl
    },
  },
  mutations: {
    setMyToken(state, token) {
      sessionStorage.setItem("token", token)
      state.token = token
    },
    setMyUserInfo(state, userInfo) {
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
      state.userInfo = userInfo
    },
    setMyModelURL(state, modelURL) {
      localStorage.setItem("modelURL", JSON.stringify(modelURL))
      state.modelURL = modelURL
    },
    setMyMetadataURL(state, metadataURL) {
      localStorage.setItem("metadataURL", JSON.stringify(metadataURL))
      state.metadataURL = metadataURL
    },
  },
  actions: {
    setUserInfo({ commit }, userInfo) {
      commit('setMyUserInfo', { userInfo })
    },
  }
})

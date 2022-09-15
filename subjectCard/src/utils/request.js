import axios from 'axios'
import store from '@/store'

axios.defaults.timeout = 50000000000
// axios.defaults.baseURL = '/apk'
iniHeader()

/**
 *  给header添加token
 * @param {*} token  
 * @returns 
 */
export function iniHeader() {
  // http request 拦截器
  axios.interceptors.request.use(
    config => {
      // console.log(store.getters.getToken);
      if (store.getters.getToken) {
        config.headers = {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': store.getters.getToken,
        }
      } else {
        config.headers = {
          'Content-Type': 'application/json;charset=UTF-8',
        }
      }
      return config
    }
  )
}



// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 401) {
      // 写点啥吧
    }
    if (response.data.code === 500) {
      // 写点啥吧
      // window.location.reload();
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @returns {Promise}
 */
export function deletes(url) {
  return new Promise((resolve, reject) => {
    axios.delete(url)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

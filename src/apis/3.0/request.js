import axios from 'axios'
import {ElMessage} from 'element-plus'
import {store} from '../../stores/index'

const baseUrl = 'http://121.37.66.218:8080'
/**
 * P 开头方法只返回内容，无内容时返回 undefined ：： data
 * 非 P 开头方法返回原内容（保证有对象返回） ：： { msg, code, data }
 */
const request = {
  async get(url, options) {
    return this._normal('get', url, options, false)
  },
  async post(url, options) {
    return this._normal('post', url, options, false)
  },
  async put(url, options) {
    return this._normal('put', url, options, false)
  },
  async delete(url, options) {
    return this._normal('delete', url, options, false)
  },
  async Pget(url, options) {
    return this._normal('get', url, options, true)
  },
  async Ppost(url, options) {
    return this._normal('post', url, options, true)
  },
  async Pput(url, options) {
    return this._normal('put', url, options, true)
  },
  async Pdelete(url, options) {
    return this._normal('delete', url, options, true)
  },
  async _normal(method, url, options, needPackage) {
    const {headers, ...others} = options || {}
    let res
    const mergeUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url : baseUrl + url
    try {
      res = await axios.request({
        url: mergeUrl,
        method,
        headers: {
          ...headers,
          Authorization: store.getters['user/token'],
        },
        ...others,
      })
      if (!res.data) {
        throw '返回数据格式异常'
      }
    } catch (e) {
      // const msg = '网络请求失败：网络请求错误'
      const msg = '尚无数据'
      ElMessage({
        type: 'info',
        message: msg,
      })
      return needPackage
          ? undefined
          : {
            code: 404,
            msg,
          }
    }
    if (res.data.code != 200) {
      const msg = res.data.message
      // const msg = '尚无数据'
      ElMessage({
        type: 'info',
        message: msg,
      })
    }
    return needPackage ? res.data.data : res.data
  },
  async postJSON(url,data) {
    let res = await axios({
      method: 'post',
      url: baseUrl+url,
      headers: {
        'Authorization': store.getters['user/token'],
        'Content-Type': 'application/json'
      },
      data: data
    })
    return res.data
  },
}

export default request

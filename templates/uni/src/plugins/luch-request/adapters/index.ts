import buildURL from '../helpers/buildURL'
import buildFullPath from '../core/buildFullPath'
import settle from '../core/settle'
import { isUndefined } from '../utils'
import type { HttpRequestConfig } from '@/plugins/luch-request/index.d'
interface Response {
  data: any
  config?: HttpRequestConfig
  [key: string]: any
}

/**
 * 返回可选值存在的配置
 * @param {Array} keys - 可选值数组
 * @param {Object} config2 - 配置
 * @return {{}} - 存在的配置项
 */
const mergeKeys = (keys: string[], config2: HttpRequestConfig) => {
  const config: Partial<HttpRequestConfig> = {}
  keys.forEach((prop) => {
    if (!isUndefined(config2[prop])) {
      config[prop] = config2[prop]
    }
  })
  return config
}

export default (config: HttpRequestConfig) =>
  new Promise((resolve, reject) => {
    const fullPath = buildURL(
      buildFullPath(config.baseURL || '', config.url || ''),
      config.params
    )
    const _config:
      | UniApp.RequestOptions
      | UniApp.UploadFileOption
      | UniApp.DownloadFileOption = {
      url: fullPath,
      header: config.header,
      complete: (response: Response) => {
        config.fullPath = fullPath
        response.config = config
        try {
          if (typeof response.data === 'string') {
            response.data = JSON.parse(response.data)
          }
        } catch (e) {}
        settle(resolve, reject, response)
      },
    }

    let requestTask:
      | UniApp.RequestTask
      | UniApp.UploadTask
      | UniApp.DownloadTask

    if (config.method === 'UPLOAD') {
      delete _config.header['content-type']
      delete _config.header['Content-Type']
      const otherConfig = {
        // #ifdef MP-ALIPAY
        fileType: config.fileType,
        // #endif
        filePath: config.filePath,
        name: config.name,
      }
      const optionalKeys = [
        // #ifdef APP-PLUS || H5
        'files',
        'pubOrPri',
        'width',
        'height',
        'https',
        // #endif
        // #ifdef H5
        'file',
        // #endif
        // #ifdef H5 || APP-PLUS
        'timeout',
        // #endif
        'formData',
      ]
      requestTask = uni.uploadFile({
        ..._config,
        ...otherConfig,
        ...mergeKeys(optionalKeys, config),
      } as UniApp.UploadFileOption) as unknown as UniApp.UploadTask
    } else if (config.method === 'DOWNLOAD') {
      // #ifdef H5 || APP-PLUS
      if (!isUndefined(config.timeout)) {
        _config.timeout = config.timeout
      }
      // #endif
      requestTask = uni.downloadFile(_config) as unknown as UniApp.DownloadTask
    } else {
      const optionalKeys = [
        'data',
        'method',
        // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
        'timeout',
        // #endif
        'dataType',
        // #ifndef MP-ALIPAY
        'responseType',
        // #endif
        // #ifdef APP-PLUS
        'sslVerify',
        // #endif
        // #ifdef H5
        'withCredentials',
        // #endif
        // #ifdef APP-PLUS
        'firstIpv4',
        // #endif
      ]
      requestTask = uni.request({
        ..._config,
        ...mergeKeys(optionalKeys, config),
      } as UniApp.RequestOptions) as unknown as UniApp.RequestTask
    }

    if (config.getTask) {
      config.getTask(requestTask, config)
    }
  })

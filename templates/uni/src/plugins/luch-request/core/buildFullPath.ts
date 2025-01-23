/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 17:50:52
 * @Description:
 * @LastEditTime: 2025-01-18 17:51:26
 * @LastEditors: houbaoguo
 */
'use strict'

import isAbsoluteURL from '../helpers/isAbsoluteURL'
import combineURLs from '../helpers/combineURLs'

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
export default function buildFullPath(baseURL: string, requestedURL: string) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL
}

/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 17:50:52
 * @Description:
 * @LastEditTime: 2025-01-20 09:39:45
 * @LastEditors: houbaoguo
 */
'use strict'

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
export default function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL
    ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
    : baseURL
}

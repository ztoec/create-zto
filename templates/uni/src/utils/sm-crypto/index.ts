/*
 * @Author: houbaoguo
 * @Date: 2025-01-20 10:31:34
 * @Description:
 * @LastEditTime: 2025-01-21 13:56:35
 * @LastEditors: houbaoguo
 */
// import { v4 as uuidv4 } from 'uuid'
import { a, b, c, d, _ } from './sm_crypto_key'
import SM2 from './sm2'
import SM4 from './sm4'
const uuidv4 = async () => {
  const res: any = await uni.getRandomValues({
    length: 36,
  })
  return uni.arrayBufferToBase64(res.randomValues)
}
// #ifndef APP-PLUS
// const SM2 = require('sm-crypto').sm2
// const SM4 = require('sm-crypto').sm4
const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
// #endif

const getRealValue = (value: string) => {
  let _v,
    key = '7af9b2e0c584a36d98e47c3b0d8162af'
  // #ifndef APP-PLUS
  _v = SM4.decrypt(value, key)
  // #endif

  return _v || ''
}
const generateHex = () => {
  let key
  key = [...new Array(32)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')
  return key
}

const prod = {
  CLIENT: {
    private: _(getRealValue(a)),
  },
  SERVER: {
    public: _(getRealValue(b)),
  },
}
const dev = {
  CLIENT: {
    private: _(getRealValue(c)),
  },
  SERVER: {
    public: _(getRealValue(d)),
  },
}
const CLIENT = process.env.NODE_ENV === 'development' ? dev.CLIENT : prod.CLIENT
const SERVER = process.env.NODE_ENV === 'development' ? dev.SERVER : prod.SERVER
export const encryptData = async (params: AnyObject) => {
  // 1.对参数进行加签处理
  const msg = JSON.stringify(params)
  const key = generateHex()
  const uuid = await uuidv4()

  let sign, content, encKey

  // #ifndef APP-PLUS
  // 1.对参数进行加签处理
  // @ts-ignore
  sign = SM2.doSignature(`${msg}${uuid}`, CLIENT.private, {
    hash: true,
    der: true,
  })
  // 2.对内容进行sm4加密
  content = SM4.encrypt(msg, key)
  //3.生成enckey
  encKey = `04${SM2.doEncrypt(key, SERVER.public, 1)}`
  // #endif

  return {
    sign,
    uuid,
    content,
    encKey,
  }
}
export const decryptData = (params: AnyObject) => {
  const { encKey, content } = params
  let _encKey, _content
  // #ifndef APP-PLUS
  _encKey = SM2.doDecrypt(encKey, CLIENT.private, cipherMode)
  _content = SM4.decrypt(content, _encKey)
  // #endif

  return JSON.parse(_content)
}

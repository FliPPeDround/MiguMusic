const CrypotJs = require('crypto-js')
const JsEncrypt = require('node-jsencrypt')
const requestMigu = require('../utils/migu_request')

const song = async (cid) => {
  const publicKey = `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8asrfSaoOb4je+DSmKdriQJKW
        VJ2oDZrs3wi5W67m3LwTB9QVR+cE3XWU21Nx+YBxS0yun8wDcjgQvYt625ZCcgin
        2ro/eOkNyUOTBIbuj9CvMnhUYiR61lC1f1IGbrSYYimqBVSjpifVufxtx/I3exRe
        ZosTByYp4Xwpb1+WAQIDAQAB
        -----END PUBLIC KEY-----`

  const o = `{"copyrightId":"${cid}","type":${'1'},"auditionsFlag":0}`
  const s = new JsEncrypt()
  s.setPublicKey(publicKey)
  const a = 1e3 * Math.random()
  const u = CrypotJs.SHA256(String(a)).toString()
  const c = CrypotJs.AES.encrypt(o, u).toString()
  const f = s.encrypt(u)

  const result = await requestMigu.requestMigu('http://music.migu.cn/v3/api/music/audioPlayer/getPlayInfo', {
    dataType: 2,
    data: c,
    secKey: f
  })

  return result.data
}

module.exports = {
  song
}

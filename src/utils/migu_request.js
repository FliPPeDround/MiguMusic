const request = require('request')
const axios = require('axios')

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

const requestListherf = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response) => {
      if (response.statusCode === 200) {
        resolve(response.req.path)
      } else {
        reject(error)
      }
    })
  })
}

const requestMigu = async (url, _params) => {
  let result = {}
  try {
    if (_params !== undefined) {
      result = await axios.get(url, {
        params: _params,
        headers: {
          Referer: 'https://m.music.migu.cn/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0'
        }
      })
    } else {
      result = await axios.get(url, {
        headers: {
          Referer: 'https://m.music.migu.cn/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0'
        }
      })
    }
  } catch (error) {
    console.log(error)
  }

  return result
}

module.exports = {
  requestListherf,
  requestPromise,
  requestMigu
}

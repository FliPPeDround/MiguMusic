const requestMigu = require('../utils/migu_request')

const searchsongs = async (searchKey) => {
  const result = await requestMigu.requestMigu('https://m.music.migu.cn/migu/remoting/scr_search_tag', {
    rows: '30',
    type: '2',
    keyword: searchKey,
    pgc: '1'
  })
  return result.data
}

const searchsingers = async (searchKey) => {
  const result = await requestMigu.requestMigu('https://m.music.migu.cn/migu/remoting/scr_search_tag', {
    rows: '15',
    type: '1',
    keyword: searchKey,
    pgc: '1'
  })
  return result.data
}

const hotSearch = async () => {
  const result = await requestMigu.requestMigu('https://music.migu.cn/v3/api/search/hotwords')
  return result.data.data.hotwords[0].hotwordList.slice(0, 10)
}

const suggestSearch = async (searchKey) => {
  const result = await requestMigu.requestMigu('https://m.music.migu.cn/migu/remoting/autocomplete_tag', {
    keyword: searchKey
  })
  return result.data.key
}

module.exports = {
  searchsongs,
  searchsingers,
  hotSearch,
  suggestSearch
}

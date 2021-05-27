const requestMigu = require('../utils/migu_request')

// eslint-disable-next-line camelcase
const playList_info = async (platlistId) => {
  const result = await requestMigu.requestMigu('https://m.music.migu.cn/migu/remoting/playlistcontents_query_tag', {
    playListType: 2,
    playListId: platlistId,
    contentCount: '30'
  })
  return result.data
}

module.exports = {
  playList_info
}

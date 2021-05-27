const requestMigu = require('../utils/migu_request')

const top = async (topId) => {
  const topList = {
    0: 'jianjiao_newsong',
    1: 'jianjiao_hotsong',
    2: 'jianjiao_original'
  }

  const result = await requestMigu.requestMigu(`https://music.migu.cn/v3/music/top/${topList[topId]}`)
  const rule = /<script>\s{0,}var\s{0,}listData\s{0,}=\s{0,}({.*})\s{0,}<\/script>/s
  const arr = rule.exec(result.data)
  const data = JSON.parse(arr[1])

  const toplist = []
  for (let i = 0; i < 20; i++) {
    toplist.push({
      name: data.songs.items[i].name,
      pic: 'http:' + data.songs.items[i].mediumPic,
      singer: data.songs.items[i].singers[0].name,
      cid: data.songs.items[i].copyrightId
    })
  }
  return toplist
}

module.exports = {
  top
}

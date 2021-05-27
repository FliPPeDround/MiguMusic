import Vue from 'vue'
import Vuex from 'vuex'

const cheerio = require('cheerio')
const requestMigu = require('../utils/migu_request')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isGet: false,
    swiperList: [],
    playList: [],
    playlistId: '',
    topPic: [],
    songData: {
      songUrl: '',
      songName: '咪咕音乐',
      singerName: '',
      songPic: require('../assets/unlogin.jpg'),
      cid: ''
    },
    songdataList: [],
    listIndex: 0,
    songUrl: '',
    dialogVisible: false,
    topList: [],
    clickIndex: 0,
    routerPath: '',
    historyPlaylist: [],
    playlistFlag: false,
    myPlaylist: [],
    pushList: []
  },
  mutations: {
    requestMiguV3 (state) {
      requestMigu.requestPromise('https://music.migu.cn/v3').then(res => {
        const $ = cheerio.load(res)
        const listId = []
        const hotbgPic = [
          require('../assets/newsong.png'),
          require('../assets/hotsong.png'),
          require('../assets/original.png')
        ]
        $('#playlist > div:nth-child(2) > div > div.wrapper-items > div > div > div.item-box > span').each((i, item) => {
          listId.push($(item).attr('data-id'))
        })
        $('#playlist > div:nth-child(2) > div > div.wrapper-items > div > div > div.item-box > a > img').each((i, item) => {
          state.playList.push({
            id: listId[i],
            name: $(item).attr('alt'),
            url: 'http:' + $(item).attr('data-src')
          })
        })
        $('#carousel > li > a').each((i, item) => {
          state.swiperList.push({
            picurl: 'http:' + $('#carousel > li:nth-child(' + (i + 1) + ') > a > img').attr('src'),
            url: $(item).attr('href')
          })
        })
        $('#billboard > div.back-wrapper > div > div.wrapper-left > div.swiper-container > ul > li > a > img').each((i, item) => {
          state.topPic.push({
            pic: 'http:' + $(item).attr('data-src'),
            bgpic: hotbgPic[i]
          })
        })
        state.isGet = true
      })
    },

    // requestMiguplayLIst (state) {
    //   requestMigu.requestPromise('https://music.migu.cn/v3/music/playlist').then(res => {
    //     const $ = cheerio.load(res)
    //     const listId = []
    //     $('#playlist > div.song-list-cont.container > ul > li > div > div.music-cover > span').each((i, item) => {
    //       listId.push($(item).attr('data-id'))
    //     })
    //     $('#playlist > div.song-list-cont.container > ul > li > div > div.item-action > i.iconfont.cf-fenxiang-big.J-btn-share').each((i, item) => {
    //       const dataShare = JSON.parse($(item).attr('data-share'))
    //       state.playList.push({
    //         id: listId[i],
    //         name: dataShare.title,
    //         url: dataShare.imgUrl
    //       })
    //     })
    //   })
    // },

    change_songdata (state, newlist) {
      state.songdataList = newlist
      localStorage.setItem('songdataList', JSON.stringify(state.songdataList))
    }

    // 废弃歌单爬虫接口
    // requestMiguplayList (state) {
    //   state.playlistDatas = []
    //   const host = 'https://music.migu.cn/v3/music/playlist/' + state.playlistId + '?origin=1001001'
    //   requestMigu.requestPromise(host).then(res => {
    //     const cids = []
    //     const songnames = []
    //     const albums = []
    //     const $ = cheerio.load(res)
    //     $('#J_PageSonglist > div.songlist-body > div').each((i, item) => {
    //       cids.push($(item).attr('data-cid'))
    //     })
    //     $('#J_PageSonglist > div.songlist-body > div > div.song-name.J_SongName > a.song-name-txt').each((i, item) => {
    //       songnames.push($(item).text())
    //     })
    //     $('#J_PageSonglist > div.songlist-body > div > div.song-belongs > a').each((i, item) => {
    //       albums.push($(item).text())
    //     })
    //     $('#J_PageSonglist > div.songlist-body > div > div.song-singers.J_SongSingers').each((i, item) => {
    //       state.playlistDatas.push({
    //         cid: cids[i],
    //         songname: songnames[i],
    //         album: albums[i],
    //         singer: $(item).text()
    //       })
    //     })
    //   })
    // }
  },
  actions: {
  },
  modules: {
  }
})

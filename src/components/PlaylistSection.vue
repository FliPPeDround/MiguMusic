<template>
  <div class="content">
    <div class="wrapper-items" ref="wrapper">
        <div class="item-contain"
            v-for="(item, index) in this.$store.state.playList"
            :key="index"
            >
            <div
              class="item-box"
              @mouseenter="mouseover(index)" @mouseleave="mouseLeave()">
                <div class="img-box">
                  <img
                      :src="item.url"
                      alt="item.name"
                      class="item-pic"
                      @click="to_playlist(index)"
                      @error="handleError($event, item.url)">
                </div>
                <img class="cf-play" src="../assets/btn-play.png" v-show="hover_index === index" @click="playsongs(index)">
                <div class="item-info" @click="to_playlist(index)">{{ item.name }}</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlaylistSection',
  data () {
    return {
      playList: [],
      dialogVisible: false,
      hover_index: -1,
      quickList: []
    }
  },
  props: {},
  mounted () {
  },
  methods: {
    async to_playlist (index) {
      this.$router.push({
        path: '/Playlist',
        query: {
          header: this.$store.state.playList[index],
          data: await this.get_playlist(index)
        }
      })
    },
    mouseover (index) {
      this.hover_index = index
    },
    mouseLeave () {
      this.hover_index = -1
    },
    handleError (e, url) {
      e.target.src = url.replace('http:', '')
    },
    async playsongs (index) {
      this.$store.commit('change_songdata', await this.get_playlist(index))
      this.$store.state.songData = this.$store.state.songdataList[0]
      this.$store.state.listIndex = 0
      this.$store.state.palylistFlag = true
    },
    async get_playlist (index) {
      const quickList = []
      await this.$axios.get('https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do', {
        params: {
          needSimple: '01',
          resourceId: this.$store.state.playList[index].id,
          resourceType: '2021'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(res => {
        const resdata = res.data.resource[0].songItems
        console.log(resdata)
        for (let i = 0; i < resdata.length; i++) {
          quickList.push({
            songName: resdata[i].songName,
            singerName: resdata[i].singer,
            songUrl: resdata[i].rateFormats[1].url.replace('ftp://218.200.160.122:21', 'http://freetyst.nf.migu.cn'),
            songPic: resdata[i].albumImgs[1].img,
            cid: resdata[i].copyrightId,
            album: resdata[i].album
          })
        }
      })
      return quickList
    }
  }
}
</script>

<style scoped lang="stylus">

.content{
    width: 100%
    height: 100%;
    display: flex;
    align-items: flex-start;
}

.wrapper-items{
    display: flex;
    flex-wrap: wrap;
}

.item-contain{
    width: 15%
    margin-right 2%
    margin-bottom 1%
}

.item-contain:nth-child(6n){
    margin-right 0
}

.item-box{
    position: relative
    cursor: pointer;
}

.img-box {
    border-radius: 8px;
    overflow: hidden
    display flex
    justify-content center
    align-items center
}

.item-pic{
    width: 100%
    height: 100%
    border-radius: 8px;
    transition: all .5s;
}

.item-pic:hover {
  transform: scale(1.1)
}

.item-info{
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    height: 1%;
    color #666666
    font-size 14px
    overflow: hidden;
    text-overflow:ellipsis;
}

.item-info:hover {
    color #E50078
}

.cf-play {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 64px;
  height: 64px;
  text-align: center;
  line-height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin: auto;
  color: #fff;
  cursor: pointer;
  z-index: 3;
  border:0px solid rgba(232, 26, 133, .5);
  transition:border 1s;
}

.cf-play:hover {
    border:20px solid rgba(232, 26, 133, .0);
}

</style>

<template>
  <div class="content">
    <el-carousel
      :interval="4000"
      trigger="click"
      type="card"
      :height="bannerHight+'px'"
      >
      <el-carousel-item
        v-for="(item, index) in this.$store.state.swiperList"
        :key="index">
        <img
          class="swiper-item"
          ref="bannerHight"
          :src="item.picurl"
          @click="playit(item)"
          @error="handleError"
          @load="imgLoad"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
const { shell } = window.require('electron')

export default {
  name: 'Swiper',
  data () {
    return {
      swiperList: [],
      bannerHight: ''
    }
  },
  props: {},
  mounted () {
    this.imgLoad()
    window.addEventListener('resize', () => {
      this.bannerHight = this.$refs.bannerHight[0].height
      this.imgLoad()
    }, false)
  },
  methods: {
    imgLoad () {
      this.$nextTick(() => {
        this.bannerHight = this.$refs.bannerHight[0].height
      })
    },
    playit (item) {
      if (item.url.split('/')[5] === 'song') {
        this.$store.state.listIndex = 0
        this.$store.state.palylistFlag = false
        this.$axios.get('http://iecoxe.top:3500/migu/song/url/', {
          params: {
            id: item.url.split('/')[6]
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          this.$store.state.songData = {
            songUrl: res.data.data.lisQq,
            songName: res.data.data.songName,
            singerName: res.data.data.singerName[0],
            songPic: res.data.data.picM,
            cid: item.url.split('/')[6]
          }
        })
        this.$store.state.songdataList = this.$store.state.historyPlaylist
      } else {
        shell.openExternal(item.url)
      }
    },
    handleError (e) {
      e.target.src = require('../assets/unlode.jpg')
    }
  }
}
</script>

<style scoped lang="stylus">

.swiper-item{
  width: 100%;
  border-radius: 8px;
}

</style>

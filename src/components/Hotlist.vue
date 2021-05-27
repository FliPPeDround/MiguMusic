<template>
  <div class="content">
      <div class="wrapper-left">
        <el-carousel
            :autoplay="false"
            indicator-position='none'
            type="card"
            :height="bannerHight+'px'"
            @change="changOn">
            <el-carousel-item
                v-for="(item, index) in this.$store.state.topPic"
                :key="index">
              <div class="swiper-item" style="position:relative">
                <img class="swiper-item" ref="bannerHight"  :src=item.pic  style="position:absolute" @load="imgLoad">
                <img class="swiper-item" :src=item.bgpic  style="position:absolute" >
              </div>
            </el-carousel-item>
        </el-carousel>
      </div>
      <div class="wrapper-items">
        <div class="item-box"
          v-for="(item, index) in this.$store.state.topList"
          :key="index"
          @click="playit(item)">
          <div class="left-box">
            <div class="list-index">{{ index+1>9 ? index+1 : '0'+(index+1) }}</div>
            <div class="song-pic">
              <img :src="item.pic" alt="">
            </div>
            <div class="song-name">{{ item.name }}</div>
          </div>
          <div class="singer-name">{{ item.singer }}</div>
        </div>
      </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')

export default {
  name: 'Hotlist',
  data () {
    return {
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
    changOn (index) {
      const res = ipcRenderer.sendSync('hotlist', index)
      this.$store.state.topList = res
    },
    playit (item) {
      this.$store.state.palylistFlag = false
      this.$store.state.listIndex = 0
      this.$axios.get('http://iecoxe.top:3500/migu/song/url/', {
        params: {
          id: item.cid
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.$store.state.songData = {
          songUrl: res.data.data.lisQq,
          songName: item.name,
          singerName: item.singer,
          songPic: item.pic,
          cid: item.cid
        }
      })
      this.$store.state.songdataList = this.$store.state.historyPlaylist
    }
  }
}
</script>

<style scoped lang="stylus">

.content
  width 100%
  height 100%
  padding 1% 0
  display flex
  justify-content space-between
  background-color #e8edf1
  align-items center

.wrapper-left {
  width 40%
  margin-left 2.5%
}

.swiper-item{
  width: 100%;
  border-radius: 8px;
}

.list-name {
  display flex
  justify-content center
  color #333
  font-size 18px
  font-weight 700
  padding-top 20px
}

.wrapper-items {
  width 50%
  height 100%
  overflow auto
  margin-right 2.5%
}

.wrapper-items::-webkit-scrollbar{
    width: 8px;
}

.wrapper-items::-webkit-scrollbar-track{
    background: #e8edf1;
}

.wrapper-items::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: #E0E0E0;
}

.item-box {
  display flex
  justify-content space-between
  font-size 14px
  cursor pointer
  border-radius: 10px
  padding-left 5px
  padding-top 2px
}

.item-box:hover {
  background-color #d7dbdf
}

.left-box {
  display flex
  align-items center
}

.song-pic img{
  width 55px
  height 55px
  border-radius: 8px;
  margin-right 10px
}

.list-index {
  padding-right 10px
}

.singer-name {
  display flex
  align-items center
  color #7B7B7B
  padding-right 40px
}
</style>

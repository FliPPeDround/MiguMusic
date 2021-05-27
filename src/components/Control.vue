<template>
  <div class="control">
    <div class="progress"
      @mousedown="change_flag"
      @mouseup="change_flag">
      <el-slider
        v-model="value"
        v-show="this.$store.state.songData.songUrl"
        :show-tooltip="false"
        @change="change_currentTime"
        ></el-slider>
    </div>
    <audio
      :src="this.$store.state.songData.songUrl"
      :loop="loop"
      :autoplay="this.$store.state.songData.songUrl"
      @canplay="get_totalTime"
      @timeupdate="timeUpdate"
      @ended="nextSong"
      @play="playON"
      @error="nextSong"
      ref="audio"></audio>
    <div class="songpic">
      <div class="left-pic">
        <img
        :src='this.$store.state.songData.songPic'
        alt="歌曲图片">
      </div>
      <div class="right-data">
        <p class="songName">{{ this.$store.state.songData.songName }}</p>
        <p class="singerName">{{ this.$store.state.songData.singerName }}</p>
      </div>
    </div>
    <div class="slider-box">
      <div class="audio-methods"  @keyup.space="printSpace">
        <i class="prev el-icon-fontxiayishou-copy-copy" @click="prevSong"></i>
        <i class="play el-icon-fontbofang" @click="isPlay = !isPlay" v-show="!isPlay"></i>
        <i class="play1 el-icon-fontbofang1" @click="isPlay = !isPlay" v-show="isPlay"></i>
        <i class="next el-icon-fontxiayishou-copy-copy" @click="nextSong"></i>
      </div>
    </div>
    <div class="v-list-box">
      <el-tooltip content="单曲循环" placement="top" effect visible-arrow="false">
        <i class="el-icon-refresh" v-show="loop" @click="isloop"></i>
      </el-tooltip>
      <el-tooltip content="列表循环" placement="top" effect visible-arrow="false">
        <i class="el-icon-refresh-right" v-show="!loop" @click="isloop"></i>
      </el-tooltip>
      <div class="volume">
        <el-popover
          placement="left"
          trigger="hover"
          v-model="volume_visible">
          <div class="volume_slider">
            <el-slider
              v-model="volume"
              @change="change_volume"></el-slider>
          </div>
          <el-button type="text" slot="reference" icon="el-icon-bell" circle style="font-size: 18px"></el-button>
        </el-popover>
      </div>
      <div class="play-list">
        <el-popover
          placement="top"
          trigger="click"
          v-model="list_visible">
          <div class="item-box"
            v-for="(item, index) in this.$store.state.songdataList"
            :key="item.cid"
            :class="{ play_active: index === playIndex }"
            @click="playit(item, index)"
            @contextmenu.prevent="onContextmenu($event, item, index)"
            >
            <div class="left-box">
              <div class="list-index">{{ index+1>9 ? index+1 : '0'+(index+1) }}</div>
              <div class="song-name">{{ item.songName }}</div>
            </div>
            <div class="singer-name">{{ item.singerName }}</div>
          </div>
          <el-button slot="reference" icon="el-icon-notebook-2" circle></el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Control',
  data () {
    return {
      isPlay: false,
      value: 0,
      totalTime: '00:00',
      currentTime: '00:00',
      volume: 20,
      volume_visible: false,
      list_visible: false,
      playIndex: '',
      flag: true
    }
  },
  props: {
  },
  created () {
    document.onkeydown = (e) => {
      const key = window.event.keyCode
      if (key === 32) {
        this.isPlay = !this.isPlay
      }
    }
  },
  computed: {
    loop () {
      if (this.$store.state.songdataList.length === 1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    isPlay (val) {
      if (val) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    }
  },
  mounted () {
    if (JSON.parse(localStorage.getItem('volume'))) {
      this.volume = JSON.parse(localStorage.getItem('volume'))
    }
    this.$refs.audio.volume = this.volume / 100
  },
  methods: {
    timeForamt (time) {
      let minute = Math.floor((time % 3600) / 60)
      let second = Math.floor(time % 60)
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return minute + ':' + second
    },
    get_totalTime () {
      this.totalTime = this.timeForamt(this.$refs.audio.duration)
    },
    timeUpdate () {
      this.currentTime = this.timeForamt(this.$refs.audio.currentTime)
      if (this.flag) {
        this.value = this.$refs.audio.currentTime / this.$refs.audio.duration * 100
      }
    },
    prevSong () {
      this.$store.state.listIndex--
      if (this.$store.state.listIndex === -1) {
        this.$store.state.listIndex = this.$store.state.songdataList.length - 1
      }
      this.$store.state.songData = this.$store.state.songdataList[this.$store.state.listIndex]
    },
    nextSong () {
      this.$store.state.listIndex++
      if (this.$store.state.listIndex === this.$store.state.songdataList.length) {
        this.$store.state.listIndex = 0
      }
      this.$store.state.songData = this.$store.state.songdataList[this.$store.state.listIndex]
    },
    change_currentTime () {
      this.$refs.audio.currentTime = this.value * this.$refs.audio.duration / 100
    },
    change_volume () {
      this.$refs.audio.volume = this.volume / 100
      localStorage.setItem('volume', JSON.stringify(this.volume))
    },
    playit (item, index) {
      this.$store.state.listIndex = index
      this.$store.state.songData = item
    },
    playON () {
      this.isPlay = true
      if (this.$store.state.palylistFlag) {
        this.playIndex = this.$store.state.listIndex
        return
      }
      let isrepeat = false
      for (let i = 0; i < this.$store.state.historyPlaylist.length; i++) {
        if (this.$store.state.songData.cid === this.$store.state.historyPlaylist[i].cid) {
          this.playIndex = this.$store.state.listIndex = i
          isrepeat = true
        }
      }
      if (isrepeat) return
      this.playIndex = this.$store.state.listIndex
      this.$store.state.historyPlaylist.unshift(this.$store.state.songData)
      if (this.$store.state.historyPlaylist.length > 100) {
        this.$store.state.historyPlaylist.splice(99, 1)
      }
      localStorage.setItem('historyPlaylist', JSON.stringify(this.$store.state.historyPlaylist))
    },
    isloop () {
      this.loop = !this.loop
    },
    change_flag () {
      this.flag = !this.flag
    },
    onContextmenu (event) {
      const sharelist = this.$store.state.myPlaylist.map((item, index) => {
        return {
          label: item.header.name,
          icon: 'el-icon-fontgedan',
          onClick: () => {
            this.$store.state.myPlaylist[index].data.push(this.songdata)
            localStorage.setItem('myPlaylist', JSON.stringify(this.$store.state.myPlaylist))
            this.$message({
              message: `成功收藏到${item.header.name}`,
              type: 'success'
            })
          }
        }
      })
      const itemsList = [
        {
          label: '播放(Enter)',
          onClick: () => {
            this.play_song(this.songdata)
          },
          icon: 'el-icon-video-play'
        },
        {
          label: '下一首播放',
          divided: true,
          onClick: () => {
            let flag = true
            for (const i in this.$store.state.songdataList) {
              if (this.songdata.cid === this.$store.state.songdataList[i].cid) {
                this.$store.state.listIndex = this.songdata.index - 1
                flag = false
                return
              }
            }
            if (flag) {
              this.$store.state.songdataList.splice(this.$store.state.listIndex + 1, 0, this.songdata)
            }
          },
          icon: 'el-icon-refresh-right'
        },
        {
          label: '添加到...',
          icon: 'el-icon-folder-add',
          minWidth: 0,
          children: [
            {
              label: '创建新歌单',
              icon: 'el-icon-circle-plus-outline',
              divided: true,
              onClick: () => {
                this.$prompt('请输入歌单名称', '创建歌单', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  this.$store.state.myPlaylist.push({
                    header: {
                      name: value,
                      url: require('../assets/unlogin.jpg'),
                      byself: true
                    },
                    data: []
                  })
                  localStorage.setItem('myPlaylist', JSON.stringify(this.$store.state.myPlaylist))
                  this.$message({
                    type: 'success',
                    message: '成功创建：' + value
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消输入'
                  })
                })
              }
            }
          ]
        },
        {
          label: '删除',
          onClick: () => {
            this.$route.query.data.splice(this.songdata.index, 1)
            if (this.$route.query.header.name === '历史播放歌单') {
              this.$store.state.historyPlaylist.splice(this.songdata.index, 1)
              localStorage.setItem('historyPlaylist', JSON.stringify(this.$store.state.historyPlaylist))
            }
          },
          icon: 'el-icon-delete'
        },
        { label: '下载', disabled: true, icon: 'el-icon-download' }
      ]
      for (const item of itemsList) {
        if (item.label === '添加到...') {
          item.children.push(...sharelist)
        }
      }
      this.$contextmenu({
        items: itemsList,
        event,
        customClass: 'class-a',
        zIndex: 10000,
        minWidth: 180
      })
      return false
    }
  }
}
</script>

<style scoped lang="stylus">

.control
  width 100%
  height 100%
  display: flex;
  flex-direction: row
  justify-content space-between
  align-items center

.progress {
  position absolute
  top 0
  width 100%
}

.songpic{
  height 70%
  width 15%
  padding-left 1%
  display: flex;
  overflow: hidden
}

.left-pic {
  height: 100%;
  padding-right 17px
}

.left-pic img{
  height 100%
}

.right-data{
  height: 100%;
  display flex;
  flex-direction column
  justify-content center
}

.songName {
  font-size 15px
  margin 0
  text-overflow: ellipsis;
  white-space: nowrap;
}

.singerName {
  font-size 14px
  margin 0
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slider-box {
  width 55%
  display flex
  justify-content space-around
}

.audio-methods {
    display: flex;
    justify-content:space-between;
    align-items: center;
    font-size 200px
}

.audio-methods i{
    font-size: 15px
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    padding: 15px;
    margin: 19px;
    color: #CCCCCC
}
i:hover {
  color #7BBBFE
}

.prev {
  transform: rotateY(180deg);
}

.el-icon-fontbofang1 {
  border-radius: 121px;
  background: #75B9FF;
  box-shadow: inset 5px 5px 10px #66a1de,
              inset -5px -5px 10px #84d1ff;
}

.el-icon-fontbofang1:before {
  font-size 20px
  color white
}

.el-icon-fontbofang {
    border-radius: 50%;
    background: #F1F6FA;
    box-shadow:  5px 5px 10px #d4d8dc,
                -5px -5px 10px #F5FAFF;
}
.el-icon-fontbofang:before {
  font-size 20px
  color #717172
}

.slider {
  width 90%
  padding 0 20px
}

.volume_slider {
  width 100%
}

.volume {
  height 70%
  width 15%
  padding-right 1%
  display flex
  align-items center
  font-size 20px
}

.v-list-box{
  width 15%
  display flex
  justify-content space-between
  align-items center
  padding-right 1%
}

.item-box {
  display flex
  height 45px
  justify-content space-between
  font-size 14px
  cursor pointer
  border-radius: 8px
  padding-left 5px
  padding-top 2px
}

.item-box:hover {
  background-color #d7dbdf
}

.play_active {
  background-color #d7dbdf
}

.left-box {
  display flex
  align-items center
}

.list-index {
  padding-right 10px
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}

.song-name {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}

.singer-name {
  display flex
  align-items center
  color #7B7B7B
  padding-right 10px
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}

</style>

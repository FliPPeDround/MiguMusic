<template>
  <div id="app">
    <div id="header"><Header/></div>
    <div id="menu"><Menu/></div>
    <div id="router"><router-view/></div>
    <div id="control"><Control/></div>
  </div>
</template>
<script>

import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Control from './components/Control.vue'
const { ipcRenderer } = window.require('electron')

export default {
  name: 'App',
  components: {
    Header,
    Menu,
    Control
  },
  data () {
    return {
      isPlay: false
    }
  },
  watch: {
    $route (to, from) {
      if (from.path === '/Playlist') {
        this.$store.state.pushList = []
      }
    }
  },
  mounted () {
    if (JSON.parse(localStorage.getItem('songdataList'))) {
      this.$store.state.songdataList = JSON.parse(localStorage.getItem('songdataList'))
    }
    if (JSON.parse(localStorage.getItem('historyPlaylist'))) {
      this.$store.state.historyPlaylist = JSON.parse(localStorage.getItem('historyPlaylist'))
    }
    if (JSON.parse(localStorage.getItem('myPlaylist'))) {
      this.$store.state.myPlaylist = JSON.parse(localStorage.getItem('myPlaylist'))
    }
    this.$store.commit('requestMiguV3')
    // this.$store.commit('requestMiguplayLIst')
    const res = ipcRenderer.sendSync('hotlist', '0')
    this.$store.state.topList = res
    ipcRenderer.on('pong-event', (e, data) => {
      this.$store.state.routerPath = data
    })
  },
  methods: {
    splice_list () {
      for (let i = 0; i < this.$store.state.historyPlaylist.length; i++) {
        if (this.$store.state.songData.cid === this.$store.state.historyPlaylist[i].cid) {
          this.$store.state.historyPlaylist.splice(i, 1)
        }
      }
    }
  }
}
</script>
<style lang="stylus">
body
  margin 0
  overflow hidden

#app
  position: relative
  width 100vw
  height 100vh

#header
  position: absolute;
  top: 0px;
  right: 0px;
  height: 8%;
  width: 83%

#menu
  position: absolute
  width 17%
  height 91%
  overflow hidden

#router
  position: absolute;
  top: 8%;
  right: 0px;
  width 83%
  height 83%
  background-color #F1F6FA
  overflow-x hidden
  overflow-y auto

#router::-webkit-scrollbar{
    width: 8px;
}

#router::-webkit-scrollbar-track{
    background: #F1F6FA;
}

#router::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: #E0E0E0;
}

#control
  position absolute
  bottom 0
  width 100%
  height 9%
  background-color #F1F6FA
  border-top: 1px solid #E0E0E0

.el-popover {
  max-height 50%
  max-width 30%
  overflow-x hidden
  overflow-y auto
}

.el-popover::-webkit-scrollbar{
    width: 8px;
}

.el-popover::-webkit-scrollbar-track{
    background: #FFFFFF;
}

.el-popover::-webkit-scrollbar-thumb{
    border-radius: 4px;
    background: #d7dbdf;
}

.el-slider__button {
  width 6px
  height 6px
  border 4px solid #F1F6FA
  background-color #409EFF
  border-radius: 150px;
  box-shadow: 2px 2px 4px #b0b4b7,
            -2px -2px 4px #ffffff;
}

.progress .el-slider__runway {
  margin 0
  background-color #f1f6fa
}

.progress .el-slider__bar {
  height 3px
}

.el-timeline {
  width 30%
}

</style>

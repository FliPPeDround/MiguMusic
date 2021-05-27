<template>
  <div class="content">
    <div class="background-blur">
      <img
        :src="singerdata.artistPicM"
        style="width:100%; filter:blur(2rem);">
    </div>
    <div class="container">
      <div class="left-img">
        <img
          :src="singerdata.artistPicM"
          style="width:50%; border-radius: 50%">
      </div>
      <div class="right-data">
        <h1>{{ singerdata.title }}</h1>
        <div><p><span class="title">专辑 </span><span class="Wdata">{{ singerdata.albumNum }}  </span><span class="title">歌曲 </span><span class="Wdata">{{ singerdata.songNum }}</span></p></div>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')

export default {
  name: 'Searchheader',
  data () {
    return {
      singerdata: ''
    }
  },
  props: {},
  mounted () {
    ipcRenderer.on('singerdata', (e, data) => {
      this.singerdata = data.artists[0]
    })
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus">

.content {
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
}

.background-blur{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  opacity: .3;
}

.container {
  width 100%
  height 100%
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-img {
  display flex
  justify-content flex-end
  flex: 3;
}

.right-data{
  flex:7
  margin-left 2%
  z-index 10
}

.right-data:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 10px;
  background: linear-gradient(to bottom,#F1F6FA,rgba(255,255,255,0));
}

.right-data:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    background: linear-gradient(to bottom,rgba(255,255,255,0),#F1F6FA);
}

.play_list {
  color #fff
  background-color: #E50078;
  border-color: #E50078;
}

h{
  font-size 20px
}

span {
  font-size 14px
}

.Wdata {
  color: #E91E63;
}

</style>

<template>
  <div class="content">
    <div class="wrapper-items" ref="wrapper">
        <div class="item-contain"
            v-for="(item, index) in this.$store.state.myPlaylist"
            :key="index"
            >
            <div
              class="item-box"
              @mouseenter="mouseover(index)" @mouseleave="mouseLeave()">
                <img
                    :src="item.header.url"
                    alt="item.name"
                    class="item-pic"
                    @click="to_playlist(index)">
                <img class="cf-play" src="../assets/btn-play.png" v-show="hover_index === index" @click="printclick(index)">
                <div class="delete-box">
                  <img class="cf-delete" src="../assets/delete.png" v-show="hover_index === index" @click="deleteclick(index)">
                </div>
                <div class="item-info" @click="to_playlist(index)">{{ item.header.name }}</div>
            </div>
        </div>
        <div class="item-contain">
          <div class="item-box" @click="set_playlist">
            <img class="item-pic bgcolor" src="../assets/add.png">
            <div class="item-info">创建歌单</div>
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
      hover_index: -1
    }
  },
  props: {},
  mounted () {
    for (const item of this.$store.state.myPlaylist) {
      if (item.header.byself && item.data.length !== 0) {
        item.header.url = item.data[0].songPic
      }
    }
  },
  methods: {
    to_playlist (index) {
      this.$router.push({
        path: '/Playlist',
        query: {
          header: this.$store.state.myPlaylist[index].header,
          data: this.$store.state.myPlaylist[index].data
        }
      })
    },
    mouseover (index) {
      this.hover_index = index
    },
    mouseLeave () {
      this.hover_index = -1
    },
    printclick (index) {
      this.$store.commit('change_songdata', this.$store.state.myPlaylist[index].data)
      this.$store.state.songData = this.$store.state.songdataList[0]
      this.$store.state.listIndex = 0
      this.$store.state.palylistFlag = true
    },
    deleteclick (index) {
      this.$store.state.myPlaylist.splice(index, 1)
      localStorage.setItem('myPlaylist', JSON.stringify(this.$store.state.myPlaylist))
    },
    set_playlist () {
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
    width: 100%;
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
    width: 100%
    cursor: pointer;
}

.item-pic{
    width: 100%
    border-radius: 8px;
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
}

.cf-play:hover {
    background-image: linear-gradient(deeppink, deeppink);
    background-blend-mode: lighten;
    background-size: cover;
}

.delete-box {
  display flex
  flex-direction row-reverse
  position: absolute;
  width 100%
  border-radius: 8px 8px 0 0;
  top: 0;
  overflow: hidden;
  background-color rgba(0, 0, 0, .5)
  z-index: 3;
  cursor: pointer;
}

.cf-delete {
  width 12%
  margin 2px
}

.bgcolor {
  border:2px dashed #717172
}

</style>

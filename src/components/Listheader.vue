<template>
  <div class="content">
    <div class="background-blur">
      <img
        :src="this.$route.query.header.url"
        style="width:100%; filter:blur(2rem);">
    </div>
    <div class="container">
      <div class="left-img">
        <img
          :src="this.$route.query.header.url"
          style="width:60%">
      </div>
      <div class="right-data">
        <h1>{{ this.$route.query.header.name }}</h1>
        <div class="actions">
          <el-button round icon="el-icon-caret-right" class="play_list" @click="play_all">全部播放</el-button>
          <el-button round icon="el-icon-star-off" :plain="true" @click="collection">收藏</el-button>
          <el-popover
            placement="bottom"
            width="300"
            trigger="manual"
            v-model="visible">
              <div class="set_box" @click="set_playlist">
                <i class="el-icon-circle-plus-outline"></i><span>创建歌单</span>
              </div>
              <el-table :data="this.$store.state.myPlaylist"
                @cell-click="push_it">
                <el-table-column width="300" property="header.name" label="歌单名称"></el-table-column>
              </el-table>
            <el-button round icon="el-icon-folder-add" slot="reference" @click="open">添加到</el-button>
          </el-popover>
          <el-button round >···更多</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Listheader',
  data () {
    return {
      visible: false
    }
  },
  props: {},
  mounted () {
  },
  methods: {
    play_all () {
      this.$store.state.songdataList = this.$route.query.data
      localStorage.setItem('songdataList', JSON.stringify(this.$store.state.songdataList))
      this.$store.state.songData = this.$store.state.songdataList[0]
      this.$store.state.listIndex = 0
      this.$store.state.palylistFlag = true
    },
    collection () {
      this.$store.state.myPlaylist.push({
        header: this.$route.query.header,
        data: this.$route.query.data
      })
      localStorage.setItem('myPlaylist', JSON.stringify(this.$store.state.myPlaylist))
      this.$message({
        message: '成功收藏到我的歌单',
        type: 'success'
      })
    },
    push_it (row) {
      row.data.push(...this.$store.state.pushList)
      localStorage.setItem('myPlaylist', JSON.stringify(this.$store.state.myPlaylist))
      this.$message({
        message: `成功收藏到${row.header.name}`,
        type: 'success'
      })
    },
    open () {
      this.visible = !this.visible
      if (this.$store.state.pushList.length !== 0) return
      this.visible = false
      this.$alert('请先选择需要添加的歌曲', '提示', {
        confirmButtonText: '确定'
      })
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

.el-popover {
  margin 0 10px
}

.set_box {
  display flex
  flex-direction row
  align-items center
  height 40px
}
</style>

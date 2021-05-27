<template>
  <div class="content" @contextmenu.prevent="onContextmenu">
    <el-table
      :data="songList"
      style="width: 100%, background: #F1F6FA"
      :header-cell-style="{
        'background-color': '#F1F6FA',
        'color': '#999',
        'font-size': '12px'
          }"
      :row-style="{
        'background-color': '#F1F6FA',
        'color': '#333',
        'font-size': '14px',
        'cursor': 'pointer'
        }"
      @cell-click="play_it"
      @row-contextmenu="more_data">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="songName"
        label="歌曲">
      </el-table-column>
      <el-table-column
        prop="singerName"
        label="歌手">
      </el-table-column>
      <el-table-column
        prop="albumName"
        label="专辑">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')

export default {
  name: 'Searchdata',
  data () {
    return {
      songList: [],
      songdata: ''
    }
  },
  props: {},
  mounted () {
    ipcRenderer.on('songsdata', (e, data) => {
      this.songList = data.musics
    })
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
    },
    play_song (song) {
      this.$store.state.listIndex = 0
      this.$store.state.palylistFlag = false
      this.$store.state.songData = {
        songUrl: song.mp3,
        songName: song.songName,
        singerName: song.singerName,
        songPic: song.cover,
        cid: song.copyrightId
      }
      this.$store.state.songdataList = this.$store.state.historyPlaylist
    },
    play_it (row, column) {
      if (column.property === 'songName') {
        this.play_song(row)
      } else if (column.property === 'singerName') {
        ipcRenderer.send('searchmusic', row.singerName)
      }
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
    },
    more_data (row) {
      this.songdata = {
        songUrl: row.mp3,
        songName: row.songName,
        singerName: row.singerName,
        songPic: row.cover,
        cid: row.copyrightId
      }
    }
  }
}
</script>

<style scoped lang="stylus">

.el-checkbox__inner:hover {
  border: 1px solid #E50078;
}

.el-table:hover {
  color #E50078
}
</style>

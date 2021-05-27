<template>
  <div class="content" @contextmenu.prevent="onContextmenu">
    <el-table
      ref="multipleTable"
      :data="this.$route.query.data"
      :row-class-name="tableRowClassName"
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
      @select="new_arry"
      @select-all="all_arry"
      @row-contextmenu="more_data"
      >
      <el-table-column
        type="selection"
        width="50">
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
        prop="album"
        label="专辑">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')

export default {
  name: 'Listdata',
  data () {
    return {
      playlistDatas: [],
      songdata: [],
      flag: false
    }
  },
  props: {},
  mounted () {
    console.log(this.$route.query.data)
  },
  computed: {
    shareList () {
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
      return sharelist
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
    },
    play_it (row, column) {
      if (column.property === 'songName') {
        this.play_song(row)
      }
      if (column.property === 'singerName') {
        ipcRenderer.send('searchmusic', row.singerName)
        this.$router.push({
          path: '/Searchlist',
          query: {}
        })
      }
    },
    new_arry (selection) {
      this.$store.state.pushList = selection
      this.$message('选中后可添加至歌单')
    },
    all_arry (selection) {
      this.$store.state.pushList = selection
      this.$message('选中后可添加至歌单')
    },
    more_data (row) {
      this.songdata = row
    },
    onContextmenu (event) {
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
          item.children.push(...this.shareList)
        }
      }
      this.$contextmenu({
        items: itemsList,
        event,
        customClass: 'class-a',
        zIndex: 3,
        minWidth: 180
      })
      return false
    },
    play_song (song) {
      this.$store.state.palylistFlag = true
      this.$store.state.songData = song
      this.$store.commit('change_songdata', this.$route.query.data)
      for (const i in this.$store.state.songdataList) {
        if (this.$store.state.songData.cid === this.$store.state.songdataList[i].cid) {
          this.$store.state.listIndex = Number(i)
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus">

.el-checkbox__inner:hover {
  border: 1px solid #E50078;
}

</style>

<template>
    <div class="content">
      <el-dialog
          title="是否导入到我的歌单"
          :visible.sync="centerDialogVisible"
          width="30%"
          center
          v-if="centerDialogVisible">
          <div class="item-box">
            <img
                :src="shareList[0].header.url"
                class="item-pic">
            <div>
              <p>共{{shareList[0].data.length}}首音乐</p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="push_it">确 定</el-button>
          </span>
        </el-dialog>
      <div class="share-input">
        <h2 class="title">从咪咕手机端导入歌单</h2>
        <el-input placeholder="请输入链接" v-model="listHerf" style="width: 900px">
          <el-button slot="append" icon="el-icon-folder-add" size="large" @click="get_listHerf">导入</el-button>
        </el-input>
      </div>
      <el-collapse class="help-box" style="border: 1px solid #EBEEF5">
        <el-collapse-item>
          <template slot="title">
            <p>如何从手机导入歌单</p><i class="el-icon-question"></i>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in activities"
              :key="index"
              :timestamp="item.timestamp"
              icon="el-icon-bottom-right"
              placement="top"
              type="primary">
                <el-card>
                  <h4>{{item.title}}</h4>
                  <el-image
                    :src="item.src"
                    :preview-src-list="srcList">
                  </el-image>
                </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>
<script>
const requestMigu = require('../utils/migu_request')

export default {
  name: 'Sharelist',
  components: {
  },
  data () {
    return {
      activities: [{
        timestamp: '第一步',
        title: '点击需要导入的歌单',
        src: require('../assets/help1.png')
      }, {
        timestamp: '第二步',
        title: '点击分享，再选择复制链接',
        src: require('../assets/help2.png')
      }, {
        timestamp: '第三步',
        title: '将获取到的链接输入上方输入框内',
        src: require('../assets/help3.png')
      }],
      listHerf: '',
      srcList: [
        require('../assets/help1.png'),
        require('../assets/help2.png'),
        require('../assets/help3.png')
      ],
      centerDialogVisible: false,
      shareList: []
    }
  },
  mounted () {
  },
  methods: {
    get_listHerf () {
      requestMigu.requestListherf(this.listHerf).then(async res => {
        console.log(res)
        this.shareList = await this.get_playlist(res.trim().slice(39, 48))
        this.centerDialogVisible = true
      })
    },

    push_it () {
      this.$store.state.myPlaylist.push(this.shareList[0])
      localStorage.setItem('myPlaylist', JSON.stringify(this.$store.state.myPlaylist))
      this.centerDialogVisible = false
      this.$message({
        message: '成功收藏到我的歌单',
        type: 'success'
      })
    },

    async get_playlist (id) {
      const quickList = []
      // eslint-disable-next-line camelcase
      const quickList_data = []
      await this.$axios.get('https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do', {
        params: {
          needSimple: '01',
          resourceId: id,
          resourceType: '2021'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(res => {
        const listTitle = res.data.resource[0].title
        const listUrl = res.data.resource[0].songItems[0].albumImgs[1].img
        const resdata = res.data.resource[0].songItems
        for (const i in resdata) {
          quickList_data.push({
            songName: resdata[i].songName,
            singerName: resdata[i].singer,
            songUrl: resdata[i].rateFormats[1].url.replace('ftp://218.200.160.122:21', 'http://freetyst.nf.migu.cn'),
            songPic: resdata[i].albumImgs[1].img,
            cid: resdata[i].copyrightId,
            album: resdata[i].album
          })
        }
        quickList.push({
          header: {
            name: listTitle,
            url: listUrl
          },
          data: quickList_data
        })
      })
      return quickList
    }
  }
}
</script>
<style lang="stylus" scoped>

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

img{
  width 100%
}

h4, h2 {
  margin-top 0
}

p {
  margin-left 30px
}

.share-input {
  margin-top 3%
  width 95%
}

.help-box {
  margin-top 2%
  width 95%
}

.item-box {
  display flex
}

.item-pic {
  width 100px
  border-radius: 8px;
}
</style>

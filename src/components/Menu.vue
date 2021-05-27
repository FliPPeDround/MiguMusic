<template>
  <div class="content">
    <div class="user-drawer">
      <div class="logo">
        <img
          style="width: 118px; height: 45px"
          alt="migu_logo"
          src="../assets/logo.png"
          object-fit="contain"
        />
      </div>
      <div class="nav-menu">
          <p v-show=false >{{clickIndex = this.$store.state.clickIndex}}</p>
          <div class="menu-name"
            v-for="(item, index) in my_musiclist" :key="index"
            @click="clicked(index)"
            :class="{mclick:clickIndex===index}">
            <i :class="item.icon"></i><span class="text-box" :class="{tclick:clickIndex===index}">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      my_musiclist: [{
        icon: 'el-icon-fontweizhi',
        name: '在线音乐'
      },
      {
        icon: 'el-icon-fontdiannao',
        name: '我的歌单'
      },
      {
        icon: 'el-icon-fontlishi',
        name: '播放历史'
      },
      {
        icon: 'el-icon-fontgedan',
        name: '导入歌单'
      }],
      clickIndex: 0
    }
  },
  mounted () {
  },
  computed: {
    historypic () {
      if (this.$store.state.historyPlaylist.length === 0) {
        return require('../assets/unlogin.jpg')
      } else {
        return this.$store.state.historyPlaylist[0].songPic
      }
    }
  },
  props: {},
  methods: {
    clicked (index) {
      this.clickIndex = index
      switch (index) {
        case 0:
          if (this.$route.path === '/') return
          this.$router.push({
            path: '/',
            query: {}
          })
          break
        case 1:
          if (this.$route.path === '/Mylist') return
          this.$router.push({
            path: 'Mylist',
            query: {}
          })
          break
        case 2:
          this.$router.push({
            path: '/Playlist',
            query: {
              header: {
                name: '历史播放歌单',
                url: this.historypic
              },
              data: this.$store.state.historyPlaylist
            }
          })
          this.$store.state.clickIndex = 2
          break
        case 3:
          if (this.$route.path === '/Sharelist') return
          this.$router.push({
            path: '/Sharelist',
            query: {}
          })
          this.$store.state.clickIndex = 3
          break
        // case 4:
        //   if (this.$route.path === '/Login') return
        //   this.$router.push({
        //     path: '/Login',
        //     query: {}
        //   })
        //   this.$store.state.clickIndex = 4
        //   break
      }
    }
  }
}
</script>

<style scoped lang="stylus">

.content{
  width: 100%;
  height: 100%;
  background-color: #EDEDED;
}

.user-drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction column
  align-items center
}

.nav-menu {
  display flex
  flex-direction column
  margin-top 10px
  width 90%
  height 50%
}

.logo {
  margin-top: 8%;
  margin-left 10%
  width: 118px;
  height: 45px;
}

.menu-name {
  display flex
  align-items center
  justify-content center
  width 100%
  height 100%
  margin-top 4px
  border-radius 10px
  transition box-shadow .2s ease-out
  cursor pointer
}

.text-box{
  // width 0
  padding 10px
  font-size: 18px
  user-select: none
  transition font-size .2s ease-out
}

.menu-name:hover {
    box-shadow 15px 15px 27px rgba(0,0,0,.1),
            -15px -15px 27px rgba(255,255,255,1)
}

.menu-name:hover .text-box{
  font-size: 20px
  transition font-size .2s ease-out
}

.menu-name:active {
  box-shadow 15px 15px 27px rgba(0,0,0,.1),
            -15px -15px 27px rgba(255,255,255,1)
  box-shadow 0px 0px 0px rgba(0,0,0,.1),
             0px 0px 0px rgba(255,255,255,1),
  inset 15px 15px 27px rgba(0,0,0,.1),
  inset -15px -15px 27px rgba(255,255,255,1)
}

.menu-name:active .text-box{
  font-size: 18px
  transition font-size .2s ease-out
}

.menu-name-click {
  box-shadow 15px 15px 27px rgba(0,0,0,.1),
            -15px -15px 27px rgba(255,255,255,1)
  box-shadow 0px 0px 0px rgba(0,0,0,.1),
             0px 0px 0px rgba(255,255,255,1),
  inset 15px 15px 27px rgba(0,0,0,.1),
  inset -15px -15px 27px rgba(255,255,255,1)
}

.mclick {
  box-shadow 15px 15px 27px rgba(0,0,0,.1),
            -15px -15px 27px rgba(255,255,255,1)
}

.tclick{
  font-size: 20px
  transition font-size .2s ease-out
}
</style>

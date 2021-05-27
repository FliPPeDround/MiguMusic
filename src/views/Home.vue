<template>
    <div class="home" v-show="this.$store.state.isGet">
      <div class="swiper-content"><Swiper/></div>
      <div class="section-header">
        <h2 class="title">歌单推荐</h2>
      </div>
      <div class="playlistSection-content"><PlaylistSection/></div>
      <div class="section-header">
        <h2 class="title">排行榜</h2>
      </div>
      <div class="Hotlist-content"><hotlist/></div>
    </div>
</template>
<script>

import PlaylistSection from '../components/PlaylistSection.vue'
import Swiper from '../components/Swiper.vue'
import Hotlist from '../components/Hotlist.vue'

export default {
  name: 'Home',
  components: {
    Swiper,
    PlaylistSection,
    Hotlist
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$store.state.clickIndex = 0
  },
  methods: {
  }
}
</script>
<style lang="stylus" scoped>
.home
  width 100%
  height 100%
  display flex
  flex-direction column
  align-items center

.swiper-content
  margin-top 3%
  width 95%

.section-header{
  width 95%
  height 7%
  display flex
  justify-content: flex-start
  align-items: center
}

.title{
  color: #333;
  font-size: 24px;
  margin-right: 60px;
  float: left;
}

.playlistSection-content
  width 95%

.Hotlist-content {
  width 100%
  height 50%
}

</style>

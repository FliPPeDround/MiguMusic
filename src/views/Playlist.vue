<template>
  <div class="playlist">
    <div class="Listheader-content"><Listheader/></div>
    <div class="Listdata-content"><Listdata/></div>
  </div>
</template>
<script>
import Listheader from '../components/Listheader'
import Listdata from '../components/Listdata'

export default {
  name: 'Playlist',
  components: {
    Listheader,
    Listdata
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$store.state.route_from = ''
    // this.$store.state.clickIndex = 0
  },
  methods: {
  },
  destroyed () {
  }
}
</script>

<style lang="stylus" scoped>

.playlist {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Listheader-content {
  width: 100%;
  height: 35%;
}

.Listdata-content {
  height: 65%;
  width 95%
}
</style>

<template>
  <div class="playlist">
    <div class="Listheader-content"><Searchheader/></div>
    <div class="Listdata-content"><Searchdata/></div>
  </div>
</template>
<script>

import Searchheader from '../components/Searchheader'
import Searchdata from '../components/Searchdata'

export default {
  name: 'Playlist',
  components: {
    Searchheader,
    Searchdata
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

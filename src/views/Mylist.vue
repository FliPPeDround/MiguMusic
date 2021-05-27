<template>
    <div class="content">
        <div class="MyplayList-content"><MyplayList/></div>
    </div>
</template>
<script>
import MyplayList from '../components/MyplayList.vue'

export default {
  name: 'Mylist',
  components: {
    MyplayList
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$store.state.clickIndex = 1
  },
  methods: {
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

.MyplayList-content {
  margin-top 3%
  width 95%
}
</style>

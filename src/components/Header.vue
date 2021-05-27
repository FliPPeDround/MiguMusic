<template>
  <header class="header">
    <div class="content-header">
      <div class="search-box">
        <i class="el-icon-arrow-left" @click="to_home"></i>
        <el-autocomplete
          :fetch-suggestions="querySearchAsync"
          placeholder="搜索歌曲、歌手"
          @select="handleSelect"
          prefix-icon="el-icon-search"
          v-model="state"
          value-key="name"
          :trigger-on-focus="false"
          @input="suggestSearch"
          @keyup.enter.native="to_sreachList"
        >
        </el-autocomplete>
      </div>
      <div class="frame">
        <i class="el-icon-minus minus-button" @click="minimize"></i>
        <i class="el-icon-close" @click="close"></i>
      </div>
    </div>
  </header>
</template>

<script>
const { ipcRenderer } = window.require('electron')

export default {
  name: 'Header',
  data () {
    return {
      search_data: [],
      state: '',
      timeout: null
    }
  },
  props: {
  },
  mounted () {
  },
  methods: {
    querySearchAsync (queryString, cb) {
      var restaurants = this.search_data
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      cb(results)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect () {
      this.to_sreachList()
    },
    suggestSearch () {
      if (this.state === '') return
      const res = ipcRenderer.sendSync('suggestSearch', this.state)
      this.search_data = res
    },
    to_sreachList () {
      if (this.state === '') return
      ipcRenderer.send('searchmusic', this.state.trim())
      if (this.$route.path === '/Searchlist') return
      this.$router.push({
        path: '/Searchlist',
        query: {}
      })
    },
    to_home () {
      this.state = ''
      if (this.$route.path === '/') return
      this.$router.push({
        path: '/',
        query: {}
      })
    },
    minimize () {
      ipcRenderer.send('minimize')
    },
    close () {
      ipcRenderer.send('close')
    }
  }
}
</script>

<style lang="stylus">
.header {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  -webkit-app-region: drag;
  background-color: #F1F6FA;
}

.content-header {
  width: 95%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.search-box {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: x-large;
  -webkit-app-region: no-drag;
}

.search-box i {
  color: #A1A1A1;
  padding-right: 2%;
}

.frame {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: x-large;
  padding-right: 1%;
  -webkit-app-region: no-drag;
}

.frame i {
  color: #999999;
  padding-right: 22%;
}

i {
  cursor: pointer;
}

.header i:hover {
  color: #E50078;
}

.popper__arrow::after {
  display: none;
}
</style>

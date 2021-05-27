<template>
  <div class="content">
    <iframe
      ref="login_iframe"
      class="Login-html"
      v-show="isshow"
      src="https://passport.migu.cn/login?sourceid=220001&apptype=0&forceAuthn=false&isPassive=false&authType=MiguPassport&passwordControl=0&display=web&referer=https://music.migu.cn/&logintype=1&qq=null&weibo=null&alipay=null&weixin=null&andPass=null&phoneNumber=&callbackURL=https%3A%2F%2Fmusic.migu.cn%2Fv3&relayState="
    >
    </iframe>
    <button @click="get_iframe">get_it</button>
  </div>
</template>
<script>
// const { ipcRenderer } = window.require('electron')

export default {
  name: 'Login',
  components: {
  },
  data () {
    return {
      isshow: true
    }
  },
  mounted () {
    // ipcRenderer.send('ping-event', this.$route.path)
  },
  methods: {
    get_iframe () {
      const timer = setInterval(() => {
        this.fun(timer)
      }, 5000)
    },

    fun (timer) {
      setTimeout(() => {
        const theIframe = this.$refs.login_iframe
        console.log(theIframe)
        console.log(theIframe.document.cookie)
        // clearInterval(timer)
      }, 0)
    }
  }
}

</script>

<style lang="stylus" scoped>

.content {
  width 100%
  height 100%
}

.login-html {
  width 500px
  height 500px
}
</style>

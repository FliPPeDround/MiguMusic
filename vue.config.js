module.exports = {
  // 第三方插件配置
  pluginOptions: {
    // vue-cli-plugin-electron-builder 配置
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        // 设置打包之后的应用名称
        productName: 'MiguuMusic',
        win: {
          icon: 'resources/ico/ic_launcher.ico',
          // 图标路径 windows系统中icon需要256*256的ico格式图片，更换应用图标亦在此处
          target: [{
            // 打包成一个独立的 exe 安装程序
            target: 'nsis',
            // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大
            arch: [
              'x64'
              // 'ia32'
            ]
          }]
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        linux: {
          // 设置linux的图标
          icon: 'resources/ico/ic_launcher.ico',
          target: 'AppImage'
        },
        mac: {
          icon: 'resources/ico/ic_launcher.ico'
        },
        files: ['**/*'],
        extraResources: {
          // 拷贝dll等静态文件到指定位置,否则打包之后回出现找不大dll的问题
          from: 'resources/',
          to: './'
        },
        asar: false,
        nsis: {
          // 是否一键安装，建议为 false，可以让用户点击下一步、下一步、下一步的形式安装程序，如果为true，当用户双击构建好的程序，自动安装程序并打开，即：一键安装（one-click installer）
          oneClick: false,
          // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowElevation: true,
          // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
          allowToChangeInstallationDirectory: true,
          // 安装图标
          installerIcon: 'resources/ico/ic_launcher.ico',
          // 卸载图标
          uninstallerIcon: 'resources/ico/ic_launcher.ico',
          // 安装时头部图标
          installerHeaderIcon: 'resources/ico/ic_launcher.ico',
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true
        }
      },
      chainWebpackMainProcess: config => {
        config.plugin('define').tap(args => {
          args[0].IS_ELECTRON = true
          return args
        })
      },
      chainWebpackRendererProcess: config => {
        config.plugin('define').tap(args => {
          args[0].IS_ELECTRON = true
          return args
        })
      }
    }
  }
}

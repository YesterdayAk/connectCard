// components/kingTiger/kingTiger.js
const app = getApp()
import get from "../../utils/request/get";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    focaUserGrantId: {
      type: Number,
      value: 0
    },
    userInfo: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据 
   */
  data: {
    bgImgPath: "https://res1.qdszgh.cn/%E9%87%91%E7%A7%8B%E6%AD%A3%E5%BD%93%E6%97%B6/labour.png", // 大背景图
    pixelRatio: 2,
    programCode: '/images/code.png', // 小程序码
    num: 0, // 第几位合成全家福卡的人
    spinning: false,
    loadingFlag: false // 是否重新加载图片
  },
  // 组件实例刚刚被创建
  created() {},
  // 在组件完全初始化完毕、进入页面节点树后
  attached() {},
  ready() {
    this.getMyUserInfo();
    this.getGlodenTigerDetail();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取本人是第几位合成全家福卡的人
    getGlodenTigerDetail() {
      get({
        url: app.globalData.baseWebUrl + '/api/foca/getGlodenTigerDetail',
        data: {
          focaUserGrantId: this.data.focaUserGrantId
        }
      }).then((res) => {
        if (res.data.code == 200) {
          this.setData({
            num: res.data.data.synthesisRanking
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(() => {
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 获取用户信息
    getMyUserInfo() {
      let that = this;
      let userInfo = this.data.userInfo;
      if (userInfo.avatar) {
        // 将个人头像下载至本地（canvas不支持在线地址）
        Promise.all([
          that.downFile(userInfo.avatar)
        ]).then((results) => {
          userInfo.avatar = results[0].tempFilePath
        }).catch((res) => {
          wx.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          })
        })
      } else {
        userInfo.avatar = "/images/headImg.png";
      }
      this.setData({
        userInfo: userInfo
      });
      wx.nextTick(() => {
        if (!this.data.loadingFlag) {
          this.initData()
        }
      })
    },
    // 绘制将要下载的图片
    writeCanvas() {
      let that = this
      const ctx = wx.createCanvasContext('myCanvas', that)
      let canvasW = that.data.canvasW
      let canvasH = that.data.canvasH
      let bgImgPath = that.data.bgImgPath
      let nickName = that.data.userInfo.nickName.length > 6 ? that.data.userInfo.nickName.substr(0, 6) + '...' : that.data.userInfo.nickName // 昵称
      let userHeadUrl = this.data.userInfo.avatar // 头像
      let num = this.data.num ? this.data.num : 0;
      let programCode = that.data.programCode // 小程序码

      // 画大背景 单位是 px 不是 rpx
      ctx.drawImage(bgImgPath, 0, 0, canvasW, canvasH)

      // 保存上下文
      ctx.save()

      // 画圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
      ctx.beginPath()
      ctx.arc(that.computedPercent(29), that.computedPercent(370), that.computedPercent(17), 0, Math.PI * 2, false)
      ctx.setFillStyle('#eee')
      ctx.fill()
      // 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，
      // 则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
      ctx.clip()
      ctx.drawImage(
        userHeadUrl,
        that.computedPercent(12),
        that.computedPercent(353),
        that.computedPercent(34),
        that.computedPercent(34)
      )
      // 恢复画布
      ctx.restore()

      // 写昵称 文本居中的起点是指居中的那个点
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(17))
      ctx.setFillStyle('#232DDE')
      ctx.fillText("我是" + nickName, that.computedPercent(53), that.computedPercent(375))

      // 说明文字
      ctx.setTextAlign('left')
      ctx.setFontSize(that.computedPercent(10))
      ctx.setFillStyle('#232DDE')
      let str = '我是第' + num + '位获得在知爱建 富强滨州卡的人，你也快来试试吧！';
      let initX = that.computedPercent(12);
      let initY = that.computedPercent(398);
      let lineHeight = 14;
      let lineWidth = 0;
      let lastSubStrIndex = 0;
      for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width
        if (lineWidth > 200 - initX) {
          ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
          initY += lineHeight;
          lineWidth = 0;
          lastSubStrIndex = i;
        }
        if (i == str.length - 1) {
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY)
        }
      }
      // ctx.fillText('我是第' + num + '位获得劳动光荣卡的人，你也快来试试吧！', that.computedPercent(12), that.computedPercent(400))

      // 画小程序码
      ctx.drawImage(programCode, that.computedPercent(217), that.computedPercent(349), that.computedPercent(63), that.computedPercent(63))

      ctx.draw(true, () => {
        that.setData({
          spinning: false
        })
      })
    },
    // 初始化数据
    initData() {
      let that = this
      that.setData({
        spinning: true
      })
      // 获取设备宽度，计算canvas宽高
      wx.getSystemInfo({
        success: function (res) {
          let canvasW = Math.round(res.screenWidth * 0.84)
          let canvasH = res.screenWidth * 1.212
          that.setData({
            pixelRatio: res.pixelRatio, // 图片像素比
            canvasW,
            canvasH
          })
          // 将大背景图下载至本地（canvas不支持在线地址）
          Promise.all([
            that.downFile(that.data.bgImgPath)
          ]).then((results) => {
            that.setData({
              bgImgPath: results[0].tempFilePath
            })
            that.writeCanvas() // 暂时在此执行
          }).catch((res) => {
            wx.showToast({
              title: '网络异常，请稍后再试',
              icon: 'none'
            })
          })
        }
      })
    },
    // 下载文件
    downFile(url) {
      let timeStamp = new Date().getTime()
      return new Promise((resolve, reject) => {
        wx.downloadFile({
          url: url + '?t=' + timeStamp,
          success(res) {
            // console.log(res)
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              resolve(res)
            }
          },
          fail(res) {
            reject(res)
          }
        })
      })
    },
    // 保存图片
    save() {
      let that = this
      wx.canvasToTempFilePath({
        x: 0, // 起点横坐标
        y: 0, // 起点纵坐标
        width: that.data.canvasW, // canvas 当前的宽
        height: that.data.canvasH, // canvas 当前的高
        destWidth: that.data.canvasW * that.data.pixelRatio, // canvas 当前的宽 * 设备像素比
        destHeight: that.data.canvasH * that.data.pixelRatio, // canvas 当前的高 * 设备像素比
        canvasId: 'myCanvas',
        success: function (res) {
          // 调取小程序当中获取图片
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '图片保存成功！',
                icon: 'none'
              })
            },
            fail: function (res) {
              // console.log(res)
              if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                // console.log("打开设置窗口");
                that.doAuth()
              }
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      }, this)
    },
    // 获取授权
    doAuth() {
      wx.showModal({
        title: '获取授权',
        content: '您是否同意重新授权保存图片',
        cancelText: '不同意',
        confirmText: '好',
        confirmColor: '#21c0ae',
        success: function (res) {
          if (res.confirm) { // 点击确认
            wx.openSetting({
              success(settingdata) {
                // console.log(settingdata)
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  // console.log("获取权限成功，再次点击保存图片保存到相册")
                  wx.showToast({
                    title: "获取权限成功，再次点击保存图片保存到相册",
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  // console.log("获取权限失败")
                  wx.showToast({
                    title: "获取权限失败",
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        }
      })
    },
    /**
     * 计算比例
     * @param {String} value 像素（二倍图量出来的要除2）
     */
    computedPercent(value) {
      let currentWidth = this.data.canvasW
      let oldWidth = 288
      return Math.floor(value * currentWidth / oldWidth)
    }
  }
})
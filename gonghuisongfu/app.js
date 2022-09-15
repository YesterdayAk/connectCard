// app.js
App({
  onLaunch(options) {
    let _self = this;
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        let iphoneArr = ['iPhone X', 'iPhone Xs', 'iPhone Xs Max', 'iPhone Xr', 'iPhone 11', 'iPhone 11Pro', 'iPhone 11Pro Max', 'iPhone 12', 'iPhone 12Pro', 'iPhone 12Pro Max', 'iPhone 13', 'iPhone 13Pro', 'iPhone 13Pro Max'];
        iphoneArr.forEach(function (item) {
          if (modelmes.search(item) != -1) {
            _self.globalData.isIphoneX = true
          }
        });
      }
    })
  },
  onShow(options) {
    if (options.path == "pages/index/index") {
      this.globalData.isGoHome = true;
    } else {
      this.globalData.isGoHome = false;
    }
    this.globalData.isShare = false;
    this.globalData.isFirst = true;
    wx.showLoading({
      title: '加载中',
    })

    if (wx.getStorageSync('isScan')) {
      this.globalData.isScan = wx.getStorageSync('isScan');
    } else {
      this.globalData.isScan = false;
      wx.setStorageSync("isScan", this.globalData.isScan);
    }
    // if (options.query.shareUUid) {
    //   this.globalData.shareUUid = options.query.shareUUid;
    // }
    // 先从将要打开的页面链接上取用户信息，找不到再从缓存中取（若先从缓存中取用户信息，容易导致用户此次登录时切换了账户，但是缓存中存的仍然是上个用户信息）
    if (options.query.memberId) {
      wx.setStorageSync("memberId", options.query.memberId)
      wx.setStorageSync("userPhone", options.query.userPhone)
      wx.setStorageSync("userIcon", decodeURIComponent(options.query.userIcon))
      wx.setStorageSync("fullName", decodeURIComponent(options.query.fullName))
      wx.setStorageSync("laborName", decodeURIComponent(options.query.laborName))
      this.globalData.memberId = options.query.memberId;
      this.globalData.userPhone = options.query.userPhone;
      this.globalData.userIcon = decodeURIComponent(options.query.userIcon);
      this.globalData.fullName = decodeURIComponent(options.query.fullName);
      this.globalData.laborName = decodeURIComponent(options.query.laborName);
      this.toLogin();
    } else if (wx.getStorageSync('memberId')) {
      this.globalData.memberId = wx.getStorageSync('memberId');
      this.globalData.userPhone = wx.getStorageSync('userPhone');
      this.globalData.userIcon = wx.getStorageSync('userIcon');
      this.globalData.fullName = wx.getStorageSync('fullName');
      this.globalData.laborName = wx.getStorageSync('laborName');
      this.toLogin();
    } else {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '首次进入小程序请通过齐鲁工惠进入！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.exitMiniProgram();
          }
        }
      })
    }
  },
  onHide() {
    // let pages = getCurrentPages();
    // // console.log(pages);
    // if(pages['0'].route == 'pages/home/home' && pages['0'].options.shareUUid && !this.globalData.isShare) {
    //   wx.switchTab({
    //     url: '/pages/home/home',
    //   })
    // }
  },
  toLogin() {
    let _this = this;
    wx.request({
      url: this.globalData.baseWebUrl + '/applet/login',
      data: {
        memberId: this.globalData.memberId,
        userPhone: this.globalData.userPhone,
        userIcon: this.globalData.userIcon,
        fullName: this.globalData.fullName,
        laborName: this.globalData.laborName,
      },
      method: "post",
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.setStorageSync("token", res.data.token)
          wx.setStorageSync("isFirst", res.data.firstLoginFlag)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        //是否有回调，以防home页的onLoad拿不到异步数据
        if (_this.employIdCallback) {
          _this.employIdCallback(1);
        }
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  // 设置监听器
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  // 监听属性，并执行监听函数
  observer: function (data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  },
  globalData: {
    isFirst: true, // 小程序是否从后台切到前台，或者第一次打开小程序
    baseWebUrl: "https://zxsbzzqjk.qdszgh.cn/api", // 接口地址
    // baseWebUrl: "http://192.168.0.4:3779", // 接口地址
    isIphoneX: false, // 是否iphone全面屏手机
    memberId: "", // 用户memberId
    userPhone: "", // 用户userPhone
    userIcon: "", // 用户userIcon
    fullName: "", // 用户fullName
    laborName: "", // 用户laborName
    shareUUid: "", // 标识区别某次分享的唯一uuid
    isShare: false, // 是否做分享操作
    isGoHome: false, // 将要打开的页面是home页
    isScan: false, // 是否为扫福模式,true为扫福模式，false为摇福模式，默认为摇福模式
  }
})
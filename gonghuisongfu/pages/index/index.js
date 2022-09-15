// pages/index/index.js
var app = getApp();
import get from "../../utils/request/get";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false, // 是否苹果全面屏手机
    isScan: "", // 是否为扫福模式
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
  },
  //去首页
  toHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  //去扫福页面
  toScan() {
    get({
      url: app.globalData.baseWebUrl + '/api/foca/isScanFoca'
    }).then((res) => {
      if (res.data.code == 200) {
        if (res.data.data == 0) {
          wx.showToast({
            title: "活动未开始",
            icon: 'none',
            duration: 2000
          })
          
        } else if (res.data.data == 1) {
          if (this.data.isScan) {
            // 扫一扫
            wx.navigateTo({
              url: '/pages/scan/scan',
            })
          } else {
            
            // 摇一摇
            wx.navigateTo({
              url: '/pages/shake/shake',
            })
          }
        } else {
          wx.showToast({
            title: "活动已结束",
            icon: 'none',
            duration: 2000
          })
        }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isScan: app.globalData.isScan
    });
    app.employIdCallback = employId => {
      // 执行业务逻辑...
      // 如果现在不是第一次进入小程序，并且将要进入的页面为index页，则跳转至home页
      if (!wx.getStorageSync('isFirst') && app.globalData.isGoHome) {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: "在知爱建 富强滨州",
      path: '/pages/index/index',
      imageUrl: "https://res1.qdszgh.cn/%E9%87%91%E7%A7%8B%E6%AD%A3%E5%BD%93%E6%97%B6/shareLink.png"
    }
  }

})
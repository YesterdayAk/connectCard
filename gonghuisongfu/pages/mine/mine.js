// pages/mine/mine.js
var app = getApp();
import get from "../../utils/request/get";
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    isScan: "", // 是否为扫福模式
    radio: "", //默认显示扫福
  },
  methods: {
    // 生命周期函数--监听页面加载
    onLoad: function () {
      wx.hideShareMenu();
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    // 获取用户信息
    getMyUserInfo() {
      wx.showLoading({
        title: '加载中',
      })
      get({
        url: app.globalData.baseWebUrl + '/applet/user/getMyUserInfo'
      }).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          if (!res.data.data.avatar) {
            res.data.data.avatar = "/images/headImg.png";
          }
          this.setData({
            userInfo: res.data.data
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(() => {
        wx.hideLoading();
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 去卡片记录
    goCardRecord() {
      wx.navigateTo({
        url: '/pages/cardRecord/cardRecord',
      })
    },
    // 去活动说明
    goActivityProfile() {
      wx.navigateTo({
        url: '/pages/activityProfile/activityProfile',
      })
    },
    //切换得卡方式
    onChange() {
      this.setData({
        isScan: !this.data.isScan
      });
      app.globalData.isScan = this.data.isScan;
      wx.setStorageSync("isScan", app.globalData.isScan);
      // 下面代码为改变底部导航栏得福方式入口图片
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          isScan: app.globalData.isScan
        })
      }
    },
    // 生命周期函数--监听页面显示
    onShow: function () {
      this.setData({
        isScan: app.globalData.isScan
      });

      if (this.data.isScan) {
        this.setData({
          radio: "1"
        })
      } else {
        this.setData({
          radio: "2"
        })
      }

      this.getMyUserInfo();
    },
    // 生命周期函数--监听页面隐藏
    onHide: function () {

    },
    // 生命周期函数--监听页面卸载
    onUnload: function () {

    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function () {

    },
    // 用户点击右上角分享
    onShareAppMessage(res) {}
  }
})
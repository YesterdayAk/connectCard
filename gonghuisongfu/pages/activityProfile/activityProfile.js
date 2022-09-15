// pages/activityProfile/activityProfile.js
var app = getApp();
import get from "../../utils/request/get";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    explain: "", // 活动说明
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取活动说明
  getActivityDescription() {
    wx.showLoading({
      title: '加载中',
    })
    get({
      url: app.globalData.baseWebUrl + '/applet/description/getActivityDescription'
    }).then((res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        res.data.data.content = res.data.data.content ? res.data.data.content : '无';
        this.setData({
          explain: res.data.data.content
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getActivityDescription();
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
  onShareAppMessage: function () {}

})
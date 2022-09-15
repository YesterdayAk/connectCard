// pages/scan/scan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId: "",
    userPhone: "",
    userIcon: "",
    fullName: "",
    laborName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 不允许点击右上角分享按钮
    wx.hideShareMenu();
    this.setData({
      memberId: wx.getStorageSync('memberId'),
      userPhone: wx.getStorageSync('userPhone'),
      userIcon: encodeURIComponent(wx.getStorageSync('userIcon')),
      fullName: encodeURIComponent(wx.getStorageSync('fullName')),
      laborName: encodeURIComponent(wx.getStorageSync('laborName'))
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

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
})
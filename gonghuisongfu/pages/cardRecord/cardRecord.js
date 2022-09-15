// pages/cardRecord/cardRecord.js
var app = getApp();
import get from "../../utils/request/get";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1, // tab选中项
    cardRecard: [], // 卡片记录
    pageNum: 0, // 请求页码
    pageSize: 20, // 一页包含几条数据
    finish: false, // 是否全部请求完
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
  // 点击空状态区域
  emptyClick() {
    this.setData({
      cardRecard: [],
      finish: false,
      pageNum: 0,
    });
    this.getCardRecard();
  },
  // 切换tab选中项
  changeTab(e) {
    let active = e.currentTarget.dataset.active;
    if (this.data.active != active) {
      this.setData({
        cardRecard: [],
        finish: false,
        active: active,
        pageNum: 0
      });
      this.getCardRecard();
    }
  },
  // 获取卡片记录
  getCardRecard() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNum: this.data.pageNum + 1,
    });
    let data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      type: this.data.active
    };
    get({
      url: app.globalData.baseWebUrl + '/api/foca/getFocaRecord',
      data: data
    }).then((res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        let cardRecard = this.data.cardRecard;
        let newArr = cardRecard.concat(res.data.rows);
        this.setData({
          cardRecard: newArr,
        })
        if (this.data.cardRecard.length == res.data.total) {
          this.setData({
            finish: true
          });
        }
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
    this.getCardRecard();
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
    if (!this.data.finish) {
      this.getCardRecard();
    }
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {}

})
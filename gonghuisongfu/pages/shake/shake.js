// pages/shake/shake.js
var app = getApp();
import get from "../../utils/request/get";
import post from "../../utils/request/post";
Page({
  // 页面的初始数据
  data: {
    isShow: false, // 页面是否显示
    isCan: true, // 是否可以摇，摇到一次之后置否，操作完成之后再置true，避免重复请求接口
    cardItem: "", // 获取到的卡片详情
    tangyuanCardShow: false, // 摇到卡片弹窗是否显示
    tangyuanNotCardShow: false, //未摇到卡片弹窗是否显示
    shakeShow: false, // 摇一摇弹窗
    shakeOverlayStyle: 'background-color: rgba(0, 0, 0, 0.8)', // 摇一摇弹窗遮罩层样式
    customStyle: 'width: 100%; height: 100vh; background: transparent;', // 弹窗大框样式
  },
  // 点击“摇一摇”按钮
  doShake() {
    let _that = this;
    this.setData({
      tangyuanCardShow: false,
    });
    this.setData({
      tangyuanNotCardShow: false,
    });
    this.setData({
      shakeShow: true,
    });
    setTimeout(function () {
      _that.getCard();
    }, 1800);
  },
  // 获取卡片
  getCard() {
    this.setData({
      tangyuanCardShow: false,
    })
    this.setData({
      tangyuanNotCardShow: false,
    })
    get({
      url: app.globalData.baseWebUrl + '/api/foca/puffFoca'
    }).then((res) => {
      this.setData({
        shakeShow: false,
      });
      if (res.data.code == 200) {
        this.setData({
          cardItem: res.data.data,
        });
        if (this.data.cardItem.tigerCardId) {
          // 卡片
          this.setData({
            tangyuanCardShow: true,
            isCan: true,
          });
        } else {
          // 空白卡
          this.setData({
            tangyuanNotCardShow: true,
            isCan: true,
          });
        }
      } else {
        this.setData({
          isCan: true,
        });
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(() => {
      this.setData({
        shakeShow: false,
        isCan: true,
      });
      wx.showToast({
        title: '获取失败',
        icon: 'error',
        duration: 2000
      })
    });
  },
  // 关闭卡片弹窗
  tangyuanCardFalse() {
    this.setData({
      tangyuanCardShow: false,
    });
    this.setData({
      tangyuanNotCardShow: false,
    });
  },
  // 摇一摇弹窗状态不变
  shakeTrue() {
    this.setData({
      shakeShow: true,
    });
  },
  // 弹窗状态不变
  cardTrue() {},
  // 点击弹窗遮罩层关闭弹窗/再摇一张
  onClickOverlay(res) {
    this.setData({
      tangyuanCardShow: false,
      tangyuanNotCardShow:false,
      shakeShow: false,
      answer: "",
    });
  },
  // 点返回按钮关闭卡片弹窗
  tangyuanCardleave() {
    this.setData({
      tangyuanCardShow: false,
      tangyuanNotCardShow:false,
    });
  },
  // 点返回按钮关闭摇一摇弹窗
  shakeleave() {
    this.setData({
      shakeShow: false,
    });
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 不允许点击右上角分享按钮
    wx.hideShareMenu();
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {
    // 只要进入摇一摇页面就将得福模式切换为摇福模式，这是因为在扫福页面（h5页面）内切换为摇福模式时无法设置app文件的变量，如果后期规定只能在“我的”页面内切换得福模式，则需去掉下方空行前代码
    app.globalData.isScan = false;
    wx.setStorageSync("isScan", app.globalData.isScan);
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        isScan: app.globalData.isScan
      })
    }

    var that = this;
    this.setData({
      isShow: true,
      // tangyuanCardShow: false,
      // shakeShow: false,
    });
    // 监测手机是否摇动
    wx.onAccelerometerChange(function (e) {
      // 不能摇的情况
      if (!that.data.isShow || that.data.tangyuanCardShow || that.data.tangyuanNotCardShow || that.data.shakeShow || !that.data.isCan) {
        return
      }
      // 可以摇的情况
      // 监测到摇动
      if (e.x > 1 && e.y > 1) {
        that.setData({
          isCan: false,
        });
        // 手机振动
        wx.vibrateLong({
          success: res => {
            console.log('振动')
          },
          fail: err => {
            console.log('振动失败')
          }
        })
        that.getCard();
      }
    })
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () {
    this.setData({
      isShow: false
    });
    // 隐藏当前页时，关闭此次进入页面开启的手机摇动监听，避免下次进入页面时开启监听从而导致同时开启多个监听的情况
    wx.offAccelerometerChange();
  },
  // 生命周期函数--监听页面卸载
  onUnload: function () {
    this.setData({
      isShow: false
    });
    // 离开当前页时，关闭此次进入页面开启的手机摇动监听，避免下次进入页面时开启监听从而导致同时开启多个监听的情况
    wx.offAccelerometerChange();
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
})
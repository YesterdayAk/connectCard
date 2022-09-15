var app = getApp();
import get from "../utils/request/get";
Component({
  data: {
    add: "add1",
    selected: 0,
    color: "#FFFFFF",
    selectedColor: "#FFC700",
    list: [{
      pagePath: "/pages/home/home",
      text: "首页",
      iconPath: "/images/icon1.png",
      selectedIconPath: "/images/icon1on.png"
    }, {
      pagePath: "/pages/mine/mine",
      text: "我的",
      iconPath: "/images/icon2.png",
      selectedIconPath: "/images/icon2on.png"
    }],
    isScan: app.globalData.isScan, // 是否为扫福模式
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      if (this.data.selected != data.index) {
        this.setData({
          selected: data.index
        })
      }
      if (data.index == "1") {
        this.setData({
          add: "add2" //为了点击后改变中间+号的图标
        })
        this.toScan();
      } else {
        this.setData({
          add: "add1" //为了点击后改变中间+号的图标
        })
        wx.switchTab({
          url
        })
      }
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
  }
})
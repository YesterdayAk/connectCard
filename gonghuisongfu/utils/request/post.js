//微信小程序：wx.request post请求封装工具类
var app = getApp();
export default ({
  url,
  data
}) => {
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('token');
    wx.request({
      url,
      data,
      header: {
        'content-type': 'application/json',
        'Authorization': token
      },
      method: "POST",
      success(res) {
        if (res.data.code == 401) {
          wx.request({
            url: app.globalData.baseWebUrl + '/applet/login',
            data: {
              memberId: wx.getStorageSync('memberId'),
              // userPhone: wx.getStorageSync('userPhone'),
              userIcon: wx.getStorageSync('userIcon'),
              // fullName: wx.getStorageSync('fullName'),
              // laborName: wx.getStorageSync('laborName')
            },
            method: "post",
            success(res) {
              if (res.data.code == 200) {
                wx.setStorageSync("token", res.data.token)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail(err) {
              wx.showToast({
                title: '登录失败',
                icon: 'error',
                duration: 2000
              })
            }
          })
          reject(res)
        } else {
          resolve(res)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
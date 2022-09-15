// pages/home/home.js
var app = getApp();
import get from "../../utils/request/get";
import post from "../../utils/request/post";
import util from "../../utils/util";
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false, // 是否苹果全面屏手机
    isHuSynthetic: false, // 全家福卡是否已和成
    canHuSynthetic: false, // 全家福卡是否可以合成
    ishecheng: false, // 是否刚合成全家福卡
    tigerList: [], // 卡片list
    tigerCardList: [], // 选中的卡片的单项卡片list
    active: 0, // 选中的那一类卡片
    tigerCardActive: 0, // 某类卡片中选中的是哪一个
    peopleItem: {}, // 参与人数及全家福卡合成情况
    identityTigerList: [], // 万能卡片变身时的普通卡片列表（总）
    identityTigerListOne: [], // 万能卡片变身时的普通卡片列表（第1页）
    identityTigerListTwo: [], // 万能卡片变身时的普通卡片列表（第2页）
    tyCardActive: 0, // 将要被变身的卡片列表swiper中选中的是哪一个swiper项，即哪一页
    identityActive: -1, // 万能卡片将要变身的卡片下标
    identited: false, // 是否已点击立即变身
    everyDayCard: {}, // 每天登录送一张卡片
    isFromFriendGive: false, // 朋友给与/索要的卡片
    shareUUid: "", // 朋友给与/索要的卡片有的时候，记录shareUUid
    userInfo: {}, // 用户信息
    isprizeOpen: false, // 是否已开奖
    awardInformation: {}, // 获奖信息
    mailingUser: "", // 收货人
    mailingPhone: "", // 电话
    mailingAddress: "", // 邮寄地址
    mailingLocation: "", //详细地址
    identityShow: false, // 立即变身弹窗是否显示
    identityCustomStyle: 'width: 92%; height: 122.13vw; margin-left: 4%; margin-top: calc(50vh - 61.06vw - 20px); border: 2px solid #A60000; background: linear-gradient(to bottom, #FFEDD8, #FFE0BC); border-radius: 16px;', // 立即变身弹窗大框样式
    kingTigerShow: false, // 保存全家福卡图片弹窗是否显示
    kingTigerCustomStyle: 'width: 100%; height: 100vh; background: transparent;', // 保存全家福卡图片弹窗大框样式
    acceptCardShow: false, // 立即收下弹窗是否显示
    acceptCardCustomStyle: 'width: 78.13%; height: 120.27vw; margin-left: 10.935%; margin-top: calc(50vh - 60.13vw - 22px); background: transparent;', // 立即收下/送给Ta弹窗大框样式
    giveCardShow: false, // 送给Ta弹窗是否显示
    prizeShow: false, // 开奖弹窗是否显示
    prizeCustomStyle: "width: 100%; height: 105.33vw; margin-top: calc(50vh - 52.665vw - 22px); background: transparent;", // 开奖弹窗大框样式
    prizeAcceptShow: false, // 提交收货信息弹窗是否显示
    prizeAcceptCustomStyle: "width: 100%; height: 100vh; background: transparent;", // 提交收货信息弹窗大框样式
    overlayStyle: 'background-color: rgba(0, 0, 0, 0.7); filter: blur(5px);', // 模糊遮罩
    couponCode: "",
    showAddress: false, //默认不显示省市区地址
    areaList: {
      province_list: {
        370000: "山东省",
      },
      city_list: {
        370200: "青岛市",
      },
      county_list: {
        370202: "市南区",
        370203: "市北区",
        370211: "黄岛区",
        370212: "崂山区",
        370213: "李沧区",
        370214: "城阳区",
        370215: "即墨区",
        370281: "胶州市",
        370283: "平度市",
        370285: "莱西市",
      },
    },
    isScan: "", // 是否为扫福模式
  },
  methods: {
    // 动态绑定收货人
    bindNameInput: function (e) {
      this.setData({
        mailingUser: e.detail.value
      })
    },
    // 动态绑定电话
    bindPhoneInput: function (e) {
      this.setData({
        mailingPhone: e.detail.value
      })
    },
    // 动态绑定详细地址
    bindLocationInput: function (e) {
      this.setData({
        mailingLocation: e.detail.value
      })
    },
    onClickAddress() {
      this.setData({
        showAddress: true
      })
    },
    onConfirmAddress(event) {
      console.log(event.detail)
      this.setData({
        mailingAddress: event.detail.values[0].name + "-" + event.detail.values[1].name + "-" + event.detail.values[2].name,
        showAddress: false
      })
    },
    onCancelAddress() {
      this.setData({
        showAddress: false
      })
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
      // 通过分享（被赠送/被索取福卡）的链接点进来的
      if (options.shareUUid) {
        app.globalData.shareUUid = options.shareUUid;
      }
      // 调用监听器，监听数据变化
      app.watch(this, {
        acceptCardShow: function (newVal) {
          this.getShareCard(newVal);
        }
      })
      let isIphoneX = app.globalData.isIphoneX;
      this.setData({
        isIphoneX: isIphoneX
      })
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {},
    // 点击页面上方某类卡片时切换选中的卡片
    tigerChange(event) {
      let index = event.currentTarget.dataset.index;
      this.setData({
        tigerCardList: JSON.parse(JSON.stringify(this.data.tigerList[index].cardList)),
        active: index,
        tigerCardActive: 0,
      });
    },
    // 某一类卡片数量大于1时，左右滑动切换选中的某张卡片
    swiperChange(e) {
      this.setData({
        tigerCardActive: e.detail.current
      });
    },
    // 图片翻转，福卡/角色卡切换
    imgClick(event) {
      let num = event.currentTarget.dataset.num;
      var istiger = "tigerCardList[" + num + "].istiger";
      var ifFirst = "tigerCardList[" + num + "].ifFirst";
      this.setData({
        [istiger]: !this.data.tigerCardList[num].istiger,
        [ifFirst]: false,
      });
    },
    // 获取用户信息
    getMyUserInfo() {
      get({
        url: app.globalData.baseWebUrl + '/applet/user/getMyUserInfo'
      }).then((res) => {
        if (res.data.code == 200) {
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
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 获取是否已开奖
    getPrizeOpen() {
      get({
        url: app.globalData.baseWebUrl + '/api/foca/isScanFoca'
      }).then((res) => {
        if (res.data.code == 200) {
          if (res.data.data == 2) {
            // 已开奖
            this.setData({
              isprizeOpen: true
            });
            if (app.globalData.isFirst) {
              app.globalData.isFirst = false;
              this.getAwardInformation();
            }
          } else {
            // 未开奖
            this.setData({
              isprizeOpen: false
            });
            if (app.globalData.isFirst) {
              app.globalData.isFirst = false;
              this.getEveryDayCard();
            }
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
    // 获取获奖信息
    getAwardInformation() {
      get({
        url: app.globalData.baseWebUrl + '/applet/user/getAwardInformation'
      }).then((res) => {
        if (res.data.code == 200) {
          this.setData({
            awardInformation: res.data.data,
            prizeShow: true,
            couponCode: res.data.data.couponCode
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
    // 获取页面下方参与人数及全家福卡合成情况
    getTigerRolePeople() {
      get({
        url: app.globalData.baseWebUrl + '/api/foca/getParticipateGoldenTiger'
      }).then((res) => {
        if (res.data.code == 200) {
          this.setData({
            peopleItem: res.data.data
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
    // 获取卡片列表
    getTigerList() {
      wx.showLoading({
        title: '加载中',
      })
      get({
        url: app.globalData.baseWebUrl + '/api/foca/getMyFoca'
      }).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          let num = 0;
          for (let i = 0; i < res.data.data.length; i++) {
            let item = res.data.data[i];
            if (i == 0) {
              if (item.cardList.length > 0) {
                // 已合成
                this.setData({
                  isHuSynthetic: true
                });
              } else {
                // 未合成
                this.setData({
                  isHuSynthetic: false
                });
              }
            }
            if (i > 0) {
              if (item.cardList.length > 0) {
                // 某类卡片数量大于0，即已拥有某类卡片
                num = num + 1;
              }
            }
            for (let j = 0; j < item.cardList.length; j++) {
              // 设置初始状态下，都是显示福卡而不是角色卡的状态
              let el = item.cardList[j];
              el.istiger = true;
              el.ifFirst = true;
            }
          }
          this.setData({
            tigerList: res.data.data
          });
          // 需要集齐几种卡片合成下面数字就改成几
          if (num == 6 && !this.data.isHuSynthetic) {
            this.setData({
              canHuSynthetic: true
            });
          } else {
            this.setData({
              canHuSynthetic: false
            });
          }
          if (!this.data.canHuSynthetic && !this.data.isHuSynthetic) {
            // 未合成且不能合成时不显示金虎卡，即从数组第1项开始显示
            this.setData({
              active: 1,
            });
          } else {
            // 已合成或者能合成时显示金虎卡，即从数组第0项开始显示
            this.setData({
              active: 0,
            });
          }
          // 当前选中的那一类卡片list
          if (this.data.tigerList.length > this.data.active) {
            this.setData({
              tigerCardList: JSON.parse(JSON.stringify(this.data.tigerList[this.data.active].cardList)),
            });
          }
          // 上一步操作为点击合成全家福卡，此时需要显示保存图片的弹窗，若后期不用保存图片了，就不需要下方操作了
          if (this.data.ishecheng) {
            this.setData({
              ishecheng: false,
              kingTigerShow: true,
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
    // 获取万能卡片变身时的普通卡片列表
    getIdentityTigerList() {
      get({
        url: app.globalData.baseWebUrl + '/api/foca/getOrdinaryTigerCard'
      }).then((res) => {
        if (res.data.code == 200) {
          this.setData({
            identityTigerList: res.data.data
          });
          let identityTigerListOne = [];
          let identityTigerListTwo = [];
          if (res.data.data.length > 6) {
            identityTigerListOne = res.data.data.slice(0, 6);
            identityTigerListTwo = res.data.data.slice(6, res.data.data.length);
            this.setData({
              identityTigerListOne: identityTigerListOne,
              identityTigerListTwo: identityTigerListTwo,
            });
          } else {
            identityTigerListOne = res.data.data;
            this.setData({
              identityTigerListOne: identityTigerListOne,
              identityTigerListTwo: identityTigerListTwo,
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
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 将要被变身的普通卡片swiper切换swiper选中项，即页码
    tySwiperChange(e) {
      this.setData({
        tyCardActive: e.detail.current
      });
    },
    // 获取每天登录送的那张卡片
    getEveryDayCard() {
      get({
        url: app.globalData.baseWebUrl + '/api/foca/puffFocaBySignIn'
      }).then((res) => {
        if (res.data.code == 200) {
          this.setData({
            everyDayCard: res.data.data
          });
          this.setData({
            acceptCardShow: true
          });
        } else {
          this.getShareCard(false);
        }
      }).catch(() => {
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 获取赠送/索要的卡片信息
    getShareCard(newVal) {
      // 在每天送的那张卡片弹窗点遮罩层关闭弹窗，判断有没有通过赠送或索要链接点进来
      if (!newVal && app.globalData.shareUUid) {
        this.setData({
          shareUUid: app.globalData.shareUUid
        });
        app.globalData.shareUUid = "";
        get({
          url: app.globalData.baseWebUrl + '/api/share/getShareFocaInfo',
          data: {
            fcoaShareId: this.data.shareUUid
          }
        }).then((res) => {
          if (res.data.code == 200) {
            this.setData({
              everyDayCard: res.data.data,
              isFromFriendGive: true
            });
            if (res.data.data.shareType == 1) {
              this.setData({
                acceptCardShow: true
              });
            } else if (res.data.data.shareType == 2) {
              this.setData({
                giveCardShow: true
              });
            }
          }
        }).catch(() => {
          wx.showToast({
            title: '获取失败',
            icon: 'error',
            duration: 2000
          })
        });
      }
    },
    // 点击页面上的保存图片
    saveImgShow() {
      this.setData({
        kingTigerShow: true
      });
    },
    // 点击立即变身
    identityClick() {
      this.setData({
        tyCardActive: 0,
        identityActive: -1,
        identityShow: true,
      });
    },
    // 选中将要变身成为的卡片
    identitySelect(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        identityActive: index,
      });
    },
    // 万能卡变身
    identityChange() {
      // console.log(this.data.identityActive)
      let that = this;
      wx.showModal({
        title: '提示',
        content: '您确定要变身吗？',
        success(res) {
          if (res.confirm) {
            that.identityChangeEnsure();
          }
        }
      });
    },
    // 确定万能卡变身
    identityChangeEnsure() {
      this.setData({
        identited: true,
      });
      wx.showLoading({
        title: '变身中',
      })
      let id = this.data.identityTigerList[this.data.identityActive].focaId;
      get({
        url: app.globalData.baseWebUrl + '/api/foca/transformationTigerCard',
        data: {
          targetTigerId: id
        }
      }).then((res) => {
        wx.hideLoading();
        this.setData({
          identited: false,
        });
        if (res.data.code == 200) {
          wx.showToast({
            title: "变身成功",
            icon: 'success',
            duration: 2000
          })
          this.setData({
            identityShow: false,
            tyCardActive: 0,
            identityActive: -1,
          });
          this.getTigerList();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(() => {
        wx.hideLoading();
        this.setData({
          identited: false,
        });
        wx.showToast({
          title: '变身失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 关闭万能卡变身弹窗
    closeIdentity() {
      this.setData({
        identityShow: false,
      });
    },
    // 全家福卡合成
    huSynthetic() {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '您确定要合成金秋主题卡吗？',
        success(res) {
          if (res.confirm) {
            that.huSyntheticEnsure();
          }
        }
      });
    },
    // 确定全家福卡合成
    huSyntheticEnsure() {
      wx.showLoading({
        title: '合成中',
      })
      get({
        url: app.globalData.baseWebUrl + '/api/foca/synthesisTigerCard'
      }).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: "合成成功",
            icon: 'success',
            duration: 2000
          })
          this.setData({
            ishecheng: true,
          });
          this.getTigerList();
          this.getTigerRolePeople();

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
          title: '合成失败',
          icon: 'error',
          duration: 2000
        })
      });
    },
    // 关闭全家福卡弹窗
    kingTigerFalse() {
      this.setData({
        kingTigerShow: false,
      });
      this.getAwardInformation()
    },
    // 全家福卡弹窗状态不变
    kingTigerTrue() {},
    // 关闭提交收货信息弹窗
    prizeAcceptFalse() {
      this.setData({
        prizeAcceptShow: false
      });
    },
    // 提交收货信息弹窗状态不变
    prizeAcceptTrue() {},
    // 立即收下/送给Ta
    acceptCard() {
      // 每天一张的卡片收下
      if (!this.data.isFromFriendGive) {
        get({
          url: app.globalData.baseWebUrl + '/api/foca/acceptTigerCard'
        }).then((res) => {
          if (res.data.code == 200) {
            wx.showToast({
              title: '领取成功',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              acceptCardShow: false,
            });
            this.getTigerList();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(() => {
          wx.showToast({
            title: '领取失败',
            icon: 'error',
            duration: 2000
          })
        });
      } else {
        // 朋友赠送的卡片收下/索要的卡片领取
        get({
          url: app.globalData.baseWebUrl + '/api/share/shareReceiveOrGift',
          data: {
            fcoaShareId: this.data.shareUUid
          }
        }).then((res) => {
          if (res.data.code == 200) {
            if (this.data.acceptCardShow) {
              wx.showToast({
                title: '领取成功',
                icon: 'none',
                duration: 2000
              })
            } else if (this.data.giveCardShow) {
              wx.showToast({
                title: '赠送成功',
                icon: 'none',
                duration: 2000
              })
            }
            this.setData({
              acceptCardShow: false,
              giveCardShow: false,
            });
            this.getTigerList();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(() => {
          wx.showToast({
            title: '操作失败',
            icon: 'error',
            duration: 2000
          })
        });
      }
    },
    // 立即领奖/立即抽奖/好的
    acceptPrize() {
      this.setData({
        prizeShow: false
      });
      if (this.data.awardInformation.awardLevel != 0 && !this.data.awardInformation.infoPerfectFlag) {
        this.setData({
          prizeAcceptShow: true,
          mailingUser: this.data.userInfo.nickName,
          mailingPhone: this.data.userInfo.phonenumber,
          mailingAddress: this.data.userInfo.mailingAddress,
          mailingLocation: this.data.userInfo.mailingLocation
        });
      }
    },
    // 提交
    messageSubmit() {
      console.log('mailingLocation', this.data.mailingLocation)
      let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (!this.data.mailingUser) {
        wx.showToast({
          title: '收货人不能为空',
          icon: 'error',
          duration: 2000
        })
      } else if (!this.data.mailingPhone) {
        wx.showToast({
          title: '电话不能为空',
          icon: 'error',
          duration: 2000
        })
      } else if (!reg.test(this.data.mailingPhone)) {
        wx.showToast({
          title: '电话格式不正确',
          icon: 'error',
          duration: 2000
        })
      } else if (!this.data.mailingAddress) {
        wx.showToast({
          title: '邮寄地址不能为空',
          icon: 'error',
          duration: 2000
        })
      } else if (!this.data.mailingLocation) {
        wx.showToast({
          title: '详细地址不能为空',
          icon: 'error',
          duration: 2000
        })
      } else {
        let data = {
          mailingUser: this.data.mailingUser,
          mailingPhone: this.data.mailingPhone,
          mailingAddress: this.data.mailingAddress,
          mailingLocation: this.data.mailingLocation,
        };
        post({
          url: app.globalData.baseWebUrl + '/applet/user/perfectMailingAddress',
          data: data
        }).then((res) => {
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              prizeAcceptShow: false
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
            title: '提交失败',
            icon: 'error',
            duration: 2000
          })
        });
      }
    },
    // 点击弹窗遮罩层关闭弹窗
    onClickOverlay(res) {
      this.setData({
        identityShow: false,
        kingTigerShow: false,
        acceptCardShow: false,
        giveCardShow: false,
        prizeShow: false,
        prizeAcceptShow: false,
      });
    },
    // 点返回按钮关闭万能卡变身弹窗
    identityleave() {
      this.setData({
        identityShow: false,
      });
    },
    // 点返回按钮关闭xx送你一张xx卡弹窗
    acceptCardleave() {
      this.setData({
        acceptCardShow: false,
      });
    },
    // 点返回按钮关闭xx求“xx汤圆”卡1张！弹窗
    giveCardleave() {
      this.setData({
        giveCardShow: false,
      });
    },
    // 点返回按钮关闭卡片合成后的全家福卡弹窗
    kingTigerleave() {
      this.setData({
        kingTigerShow: false,
      });
    },
    // 点返回按钮关闭开奖弹窗
    prizeleave() {
      this.setData({
        prizeShow: false,
      });
    },
    // 点返回按钮关闭提交收货信息弹窗
    prizeAcceptleave() {
      this.setData({
        prizeAcceptShow: false,
      });
    },
    // 生命周期函数--监听页面显示
    onShow: function () {
      // this.setData({
      //   identityShow: false,
      //   kingTigerShow: false,
      //   acceptCardShow: false,
      //   giveCardShow: false,
      //   prizeShow: false,
      //   prizeAcceptShow: false,
      // });
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          isScan: wx.getStorageSync('isScan')
        })
      }
      this.getPrizeOpen();
      this.getTigerList();
      this.getTigerRolePeople();
      this.getMyUserInfo();
      this.getIdentityTigerList();
    },
    // 生命周期函数--监听页面隐藏
    onHide: function () {},
    // 生命周期函数--监听页面卸载
    onUnload: function () {},
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {},
    // 页面上拉触底事件的处理函数
    onReachBottom: function () {},
    // 用户点击右上角分享
    onShareAppMessage(res) {
      app.globalData.isShare = true;
      if (res.from == "button" && !this.data.isprizeOpen) {
        // 带卡片信息的分享
        let shareTitle = ""; // 分享面板标题
        let message = "分享成功"; // 分享成功提示语
        let shareUUid = util.wxuuid(); // 调用util.wxuuid()
        let data = {};
        // 赠送
        if (res.target.id == "1") {
          shareTitle = '送你一张 "' + this.data.tigerList[this.data.active].tigerName + '" 卡';
          data = {
            shareType: 1,
            focaUserGrantId: this.data.tigerCardList[this.data.tigerCardActive].focaUserGrantId,
            shareUUid: shareUUid
          };
          message = "赠送成功";
        } else {
          // 索要
          shareTitle = "求“" + this.data.tigerList[this.data.active].tigerName + "”卡1张！谢谢你啦～";
          data = {
            shareType: 2,
            tigerCardId: this.data.tigerList[this.data.active].focaId,
            shareUUid: shareUUid
          };
        }
        post({
          url: app.globalData.baseWebUrl + '/api/share/shareFoca',
          data: data
        }).then((res) => {
          if (res.data.code == 200) {
            console.log(message);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(() => {
          wx.showToast({
            title: '操作失败',
            icon: 'error',
            duration: 2000
          })
        });
        return {
          title: shareTitle, // 分享面板标题文字
          path: '/pages/home/home?shareUUid=' + shareUUid,
          imageUrl: "https://res1.qdszgh.cn/%E9%87%91%E7%A7%8B%E6%AD%A3%E5%BD%93%E6%97%B6/shareLink.png",
        }
      } else {
        // 普通分享
        return {
          title: "在知爱建 富强滨州",
          path: '/pages/home/home',
          imageUrl: "https://res1.qdszgh.cn/%E9%87%91%E7%A7%8B%E6%AD%A3%E5%BD%93%E6%97%B6/shareLink.png",
        }
      }
    }
  }
})
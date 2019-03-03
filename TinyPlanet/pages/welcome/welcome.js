import { $init, $digest, formatTime } from '../../utils/common.util'
var app = getApp();
wx.cloud.init()
const db = wx.cloud.database()
const userCollection = "DB_userinfo"
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.showLoading({
      title: '正在登录...',
    })
    var that = this;
    // 查看是否授权
    //是否是新用户
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // console.log('已授权，数据正常')
              that.getOpenid();
              that.setUserInfoAndNext(res);
            },
            // fail: res => {
            //   // console.log('已授权，数据异常')
            // }
          });

        }
        //没有授权
        else {
          wx.hideLoading()
          // 跳转首页
          setTimeout(() => {
            wx.reLaunch({
              url: '../loginpage/loginpage'
            })
          }, 1000)
        }
      }
    })

  },

  setUserInfoAndNext(res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
    wx.hideLoading()
    // 跳转首页
    setTimeout(() => {
      wx.reLaunch({
        url: '../homepage/homepage'
      })
    }, 1000)
  },


  // 获取用户openid
  getOpenid() {
    //Node.js云函数
    wx.cloud.callFunction({
      name: 'getUserInformation',
      success: res => {
        db.collection(userCollection)
          .where({ _openid: res.result.openid })
          .get({
            success: function (r) {
              app.globalData["userInfo"] = r.data[0];
              // console.log(r.data[0]);
            }
          })
        // console.log(res.result)
        app.globalData["openId"] = res.result.openid;
        // console.log('云函数获取到的openid: ', app.globalData["openId"]);
      },
      fail: err => {
        // handle error
        // console.log('云函数获取失败' + err);
      }
    })
  },
})
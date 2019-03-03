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
    //获取openId
    this.getOpenid();
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //插入登录的用户的相关信息到数据库
      var isnew = true
      //插入登录的用户的相关信息到数据库
      db.collection(userCollection).where({
        _openid: app.globalData['openId']
      }).get(
        {
          success: function (res) {
            if (res.data !== "") {
              isnew = false;
            }
            if (isnew) {
              db.collection(userCollection).add({
                data: {
                  //  _openid: app.globalData['openId'],
                  nickName: e.detail.userInfo.nickName,
                  avatarUrl: e.detail.userInfo.avatarUrl,
                  gender: e.detail.userInfo.gender,
                  country: e.detail.userInfo.country,
                  province: e.detail.userInfo.province,
                  city: e.detail.userInfo.city
                },
                // success: function (res) {
                //   //从数据库获取用户信息
                //   // console.log("插入小程序登录用户信息成功！");
                // },
                // fail: function (res) {
                //   // console.log("插入失败！")
                // }
              });
            }
          },
        }
      );
      // console.log(app.globalData["openId"])
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '../homepage/homepage'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  // 获取用户openid
  getOpenid() {
    //Node.js云函数
    wx.cloud.callFunction({
      name: 'getUserInformation',
      success: res => {
        db.collection(userCollection)
          .where({ _openid: res.result.openId })
          .get({
            success: function (r) {
              app.globalData["userInfo"] = r.data[0];
            }
          })
        // console.log('云函数获取到的openid: ', res.result.openId);
        app.globalData["openId"] = res.result.openId;
        // console.log('赋值给全局变量' + app.globalData['openId']);
      },
      fail: err => {
        // handle error
        // console.log('云函数获取失败' + err);
      }
    })
  },
})
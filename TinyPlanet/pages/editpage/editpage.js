import { $init, $digest } from '../../utils/common.util'
var app = getApp();
const db = wx.cloud.database();
var isAnonym = false;
Page({
  data: {
    contentCount: 0,
    content: '',
    contentvalue: '',
  },

  onLoad: function () {
    $init(this)
    wx.setNavigationBarTitle({ title: '记录' })
  },


  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  isAnonymous: function(e) {
    if (e.detail.value === '') {
      isAnonym = false
    }
    else {
      isAnonym = true
    }
  },
 
  submit: function(){
    const content = this.data.content
    if (content) {
      if (isAnonym){
        db.collection("DB_cryptolalia").add({
          data: {
            author_id: app.globalData['openId'],
            author: "匿名用户",
            date: new Date(),
            selected: false,
            text: content,
          },
          success(res) {
            wx.showToast({
              title: '发表成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail(err) {
            wx.showToast({
              title: '发表失败',
              icon: 'fail',
              duration: 1000
            })
          }
        })
      }else{
        db.collection("DB_cryptolalia").add({
          data: {
            author_id: app.globalData['openId'],
            author: app.globalData['userInfo']['nickName'],
            date: new Date(),
            selected: false,
            text: content,
          },
          success(res) {
            wx.showToast({
              title: '发表成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail(err) {
            wx.showToast({
              title: '发表失败',
              icon: 'fail',
              duration: 1000
            })
          }
        })
      }
      

      this.setData({
        contentCount: 0,
        content: '',
        contentvalue: '',
      })
      wx.reLaunch({
        url: '../homepage/homepage'
      })
    }
  }
})
import { $init, $digest } from '../../utils/common.util'
var app = getApp();
const db = wx.cloud.database();
var check;
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
      check = false
    }
    else {
      check = true
    }
    // console.log('是否匿名：',check);
  },
 
  submit: function(){
    // console.log('submit')
    const content = this.data.content
    if (content) {
      //保存路径到数据库
      db.collection("DB_cryptolalia").add({
        data: {
          //作者Openid
          author_id: app.globalData['openId'],
          //作者名字
          author: app.globalData['userInfo']['nickName'],
          //日期格式要注意 [MM-DD hh:mm]
          date: new Date(),
          state: check,
          selected: false,
          text: content,
        },
        success(res) {
          // console.log(">>>发表成功", res)
          wx.showToast({
            title: '发表成功',
            icon: 'success',
            duration: 1000
          })
        },
        fail(err) {
          // console.log(">>>发表失败", err)
          wx.showToast({
            title: '发表失败',
            icon: 'fail',
            duration: 1000
          })
        }
      })

      this.setData({
        contentCount: 0,
        content: '',
        contentvalue: '',
      })
      wx.switchTab({
        url: '../homepage/homepage',
      })
    }
  }
})
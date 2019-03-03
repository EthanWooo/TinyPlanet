import { $init, $digest, formatTime } from '../../utils/common.util'
var app = getApp();
wx.cloud.init()
const db = wx.cloud.database()
const reply_db = wx.cloud.database()
var textid = ""
var dbdata = []
var replydata = []
var inputvalue = ""
var isAnonym = false

Page({
  data: {
    text_item: dbdata[0],
    reply_list: replydata,
    input_value: "",
    commenticon: "../../icon/comment.png",
    replyicon: '../../icon/reply.png',
  },

  onLoad: function(options) {
    var that = this
    textid = options.text_id
    db.collection('DB_cryptolalia')
      .where({
        _id: options.text_id
      })
      .limit(1)
      .get({
        success: function (res) {
          for (let k in res.data) {
            dbdata.push(res.data[k])
          }
          that.setData({
            text_item: dbdata[0],
          })
          dbdata = []
        }
      })

    db.collection('DB_reply')
      .where({
        text_id: options.text_id
      })
      .get({
        success: function (res) {
          for (let k in res.data) {
            replydata.push(res.data[k])
          }
          that.setData({
            reply_list: replydata,
          })
          replydata = []
        }
      })
  },

  handleReplyInput: function(e){
    var that = this
    inputvalue = e.detail.value
    that.setData({
      input_value: inputvalue,
    })
  },

  anonym: function (e) {
    if (this.data.replyicon == '../../icon/reply.png') {
      this.setData({
        replyicon: '../../icon/anonym.png',
      })
      isAnonym = true
    } else {
      this.setData({
        replyicon: '../../icon/reply.png',
      })
      isAnonym = false
    }
  },

  comment: function(e){
    var that = this
    console.log(inputvalue)
    that.setData({
      input_value: "",
    })
    //保存路径到数据库
    if (isAnonym){
      db.collection("DB_reply").add({
        data: {
          text_id: textid,
          reply_author: "匿名用户",
          reply_context: inputvalue,
        },
        success(res) {
          // console.log(">>>发表成功", res)
          wx.showToast({
            title: '匿名评论成功',
            icon: 'success',
            duration: 1000
          })
        },
        fail(err) {
          // console.log(">>>发表失败", err)
          wx.showToast({
            title: '匿名评论失败',
            icon: 'fail',
            duration: 1000
          })
        },
      })
    } else {
      db.collection("DB_reply").add({
        data: {
          text_id: textid,
          reply_author: app.globalData['userInfo']['nickName'],
          reply_context: inputvalue,
        },
        success(res) {
          // console.log(">>>发表成功", res)
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000
          })
        },
        fail(err) {
          // console.log(">>>发表失败", err)
          wx.showToast({
            title: '评论失败',
            icon: 'fail',
            duration: 1000
          })
        },
      })
    }
    
    db.collection('DB_reply')
      .where({
        text_id: textid
      })
      .get({
        success: function (res) {
          for (let k in res.data) {
            replydata.push(res.data[k])
          }
          that.setData({
            reply_list: replydata,
          })
          replydata = []
        }
      })
  }
})
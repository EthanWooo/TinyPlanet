wx.cloud.init()
const db = wx.cloud.database()
var dbdata = []
Page({

  data: {
    messageList: dbdata
  },

  onLoad: function () {
    var that = this
    db.collection('DB_cryptolalia')
      .orderBy('date', 'desc')
      .get({
        success: function (res) {
          dbdata = res.data
          var newest = dbdata[0]
          dbdata.splice(0,1)
          dbdata.sort(function () { return 0.5 - Math.random() })
          dbdata.unshift(newest)
          dbdata[0].selected = true
          dbdata.slice(0,10)
          that.setData({
            messageList: dbdata,
          })
          dbdata = []
        }
      })
  },

  onShow: function () {
    this.onLoad()
  },
  
  getSelectItem: function (e) {
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.messageList.length;
    var scrollLeft = e.detail.scrollLeft;//滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth);
    for (var i = 0, len = that.data.messageList.length; i < len; ++i) {
      that.data.messageList[i].selected = false;
    }
    that.data.messageList[curIndex].selected = true;
    that.setData({
      messageList: that.data.messageList
    });
  },
})
wx.cloud.init()
const db = wx.cloud.database()
var dbdata = []
db.collection('DB_cryptolalia')
  .limit(15).get({
    success: function (res) {
      var flag = false
      for (let k in res.data) {
        if (!flag) {
          res.data[k].selected = true
          flag = true
        }
        dbdata.push(res.data[k])
      }
    }
  })
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageList: dbdata
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

  myEdit: function (e) {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
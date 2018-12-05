var app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:[],
    id:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */

  getPage:function(){
    var that = this
    wx.request({
      url: app.globalData.url + "/api/page/" + that.data.id,
      success:function(res){
        var result = res.data
        result.icon = app.globalData.url + "/getImage/" + result.icon
        result.titleImage = app.globalData.url + "/getImage/" + result.titleImage
        console.log(result, "页面内容")
        WxParse.wxParse('article', 'html', result.content, that, 5);
        that.setData({
          page:result
        })
      }
    })
  },
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id:options.id
    })
    this.getPage()
  },

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
    var that = this
    return {
      title: that.data.page.name,
      path: 'pages/article/article?id=' + that.data.id,
      imageUrl: that.data.page.titleImage}
  }
})
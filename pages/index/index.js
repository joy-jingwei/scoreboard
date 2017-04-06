//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  mylistTap: function() {
    wx.navigateTo({
      url: '../mylist/mylist'
    })
  },
  addTag: function() {
    wx.navigateTo({
      url: '../add/add'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo.userInfo
      })
    })
  }
})
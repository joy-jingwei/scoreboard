// pages/mylist/mylist.js
var app = getApp()
encodeURIComponent
Page({
  data:{mylist: null},
  itemTap: function(e) {
    wx.navigateTo({
      url: '../item/item?boardid=' + encodeURIComponent(e.currentTarget.dataset.boardid)
    })
  },
  onLoad:function(options){
    var that = this
    app.getUserInfo(function(userInfo){
      wx.request({
        url: 'https://www.yuxiaoyan.cn/scoreboard/rest/item/',
        data: {},
        method: 'GET',
        header: {
          'X-UserToken': app.globalData.userToken
        },
        success: function(res){
          if (res.data.errno) {
            wx.showModal({
              'title': '错误',
              'content': res.data.error,
              'showCancel': false
            })
          } else {
            that.setData({mylist: res.data.data.list})
          }
        }
      })
    })
  }
})
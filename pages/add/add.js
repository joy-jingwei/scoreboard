// pages/add/add.js
var app = getApp()
Page({
  data:{
    title: '',
    focus: true,
    disabled: false
  },
  titleInput: function(e) {
    var that = this
    that.setData({title: e.detail.value})
  },
  addTap: function(e) {
    var that = this
    if (0 == that.data.title.length) {
      wx.showModal({
        'title': '提示',
        'content': '请输入风云榜名称',
        'showCancel': false,
        'success': function() {
          that.setData({focus:true})
        }
      })
    } else {
      that.setData({disabled: true})
      wx.request({
        url: 'https://www.yuxiaoyan.cn/scoreboard/rest/item/',
        data: {
          'update[title]': that.data.title
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-UserToken': app.globalData.userToken
        },
        success: function(res){
          that.setData({disabled: false, title: ''})
          wx.navigateTo({
            url: '../mylist/mylist'
          })
        },
      })
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
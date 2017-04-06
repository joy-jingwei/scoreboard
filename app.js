//app.js
App({
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userToken){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (loginres) {
          that.globalData.loginInfo = loginres
          wx.getUserInfo({
            withCredentials: false,
            success: function (res) {
              that.globalData.userInfo = res
              wx.request({
                url: 'https://www.yuxiaoyan.cn/scoreboard/rest/login/',
                data: {
                  'update[code]': that.globalData.loginInfo.code,
                  'update[info]': JSON.stringify(that.globalData.userInfo.userInfo)
                  },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res){
                  that.globalData.userToken = res.data.data.key
                  typeof cb == "function" && cb(that.globalData.userInfo)
                },
              })
            }
          })
        }
      })
    }
  },
  globalData:{
    loginInfo:null,
    userInfo:null,
    userToken:null
  }
})
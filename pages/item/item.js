// pages/item/item.js
var app = getApp()
Page({
  data:{
    ismember: null,
    selectedTab: 'rank',
    boardid: null,
    boardinfo: null,
    userlist: [],
    recordDetail: {},
    recordTitle: '',
    recordTitleFocus: false,    
    recordList: null,
    recordUserinfos: {},
    recordPage: {next: true, next_boundary: 0}
  },
  onShareAppMessage: function() {
    var that = this
    return {
      title: '欢迎加入 ' + that.data.boardinfo.title + ' 风云榜',
      path: '/pages/item/item?boardid=' + encodeURIComponent(that.data.boardid)
    }
  },
  onRankTap: function() {
    var that = this
    that.setData({selectedTab: 'rank'})
  },
  onDetailTap: function() {
    var that = this
    that.setData({selectedTab: 'detail'})
    if (null == that.data.recordList) {
      that.loadDetail()
    }
  },
  onMoreRecordTap: function() {
    var that = this
    that.loadDetail()
  },
  onAddRecordTap: function() {
    var days = new Array('日', '一', '二', '三', '四', '五', '六')
    var that = this
    if ('add' != that.data.selectedTab) {
      var date = new Date
      that.setData({selectedTab: 'add',
       recordTitle: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 周' + days[date.getDay()] + '局'})
    } else if (!that.data.recordTitle.trim().length) {
      wx.showModal({
        'title': '提示',
        'content': '请输入对局名称',
        'showCancel': false,
        'success': function() {
          that.setData({recordTitleFocus:true})
        }
      })
    } else {
      var data = {}
      data['boardid'] = that.data.boardid
      data['title'] = that.data.recordTitle
      data['detail'] = []
      for (var k in that.data.recordDetail) {
        if (that.data.recordDetail[k].trim().length) {
          data['detail'].push({
            'uid': k,
            'score': that.data.recordDetail[k]
          })
        }
      }
      if (!data['detail'].length) {
        wx.showModal({
          'title': '提示',
          'content': '请输入对局成绩',
          'showCancel': false
        })
      } else {
        wx.request({
          url: 'https://www.yuxiaoyan.cn/scoreboard/rest/record/',
          data: {
            'jsondata': JSON.stringify({'update': data})
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
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
              that.setData({recordList: null, recordUserinfos: {}, recordPage: {next: true, next_boundary: 0}})
              that.loadRank()
            }
          }
        })
      }
    }
  },
  onJoinBoardTap: function() {
    var that = this
    wx.request({
      url: 'https://www.yuxiaoyan.cn/scoreboard/rest/user/',
      data: {'update[boardid]': that.data.boardid},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
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
          that.loadRank()
        }
      }
    })
  },
  onScoreInput: function(e) {
    var that = this
    that.data.recordDetail[e.currentTarget.dataset.uid] = e.detail.value
  },
  onRecordTitleInput: function(e) {
    var that = this
    that.setData({recordTitle: e.detail.value})
  },
  onLoad:function(options){
    var that = this
    app.getUserInfo(function(userInfo){
      that.setData({boardid: options.boardid})
      that.loadRank()
    })
  },
  loadRank: function() {
    var that = this
    wx.request({
      url: 'https://www.yuxiaoyan.cn/scoreboard/rest/user/',
      data: {
        'filter[boardid]': that.data.boardid,
        'ex_style': 'default'
      },
      method: 'GET',
      header: {
        'X-UserToken': app.globalData.userToken
      },
      success: function(res){
        if (res.data.errno) {
          if (2 == res.data.errno) {
            that.setData({boardinfo: res.data.data.boardinfo,
              ismember: false})
          } else {
            wx.showModal({
              'title': '错误',
              'content': res.data.error,
              'showCancel': false
            })
          }
        } else {
          wx.setNavigationBarTitle({
            title: res.data.data.ex.boardinfo.title
          })
          that.setData({boardinfo: res.data.data.ex.boardinfo,
            userlist: res.data.data.list,
            selectedTab: 'rank',
            ismember: true})
        }
      }
    })
  },
  loadDetail: function() {
    var that = this
    if (that.data.recordPage.next) {
      var boundary = that.data.recordPage.next_boundary
      wx.request({
        url: 'https://www.yuxiaoyan.cn/scoreboard/rest/record/',
        data: {
          'filter[boardid]': that.data.boardid,
          'ex_style': 'default',
          'page[boundary]': boundary
        },
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
            var recordList
            var recordUserinfos
            if (null == that.data.recordList) {
              recordList = res.data.data.list
              recordUserinfos = res.data.data.ex.userinfos 
            } else {
              recordList = that.data.recordList.concat(res.data.data.list)
              recordUserinfos = that.data.recordUserinfos
              for (var k in res.data.data.ex.userinfos) {
                recordUserinfos[k] = res.data.data.ex.userinfos[k]
              }
            }
            that.setData({
              recordList: recordList,
              recordUserinfos: recordUserinfos,
              recordPage: res.data.data.page
            })
          }
        }
      })
    }
  }
})
App({
  getUserInfo: function (cb) {
    let that = this;
    wx.login({
      success: function (j) {
        var js_code = j.code;
        wx.request({
          url: `${that.globalData.r_url}sign_in`,
          data: {
            js_code: js_code,
            app_id: `${that.globalData.app_id}`
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (data) {
            that.globalData.mstr = data.data.data.mstr;
            wx.setStorageSync('mstr', data.data.data.mstr);
          }
        });
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            typeof cb == "function" && cb(that.globalData.userInfo);
          }
        });
      }
    })
  },

  onLaunch: function () {
    // 读取mstr
    // 请求列表

    //调用应用实例的方法获取全局数据
    this.getUserInfo(function (userInfo) {
      //设置缓存
      wx.setStorageSync('userInfo', userInfo);
    });

  },

  globalData: {
    userInfo: null,
    app_id: '',
    r_url: ''
  },

 
})

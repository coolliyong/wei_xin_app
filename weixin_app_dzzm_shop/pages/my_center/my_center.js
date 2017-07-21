let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrearage: 0,
    unshipped: 0,
    shipped: 0,
    mstr: false,
    userinfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (user) {
        that.setData({
          userinfo: user.data
        });
      }
    });
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
    let that = this;
    //读取mstr
    wx.getStorage({
      key: 'mstr',
      success: function (res) {
        that.setData({
          mstr: res.data
        });
        // 请求等待付款
        wx.request({
          url: `${app.globalData.r_url}order_get_list`,
          data: {
            mstr: that.data.mstr,
            status: 100
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (d1) {
            if (d1.data) {
              let i1 = d1.data.data;
              // for (let x of i1) {
              //   console.log(x.status);
              // }
              // that.setData({
              //   arrearage: i1.length
              // });
            }
          }
        });
      }
    });

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
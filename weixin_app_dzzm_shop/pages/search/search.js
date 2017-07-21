var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mstr: false,
    r_url: app.globalData.r_url,
    search_val: '',
    search_list: '',
    not_data: false
  },

  search_input: function (e) {
    // 搜索框输入，双向绑定
    let that = this;
    let val = e.detail.value;
    that.setData({
      search_val: val
    });
  },
  moods_dateils: function (e) {
    // 商品详情
    let that = this;
    let i = e.currentTarget.dataset.index;//得到索引
    let spid = that.data.search_list[i].id;
    if (spid) {
      wx.navigateTo({
        url: `../dateils/dateils?id=${spid}`
      });
    }
  },
  search_btn: function () {
    wx.showLoading({
      title: '搜索中',
      mask: true,
    });
    let that = this;
    // 搜索请求
    let val = that.data.search_val;
    if (!val) {
      return false;
    }
    wx.request({
      url: `${that.data.r_url}goods_search`,
      data: {
        mstr: that.data.mstr,
        title: val
      },
      method: 'POST',
      success: function (data) {
        wx.hideLoading();
        console.log(data);
        if (data.data.data) {
          that.setData({
            search_list: data.data.data
          });
        } else {
          that.setData({
            not_data: true
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    //等待弹窗
    wx.showLoading({
      title: '搜索中',
      mask: true,
    });
    var that = this;
    // 读取mstr
    let val = o.val;
    console.log(val);
    wx.getStorage({
      key: 'mstr',
      success: function (data) {
        that.setData({
          mstr: data.data,
          search_val: val
        });
        // 搜索请求
        wx.request({
          url: `${that.data.r_url}goods_search`,
          data: {
            mstr: that.data.mstr,
            title: val
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (data) {
            wx.hideLoading();
            if (data.data.data) {
              that.setData({
                search_list: data.data.data
              });
            } else {
              that.setData({
                not_data: true
              });
            }
          }
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
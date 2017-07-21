var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mstr: 0,//mstr码
    tab_num: 0,  //tab索引
    list_sort_num: 1,  //排序
    banner: '', //头部banner图
    data_list: [], //主要数据
    r_url: app.globalData.r_url
  },
  shop_datails: function (e) {
    // 商品详情
    let that = this;
    let i = e.currentTarget.dataset.index;//得到索引
    let spid = that.data.data_list[i].id;
    wx.navigateTo({
      url: `../dateils/dateils?id=${spid}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取mstr
    var that = this;
    wx.getStorage({
      key: 'mstr',
      success: function (data) {
        that.setData({
          mstr: data.data
        });
        // 请求列表
        wx.request({
          url: `${app.globalData.r_url}goods_get_custom`,
          data: {
            mstr: that.data.mstr,
            popular: 1
          },
          method: 'POST',
          success: function (data) {
            console.log(data);
            let t = data.data.data.popular;
            let banner = app.globalData.r_url + t[0].thumb;
            if (t) {
              that.setData({
                data_list: t,
                banner: banner
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
    // 下拉到底的时候，继续请求更多数据
    let that = this;
    let i = that.data.tab_num;//索引
    let len = that.data.data_list.length;

    // 请求
    wx.request({
      url: `${app.globalData.r_url}goods_get_custom`,
      data: {
        mstr: that.data.mstr,
        page_popular: len,
        popular: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        console.log(data);
        let i = data.data.data.popular;
        console.log(i);
        let t = that.data.data_list;
        if (i.length) {
          for (let x of i) {
            t.push(x);
          }
          console.log(t);
          that.setData({
            data_list: t
          });
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
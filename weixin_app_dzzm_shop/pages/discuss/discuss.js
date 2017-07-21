var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mstr: 0,
    spid: null,
    spdata: null,
    r_url: app.globalData.r_url,
    sel_proto_data: [],
    protos: {},
    shop_num: 1,
    proto_num: null,
    data_show: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    // 读取mstr
    let that = this;
    let id = o.id;//得到传过来的参数
    wx.getStorage({//读取mstr缓存
      key: 'mstr',
      success: function (data) {
        that.setData({
          mstr: data.data,
          spid: id
        });
        // 请求
        wx.request({
          url: `${app.globalData.r_url}goods_get_this`,
          data: {
            mstr: that.data.mstr,
            goods_id: that.data.spid,
            show_comment: '1'
          },
          method: 'POST',
          success: function (data) {
            let d = data.data.data;  //json
            let t = d.param;//json属性
            let z = data.data.data.param;
            d.param = z;
            for (let x of z) {
              x.index = -1;
            }
            let pl = d.user_comments;

            for (let x of pl) {
              x.create_time = new Date(parseInt(x.create_time) * 1000);
              x.create_time = x.create_time.toLocaleDateString();
              let da = x.create_time.split("/");
              x.create_time = da[0] + '-' + da[1] + '-' + da[2];
            }
            d.user_comments = pl;

            that.setData({
              spdata: d,
              protos: {
                proto_main: z,
              }
            });
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
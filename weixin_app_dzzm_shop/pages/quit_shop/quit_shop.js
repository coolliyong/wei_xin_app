var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    discuss: false,//评价框显示
    sel_index: 0,
    mstr: 0,
    r_url: app.globalData.r_url,
    datalist_data: [],//订单数据
    discess: '',//退货
    discess_obj: ''
  },
  // 输入评论
  disuess_txt: function (e) {
    let that = this;
    console.log(e);
    let txt = e.detail.value;
    console.log(txt);
    that.setData({
      discess: txt
    });
  },
  // 提交退货
  submit_dis: function (e) {
    let that = this;
    setTimeout(function () {
      if (that.data.discess) {
        //等待弹窗
        wx.showLoading({
          title: '正在申请',
          mask: true,
        });
        let d = that.data.discess_obj;
        let u = that.data.userinfo;
        //请求退货
        wx.request({
          url: `${app.globalData.r_url}order_return`,
          data: {
            mstr: that.data.mstr,
            order_id: d.out_trade_no,
            refund_mess: that.data.discess
          },
          method: 'POST',
          success: function (data) {
            console.log(data);
            wx.hideLoading();
            if (data.data.status) {
              //模态框
              wx.showToast({
                title: '申请成功',
                mask: true,
                duration: 800
              });
              // 请求退货之后修改本条数据未处理中
              let del_id = d.id;
              let j = that.data.datalist_data;
              let t = [];
              for (let x of j) {
                if (del_id == x.id) {
                  x.status_refund = 1;
                }
                t.push(x);
              }
              that.setData({
                discuss: false,
                datalist_data: t
              });
            }
          }
        });
      } else {
        //确认弹窗
        wx.showModal({
          title: '请输入退货理由',
          showCancel: false,
          mask: true,
        });

      }
    }, 1000);
  },
  //评价框
  discuss: function (e) {
    let that = this;
    // 快递单号
    let i = e.currentTarget.dataset.index;
    let obj = that.data.datalist_data[i];
    let id = that.data.datalist_data[i].delivery_no;
    id ? id : id = '没有获得到快递id，请致电客服';
    that.setData({
      discuss: true,
      express_nums: id,
      discess_obj: obj
    });
  },
  // 关闭评价框
  close_discuss: function () {
    this.setData({
      discuss: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    let that = this;//this
    //读取缓存mstr
    wx.getStorage({
      key: 'mstr',
      success: function (res) {
        that.setData({
          mstr: res.data
        });
        // 请求已经确认收货
        wx.request({
          url: `${app.globalData.r_url}order_get_list`,
          data: {
            mstr: that.data.mstr,
            status: 22,
            goods: 1
          },
          method: 'POST',
          success: function (data) {
            if (data.data.data) {
              that.setData({
                datalist_data: data.data.data
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})
// 确认订单
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indent: {
      addr: {}
    },
    r_url: app.globalData.r_url,
    add_ress: 0,
    mstr: 0,
    cart_ids: 0,
    max_money: 0
  },

  sel_address: function () {
    // 点击选择地址
    wx.navigateTo({
      url: '../sel_address/sel_address',
    });
  },
  new_address: function () {
    // 新建选择地址
    wx.navigateTo({
      url: '../address_new/address_new',
    });
  },
  // 立即购买
  now_buy: function () {
    let that = this;
    let d = that.data.indent.addr;
    if (!d) {
      //确认弹窗
      wx.showModal({
        title: '请先创建地址',
        showCancel: false,
        mask: true
      });
      return false;
    }
    wx.showLoading({
      title: '正在支付……',
      mask: true
    });
    wx.request({
      url: `${app.globalData.r_url}order_create`,
      data: {
        mstr: that.data.mstr,
        pay_type: '2',
        cart_ids: that.data.cart_ids,
        addr_name: d.username,
        addr_mobile: d.mobile,
        addr_detail: d.detail,
        is_zhuoyue: true
      },
      method: 'POST',
      success: function (data) {
        wx.hideLoading();
        // console.log(data);
        //console.log(data.data.data.);
        if (data.data.status) {
          // 微信支付
          let timeStamp = data.data.data.timeStamp + "";
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': data.data.data.nonceStr,
            'package': data.data.data.package,
            'signType': data.data.data.signType,
            'paySign': data.data.data.paySign,
            'success': function (res) {
              console.log(data.data.data.paySign);
              console.log(res);
              wx.showModal({
                title: '支付成功',
                showCancel: false
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../my_order/my_order'
                });
              }, 500);
            },
            'fail': function (res) {
              console.log(data.data.data.paySign);
              console.log('失败');
              wx.showModal({
                title: '支付失败',
                showCancel: false,
                success: function (e) {
                  console.log('跳转');
                  wx.reLaunch({
                    url: '../index/index'
                  });
                }
              });
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 读取mstr
    var that = this;
    wx.getStorage({
      key: 'mstr',
      success: function (data) {
        that.setData({
          mstr: data.data
        });
      }
    });
    // 读取订单
    wx.getStorage({
      key: 'indent',
      success: function (data) {
        console.log(data);
        console.log(data.data);
        let i1 = data.data.data.freight_fee;
        let i2 = data.data.data.total_fee;
        console.log(`${i1},,${i2}`);
        let m = parseFloat(i1) + parseFloat(i2);
        m = m.toFixed(2);
        that.setData({
          max_money: m,
          indent: data.data.data
        });
      }
    });
    // 读取card_ids
    wx.getStorage({
      key: 'cart_ids',
      success: function (data) {
        that.setData({
          cart_ids: data.data
        });
      }
    });
    // 看是否是新建地址返回的
    wx.getStorage({
      key: 'address',
      success: function (add) {
        let d = that.data.indent;
        console.log(add);
        d.addr = {};
        if (add) {
          if (d.addr) {
            d.addr.username = add.data.name;//名字
            d.addr.detail = add.data.add_ress;//完整地址
            d.addr.mobile = add.data.phone;//电话
            that.setData({
              indent: d
            });
          }
        }
      }
    });
    // 读取，看是否选择了地址
    wx.getStorage({
      key: 'sel_add',
      success: function (res) {
        let data = res.data;
        let d = null;
        console.log(res);
        console.log(data);
        data.forEach(function (v) {
          if (v.is_default == '1') {
            d = v;
          }
        });
        if (d) {
          let v = that.data.indent;
          v.addr.username = d.username;
          v.addr.province = d.province;
          v.addr.city = d.city;
          v.addr.detail = d.detail;
          v.addr.mobile = d.mobile;
          that.setData({
            indent: v
          });
        }
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
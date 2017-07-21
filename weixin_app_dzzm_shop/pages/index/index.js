//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    list: 0,
    shop_list: [],
    r_url: app.globalData.r_url,
    mstr: false,
    proto_data: [],
    show_cars: false
  },
  goto_shopcar: function () {
    // 去购物车
    wx.switchTab({
      url: '../shop_car/shop_car'
    });
  },
  // 详情页
  dateild: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index; //当前索引
    let id = that.data.shop_list[i].id;; //当前id
    wx.navigateTo({
      url: `../dateils/dateils?id=${id}`
    })
  },
  // 添加到购物车
  add_shop_car: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index; //商品id
    let spid = that.data.shop_list[i].id; //id
    wx.navigateTo({
      url: `../dateils/dateils?id=${spid}`
    });
  },
  onLoad: function () {
    let that = this;
    let mstr = wx.getStorageSync('mstr');
    that.setData({
      mstr: mstr
    });
    // 首页请求数据
    wx.request({
      url: `${app.globalData.r_url}goods_get_custom`,
      data: {
        mstr: mstr,
        custom: "精品"
      },
      method: 'POST',
      success: function (data) {
        if (!data.data.data) {
          console.log('1');
          return false;
        }
        let t = null;
        let z = null;
        let proto_num = 0; //第几个属性
        let d = data.data.data.custom;  //json
        let protos = [];
        // 遍历属性，读取属性。
        if (!d) {
          return false;
        }
        for (let x of d) {
          t = x.param;
          protos.push(t);
        }
        that.setData({
          shop_list: d,
          proto_data: protos
        });

      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 下拉到底的时候，继续请求更多数据
    let i = that.data.shop_list.length;
    // 请求分类下的人气推荐
    wx.request({
      url: `${app.globalData.r_url}goods_get_custom`,
      data: {
        mstr: that.data.mstr,
        custom: 1,
        page_custom: i
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (d4) {
        let now = that.data.shop_list;
        if (d4.data.data) {
          let n = d4.data.data.custom;
          n.forEach(function (v) {
            now.push(v);
          });
          that.setData({
            shop_list: now
          });
        }

      }
    });
  },
  onShow: function () {
    let that = this;
    // 请求购物车
    wx.request({
      url: `${app.globalData.r_url}cart_get`,
      data: {
        mstr: that.data.mstr
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        if (data.data.data) {
          that.setData({
            show_cars: true
          });
        }
      }
    });
  }
})

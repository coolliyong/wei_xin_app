var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mstr: 0,//mstr码
    tab_num: 0,  //tab索引
    list_sort_num: 0,  //排序
    banner: '', //头部banner图
    data_list: [], //主要数据
    r_url: app.globalData.r_url
  },
  //tab切换
  tab_sel: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;//索引
    if (i == 0) {
      if (that.data.tab_num == 0) {
        return false;
      }
      // 请求销量
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          sales: 1
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          let i = data.data.data.popular;
          if (i) {
            that.setData({
              data_list: i
            });
          }
        }
      });
    } else if (i == 1) {
      let sort_num = that.data.list_sort_num;//排序Num
      // 请求价格
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          price: 1,
          sort_price: that.data.list_sort_num
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (sort_num == 1) {
            sort_num = 0;
          } else {
            sort_num = 1;
          }
          let i = data.data.data.price;
          if (i) {
            console.log(sort_num);
            that.setData({
              data_list: i,
              list_sort_num: sort_num
            });
          }
        }
      });
    } else if (i == 2) {
      if (that.data.tab_num == 2) {
        return false;
      }
      // 请求价格
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          newest: 1,
          sort_newest: that.data.list_sort_num
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (data) {
          let i = data.data.data.newest;
          if (i) {
            that.setData({
              data_list: i
            });
          }
        }
      });
    }
    that.setData({
      tab_num: i
    });
  },
  shop_datails: function (e) {
    // 商品详情
    let that = this;
    let i = e.currentTarget.dataset.index;//得到索引
    console.log(that.data.data_list);
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
            sales: 1,
            sort_sales: that.data.list_sort_num
          },
          method: 'POST',
          success: function (data) {
            console.log(data);
            let t = data.data.data.popular;
            console.log(t);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 下拉到底的时候，继续请求更多数据
    let that = this;
    let i = that.data.tab_num;//索引
    let len = that.data.data_list.length;
    if (i == 0) {
      // 请求销量
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          sales: 1,
          page_sales: len,
          sort_sales: '0'
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          let t = data.data.data.popular;
          let d = that.data.data_list;
          if (t) {
            t = t.concat(d);
            that.setData({
              data_list: t
            });
          }
        }
      });
    } else if (i == 1) {
      let sort_num = that.data.list_sort_num;//排序Num
      // 请求价格
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          price: 1,
          sort_price: sort_num,
          page_price: len

        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          let t = data.data.data.price;
          let d = that.data.data_list;
          if (t) {
            t = t.concat(d);
            that.setData({
              data_list: t
            });
          }
        }
      });
    } else if (i == 2) {
      // 请求最新
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          newest: 1,
          page_newest: len
        },
        method: 'POST',
        success: function (data) {
          let t = data.data.data.newest;
          let d = that.data.data_list;
          if (t) {
            t = t.concat(d);
            that.setData({
              data_list: t
            });
          }
        }
      });
    }
  }
})
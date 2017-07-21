var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tab切换显示数组
    tabList: ["推荐"],
    tab_id: [],
    tabListIndex: 0,
    tabMain: [false, true, true, true],
    r_url: app.globalData.r_url,
    //新品上市数据
    new_product: [],
    banners: [],
    // 人气推荐数据
    moods: '',
    mstr: false,
    show_cars: false,
    search_val: ''
  },
  recommend_page: function () {
    // 人气推荐
    wx.navigateTo({
      url: '../recommend/recommend'
    });
  },
  new_arrival: function () {
    // 新品上市
    wx.navigateTo({
      url: '../new_arrival/new_arrival'
    });
  },
  search_input: function (e) {
    // 搜索框输入，双向绑定
    let that = this;
    let val = e.detail.value;
    that.setData({
      search_val: val
    });
  },
  search_btn: function () {
    // 搜索
    let that = this;
    if (!that.data.search_val) {
      return false;
    }
    wx.navigateTo({
      url: `../search/search?val=${that.data.search_val}`
    });
  },
  goto_shopcar: function () {
    // 去购物车
    wx.switchTab({
      url: '../shop_car/shop_car'
    });
  },
  //tab切换
  tab_sel: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;//索引
    console.log(i);
    that.setData({
      tabListIndex: i
    });
    that.setData({
      moods: []
    });
    // 请求不同tab下的人气推荐
    if (i) {
      let page_id = that.data.tab_id[i];
      // 请求分类下的人气推荐
      wx.request({
        url: `${app.globalData.r_url}goods_get_list`,
        data: {
          mstr: that.data.mstr,
          category_id: page_id
        },
        method: 'POST',
        success: function (d3) {
          console.log(d3);
          that.setData({
            moods: d3.data.data
          });
        }
      });

      // 请求轮播图
      wx.request({
        url: `${app.globalData.r_url}order_get_bananer`,
        data: {
          mstr: that.data.mstr
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          let t = res.data.data;
          let banners = [];
          banners.push(app.globalData.r_url + t[i - 1].img);
          that.setData({
            banners: banners
          });
        }
      });
    }
    else {
      // 请求分类下的人气推荐
      wx.request({
        url: `${app.globalData.r_url}goods_get_custom`,
        data: {
          mstr: that.data.mstr,
          popular: 1,
        },
        method: 'POST',
        success: function (d3) {
          console.log(d3);
          if (d3.data.status) {
            let t = d3.data.data.popular;
            let banners = [];
            console.log(t);
            if (t.length > 2) {
              banners.push(app.globalData.r_url + t[0].thumb);
              banners.push(app.globalData.r_url + t[1].thumb);
            } else {
              banners.push(app.globalData.r_url + t[0].thumb);
            }
            that.setData({
              moods: t,
              banners: banners
            });
          }
        }
      });
    }



  },
  // 人气推荐详情
  moods_dateils: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;//得到索引
    let spid = that.data.moods[i].id;
    wx.navigateTo({
      url: `../dateils/dateils?id=${spid}`
    });
  },
  new_dateils: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;//得到索引
    let spid = that.data.new_product[i].id;
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
          url: `${app.globalData.r_url}goods_get_category`,
          data: {
            mstr: that.data.mstr
          },
          method: 'POST',
          success: function (data) {
            console.log(data.data.data);
            let t = data.data.data.category;
            let title = [];
            let ids = [];
            let v = null;
            let num = 0;
            for (v of t) {
              if (num === 0) {
                title.push('推荐');
                ids.push(v.id);
              }
              num++;
              title.push(v.title);
              ids.push(v.id);
            }
            // 写入title,ids数据
            that.setData({
              tabList: title,
              tab_id: ids
            });
            // 请求分类下的新品
            wx.request({
              url: `${app.globalData.r_url}goods_get_custom`,
              data: {
                mstr: that.data.mstr,
                newest: 1,
                numbs: 3
              },
              method: 'POST',
              success: function (d2) {
                console.log(d2);
                let t = d2.data.data.newest;
                let banners = [];
                console.log(t);
                if (t.length > 2) {
                  banners.push(app.globalData.r_url + t[0].thumb);
                  banners.push(app.globalData.r_url + t[1].thumb);
                } else {
                  banners.push(app.globalData.r_url + t[0].thumb);
                }

                that.setData({
                  new_product: d2.data.data.newest,
                  banners: banners
                });
              }
            });

            // 请求分类下的人气推荐
            wx.request({
              url: `${app.globalData.r_url}goods_get_custom`,
              data: {
                mstr: that.data.mstr,
                popular: 1,
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (d3) {
                console.log(d3);
                that.setData({
                  moods: d3.data.data.popular
                });
              }
            });
            // 请求购物车
            wx.request({
              url: `${app.globalData.r_url}cart_get`,
              data: {
                mstr: that.data.mstr
              },
              method: 'POST',
              success: function (data) {
                if (data.data.data) {
                  that.setData({
                    show_cars: true
                  });
                }
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
    let that = this;
    // 请求购物车
    wx.request({
      url: `${app.globalData.r_url}cart_get`,
      data: {
        mstr: that.data.mstr
      },
      method: 'POST',
      success: function (data) {
        if (data.data.data) {
          that.setData({
            show_cars: true
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
    var that = this;
    // 下拉到底的时候，继续请求更多数据
    let i = that.data.moods.length;
    // 请求分类下的人气推荐
    if (!i) {
      return false;
    }
    wx.request({
      url: `${app.globalData.r_url}goods_get_custom`,
      data: {
        mstr: that.data.mstr,
        popular: 1,
        page_popular: i
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          let t = res.data.data.popular;
          let d = that.data.moods;
          if (t.length) {
            d = d.concat(t);
            that.setData({
              moods: d
            });
          } else {
            return false;
          }
        } else {
          return false;
        }
        // that.setData({
        //   moods: d3.data.data.popular
        // });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
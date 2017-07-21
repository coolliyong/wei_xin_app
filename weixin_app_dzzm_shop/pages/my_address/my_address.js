var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sel: false,
    mstr: 0,
    addr_list: [],
    defaule: 0
  },
  del_fn: function (e) {
    //确认弹窗
    let that = this;
    wx.showModal({
      title: '确认删除',
      mask: true,
      success: function (res) {
        if (res.confirm) {
          // 删除地址
          let i = e.currentTarget.dataset.index;
          let d = that.data.addr_list[i];
          // 删除地址请求
          wx.request({
            url: `${app.globalData.r_url}addr_del`,
            data: {
              mstr: that.data.mstr,
              addr_id: d.id,
              sign_code: d.sign_code,
              sign_time: d.sign_time
            },
            method: 'POST',
            success: function (data) {
              if (data.data.status) {
                wx.showToast({
                  title: '删除成功',
                  mask: true
                });
                let t = [];
                let date = that.data.addr_list;
                // data[i].
                let t_num = -1;
                for (let x of date) {
                  t_num++;
                  if (t_num != i) {
                    t.push(x);
                  }
                }
                that.setData({
                  addr_list: t
                });
              }
            }
          });
        } else if (res.cancel) {
          return false;
        }
      }
    });

  },
  edit_fn: function (e) {
    let that = this;
    // 编辑地址
    let i = e.currentTarget.dataset.index;
    let d = that.data.addr_list[i];
    wx.setStorageSync('addedit', d);
    //保存生命周期跳转
    wx.navigateTo({
      url: '../address_edit/address_edit?actoin=edit'
    });
  },
  // 选择即设置默认
  sel_add: function (e) {
    var that = this;
    let m = 0;
    let i = e.currentTarget.dataset.index;
    let add = that.data.addr_list;
    let t = that.data.addr_list[i];
    // 保存设置为默认
    wx.request({
      url: `${app.globalData.r_url}addr_mod`,
      data: {
        addr_id: t.id,
        mstr: that.data.mstr,
        username: t.username,
        mobile: t.mobile,
        province: t.province,
        city: t.city,
        area: t.area,
        detail: t.detail,
        is_default: 1,
        sign_time: t.sign_time,
        sign_code: t.sign_code
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        // 如果成功
        if (data.data.status) {
          add.forEach(function (v) {
            v.is_default = 0;
          });
          add[i].is_default = 1;
          that.setData({
            addr_list: add
          });
        } else {
          return false;
        }
      }
    });


  },
  // 新增地址
  new_add: function () {
    wx.navigateTo({
      url: '../address_new/address_new'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'mstr',
      success: function (res) {
        that.setData({
          mstr: res.data
        });
        // 请求
        wx.request({
          url: `${app.globalData.r_url}addr_get`,
          data: {
            mstr: that.data.mstr,
          },
          method: 'POST',
          success: function (data) {
            console.log(data);
            if (!data.data.data) {
              return false;
            }
            let t = data.data.data;
            let z = -1;
            for (let x of t) {
              z++;
              if (x.is_default == 1) {
                let defaule = z;
              }
            }
            that.setData({
              addr_list: t,
              defaule: z
            });
            let m = 0;
            that.data.addr_list.forEach(function (v) {
              m = parseInt(v.is_default);
              console.log(m);
              that.setData({
                'v.is_default': m
              });
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
    wx.getStorage({
      key: 'mstr',
      success: function (res) {
        that.setData({
          mstr: res.data
        });
        // 请求
        wx.request({
          url: `${app.globalData.r_url}addr_get`,
          data: {
            mstr: that.data.mstr,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (data) {
            if (!data.data.data) {
              return false;
            }
            console.log(data);
            that.setData({
              addr_list: data.data.data
            });
            let m = 0;
            that.data.addr_list.forEach(function (v) {
              m = parseInt(v.is_default);
              console.log(m);
              that.setData({
                'v.is_default': m
              });
            });
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
    var that = this;
    wx.setStorageSync('sel_add', that.data.addr_list);
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
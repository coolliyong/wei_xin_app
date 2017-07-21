var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mstr: false,
    data_list: [],
    r_url: app.globalData.r_url
  },
  del_favorite: function (e) {
    // 取消收藏
    let that = this;

    //确认弹窗
    wx.showModal({
      title: '',
      content: '确认是否删除',
      showCancel: true,
      mask: true,
      success: function (res) {
        if (res.confirm) {
          let i = e.currentTarget.dataset.index;
          console.log(i);
          let id = that.data.data_list[i].id;
          let d = that.data.data_list;
          wx.request({
            url: `${app.globalData.r_url}goods_del_collect`,
            data: {
              mstr: that.data.mstr,
              comment_id: id
            },
            method: 'POST',
            success: function (data) {
              console.log(data);
              if (data.data.status) {
                let d = that.data.data_list;
                let t = [];
                let x = null;
                let s = 0;
                for (x of d) {
                  if (s !== i) {
                    t.push(x);
                  }
                  s++;
                }
                that.setData({
                  data_list: t
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
    let that = this;
    wx.getStorage({
      key: 'mstr',
      success: function (data) {
        that.setData({
          mstr: data.data
        });
        // 请求收藏
        wx.request({
          url: `${app.globalData.r_url}goods_get_collect`,
          data: {
            mstr: that.data.mstr
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (data) {
            console.log(data);
            if (data.data.data) {
              that.setData({
                data_list: data.data.data
              });
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
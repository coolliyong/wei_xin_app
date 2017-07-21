var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    titles: ['全部', '待付款', '待发货', '待收货', '待评价'],
    discuss: false,//评价框显示
    sel_index: 0,
    mstr: 0,
    r_url: app.globalData.r_url,
    datalist_data: [],//订单数据
    express_nums: 0,//订单号
    discess: '',//评论
    discess_obj: '',
    userinfo: []//用户信息
  },
  // 再次购买
  two_buy: function (e) {
    wx.switchTab({
      url: '../shop_main/shop_main'
    });
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
  // 确认收货
  affirm: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;

    let id = that.data.datalist_data[i].out_trade_no;
    wx.showModal({
      title: '确认是否收货',
      mask: true,
      success: function (res) {
        if (res.confirm) {
          //请求
          wx.request({
            url: `${app.globalData.r_url}order_confirm_receipt`,
            data: {
              mstr: that.data.mstr,
              order_id: id
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (data) {
              console.log(data);
              if (data.data.status) {
                //模态框
                wx.showToast({
                  title: '收货成功',
                  mask: true,
                  duration: 800
                });
                let d = that.data.datalist_data;
                let z = -1;
                let t = [];
                for (let x of d) {
                  z++;
                  if (z == i) {
                    x.status_confirm = 3;
                  }
                  t.push(x);
                }
                that.setData({
                  datalist_data: t
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  // 快递单号
  express_num: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let id = that.data.datalist_data[i].delivery_no;
    id ? id : id = '';
    let express = that.data.datalist_data[i].delivery_name;  //物流
    express ? express : express = '没获取到物流信息,详细请致电客服';
    //快递号弹窗
    wx.showModal({
      title: '',
      content: `您的物流为:${express},单号:${id}`,
      showCancel: false,
      mask: true
    });
  },
  // 提交评论
  submit_dis: function (e) {
    let that = this;
    setTimeout(function () {
      if (that.data.discess) {
        //等待弹窗
        wx.showLoading({
          title: '正在评论',
          mask: true,
        });
        let d = that.data.discess_obj;
        let u = that.data.userinfo;
        //请求增加评论
        wx.request({
          url: `${app.globalData.r_url}goods_add_comment`,
          data: {
            mstr: that.data.mstr,
            id: d.id,       //订单商品表ID 
            goods_id: d.goods_id,//商品ID 
            sign_code: d.sign_code,     //签名
            sign_time: d.sign_time,//签名时间 
            username: u.nickName,             // 用户名
            avatarurl: u.avatarUrl,         //头像
            title: d.title,                //商品标题
            thumb: d.thumb,                 //商品缩略图
            content: that.data.discess             //评论内容
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (data) {
            console.log(data);
            wx.hideLoading();
            if (data.data.status) {
              //模态框
              wx.showToast({
                title: '评论成功',
                mask: true,
                duration: 800
              });
              // 评论成功之后删除本条待评论数据
              let del_id = d.id;
              let j = that.data.datalist_data;
              let t = [];
              for (let x of j) {
                if (del_id != x.id) {
                  t.push(x);
                }
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
          title: '请输入评论内容',
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
    console.log(i);
    let obj = that.data.datalist_data[i];
    let id = that.data.datalist_data[i].order_id;
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
  // 继续购买，，购买未完成的
  continue_buy: function (e) {
    let that = this;
    //继续购买 未购买完成的商品 order_pay_non_payment
    let i = e.currentTarget.dataset.index;
    let id = that.data.datalist_data[i].id;
    wx.showModal({
      title: '是否重新购买',
      mask: true,
      success: function (res) {
        if (res.confirm) {
          //请求
          wx.request({
            url: `${app.globalData.r_url}order_pay_non_payment`,
            data: {
              mstr: that.data.mstr,
              id: id
            },
            method: 'POST',
            success: function (data) {
              console.log(data);
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
                    console.log(res);
                    wx.showModal({
                      title: '支付失败',
                      showCancel: false
                    });
                  }
                })
              }
            }
          });
        } else if (res.cancel) {
          return false;
        }
      }
    });
  },
  // tab切换
  sel: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    if (i == that.data.sel_index) {
      return false;
    }
    that.setData({
      sel_index: i,
      datalist_data: []
    });
    let num = 100;
    if (i == 0) {
      num = 100;
    } else if (i == 1) {
      num = 1;
    }
    else if (i == 2) {
      num = 20; //已经发货，暂未ok
    } else if (i == 3) {
      num = 21;
    } else if (i == 4) {
      //待评价
      wx.request({
        url: `${app.globalData.r_url}order_get_non_comment`,
        data: {
          mstr: that.data.mstr
        },
        method: 'POST',
        success: function (data) {
          console.log(data);
          if (data.data.data) {
            let t = data.data.data;
            that.setData({
              datalist_data: data.data.data,
              sel_index: i
            });
          }
        }
      });
      return false;
    } else {
      num = 100
    }
    wx.request({
      url: `${app.globalData.r_url}order_get_list`,
      data: {
        mstr: that.data.mstr,
        status: num,
        goods: 1
      },
      method: 'POST',
      success: function (data) {
        console.log(data);
        if (data.data.data) {
          let t = data.data.data;
          let d = [];
          let status = 0;
          if (num == 1) {  //1：等待付款 20：待发货，21：待收货
            for (let x of t) {
              console.log('等待付款');
              console.log(x);
              if (x.status == 1) {
                d.push(x);
              }
            }
          } else if (num == 20) {
            console.log('待发货');
            for (let x of t) {
              console.log(x);
              if (x.status == 4 && x.status_confirm == 1) {
                d.push(x);
              }
            }
          } else if (num == 21) {
            console.log('待收货');
            for (let x of t) {
              console.log(x);
              if (x.status == 4 && x.status_confirm == 2) {
                d.push(x);
              }
            }
          } else if (num == 100) {
            d = t;
          }
          that.setData({
            datalist_data: d,
            sel_index: i
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    let i = o.classes;//穿的参数
    let that = this;//this
    console.log(that.data.r_url);

    //读取缓存mstr
    wx.getStorage({
      key: 'mstr',
      success: function (res) {
        that.setData({
          mstr: res.data,
          sel_index: i
        });
        //读取缓存userinfo
        wx.getStorage({
          key: 'userInfo',
          success: function (res) {
            that.setData({
              userinfo: res.data
            });
          }
        });
        let num = 100;
        if (i) {
          if (i == 0) {
            num = 100;  //全部
          } else if (i == 1) {
            num = 1;//代付款
          }
          else if (i == 2) {
            num = 20; //代发货~~~~~~~~~~~~~~~~~
          } else if (i == 3) {
            num = 21; //待收货
          } else if (i == 4) {
            //待评价
            wx.request({
              url: `${app.globalData.r_url}order_get_non_comment`,
              data: {
                mstr: that.data.mstr
              },
              method: 'POST',
              success: function (data) {
                console.log(data);
                if (data.data.data) {

                  that.setData({
                    datalist_data: data.data.data,
                    sel_index: i
                  });
                }
              }
            });
            return false;
          } else {
            num = 100
          }
          wx.request({
            url: `${app.globalData.r_url}order_get_list`,
            data: {
              mstr: that.data.mstr,
              status: num,
              goods: 1
            },
            method: 'POST',
            success: function (data) {
              console.log(data);
              if (data.data.data) {
                let t = data.data.data;
                let d = [];
                let status = 0;
                if (num == 1) {  //1：等待付款 20：待发货，21：待收货
                  for (let x of t) {
                    console.log('等待付款');
                    console.log(x);
                    if (x.status == 1) {
                      d.push(x);
                    }
                  }
                } else if (num == 20) {
                  console.log('待发货');
                  console.log(x);
                  for (let x of t) {
                    if (x.status == 4 && x.status_confirm == 1) {
                      d.push(x);
                    }
                  }
                } else if (num == 21) {
                  console.log('待收货');
                  console.log(x);
                  for (let x of t) {
                    if (x.status == 4 && x.status_confirm == 2) {
                      d.push(x);
                    }
                  }
                }
                console.log(d);
                that.setData({
                  datalist_data: d,
                  sel_index: i
                });
              }
            }
          });
        } else {
          // 否则请求全部订单
          wx.request({
            url: `${app.globalData.r_url}order_get_list`,
            data: {
              mstr: that.data.mstr,
              status: 100,
              goods: 1
            },
            method: 'POST',
            success: function (data) {
              if (data.data.data) {

                that.setData({
                  datalist_data: data.data.data,
                  sel_index: 0
                });
              }
            }
          });
        }
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
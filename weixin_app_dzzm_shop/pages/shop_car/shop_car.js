// 购物车
var app = getApp();
Page({

  data: {
    r_url: app.globalData.r_url,//请求url
    cars: [],               //购物车数据,
    all_sel: true,          //全选,
    sel: [],                //选中个数
    max_money: 0,//总价 
    max_num: 0,//总数
    mstr: 0
  },
  // 删除购物车
  del_shop_car: function (e) {
    let that = this;
    //确认弹窗
    wx.showModal({
      title: '确认删除',
      mask: true,
      success: function (res) {
        if (res.confirm) {
          //等待弹窗
          wx.showLoading({
            title: '正在删除',
            mask: true,
          });
          let i = e.currentTarget.dataset.index;
          let d = that.data.cars;
          let id = d[i].id;
          //请求
          wx.request({
            url: `${app.globalData.r_url}cart_del`,
            data: {
              mstr: that.data.mstr,
              cart_id: id
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (data) {
              if (data.data.status) {
                //模态框
                wx.hideToast();
                wx.showToast({
                  title: '删除成功',
                  mask: true,
                  duration: 800
                });
                if (d.length) {
                  let z = -1;        //循环索引
                  let t = [];       //购物车临时数据
                  let m = 0;        //单价    
                  let n = 0;        //数量
                  let max_n = 0;    //总价
                  let max = 0;      //总数
                  let sel = [];     //全选
                  for (let x of d) {
                    z++;
                    if (z != i) {
                      t.push(x);
                    }
                  }
                  // 循环sel
                  let s = that.data.sel;
                  let s_t = [];
                  z = -1;
                  if (s.length) {
                    for (let x of s) {
                      z++;
                      if (z != i) {
                        s_t.push(false);
                      }
                    }
                  }
                  max = max.toFixed(2);
                  that.setData({
                    cars: t,
                    sel: s_t,
                    max_money: 0,
                    max_num: 0,
                    all_sel: false
                  });
                  if (d.length - 1 == 0) {
                    console.log('数据为空');

                  }
                }
              } else {
                wx.hideLoading();
                //确认弹窗
                wx.showModal({
                  title: '删除失败，请重试',
                  showCancel: false,
                  mask: true
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
  // 全选和 非全乡
  sel_all: function () {
    console.log('all_sel');
    let that = this;
    let s = that.data.all_sel;
    let t = !s;
    let sel = [];
    let m = 0; //单价
    let n = 0;  //单数
    let max = 0;//总价
    let max_n = 0; //总数
    if (t) {
      for (var i = 0; i < that.data.sel.length; i++) {
        sel.push(true);
        m = Number(that.data.cars[i].total_fee);
        n = Number(that.data.cars[i].numbs);
        max += m * n;  //总价 
        max_n += n; //总数
      }
    } else {
      for (var i = 0; i < that.data.sel.length; i++) {
        sel.push(false);
        m = 0;
        n = 0;
        max += m * n;  //总价 
        max_n += n; //总数
      }
    };
    max = max.toFixed(2);
    that.setData({
      all_sel: t,
      sel: sel,
      max_money: max,
      max_num: max_n
    });

  },
  // 单选
  a_sel: function (event) {
    let that = this;
    let i = event.currentTarget.dataset.index; //索引
    let sel = that.data.sel;                   //选择
    sel[i] = !sel[i];
    // 遍历得到 所有为true的，把为true 的属性 和价格
    let m = 0;//价格
    let n = 0;//数量
    let max = 0; //总价
    let max_n = 0; //总数
    let d = that.data.cars;
    let s_i = 0;
    let all_sel = false;
    // 遍历得到 所有为true的，把为true 的属性 和价格
    let z = -1;
    for (let x of sel) {
      z++; //索引
      if (x) {
        s_i++;//选中个数
        m = parseFloat(d[z].total_fee);
        n = parseInt(d[z].numbs);
        max += m * n;  //总价 
        max_n += n; //总数
      }
    }
    max = max.toFixed(2);
    if (s_i == sel.length) {
      all_sel = true;
    } else {
      all_sel = false;
    }
    that.setData({
      sel: sel,
      all_sel: true,
      max_money: max,
      max_num: max_n,
      all_sel: all_sel
    });
  },
  // 结算 
  buy: function () {
    let that = this;
    // 得到选中商品id
    let cart_ids = '';
    that.data.sel.forEach(function (v, k) {
      if (v) {
        cart_ids += that.data.cars[k].id + ',';
      }
    });
    if (!cart_ids) {
      wx.showModal({
        title: '您没有选中商品',
        mask: true,
        showCancel: false
      });
      return false;
    }
    cart_ids = cart_ids.substr(0, cart_ids.length - 1);
    wx.showLoading({
      title: '订单生成中……',
      mask: true
    });
    // 请求结算
    wx.request({
      url: `${app.globalData.r_url}order_confirm`,
      data: {
        mstr: that.data.mstr,
        cart_ids: cart_ids,
        is_zhuoyue: true
      },
      method: 'POST',
      success: function (data) {
        wx.hideLoading();
        if (data.data.status) {
          wx.setStorageSync('indent', data.data);
          wx.setStorageSync('cart_ids', cart_ids);
          wx.navigateTo({
            url: '../confirm/confirm'
          });
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
        // 请求购物车
        wx.request({
          url: `${app.globalData.r_url}cart_get`,
          data: {
            mstr: that.data.mstr
          },
          method: 'POST',
          success: function (data) {
            let d = data.data.data;
            if (!d) {
              console.log('没有购物车数据');
              return false;
            }
            // for (let x in d) {
            //   if (d[x].param) {
            //     console.log(`单价:${d[x].price},属性价:${d[x].param.price}`);
            //     d[x].price = parseFloat(d[x].price) + parseFloat(d[x].param.price);
            //   }
            // }
            that.setData({
              cars: d
            });
            let sel = that.data.sel;
            sel = [];
            let money = 0;
            let num = 0;
            let zz = 0;
            for (let x of d) {
              zz = parseFloat(x.total_fee);
              zz = zz * x.numbs;
              money += zz;
              num += parseInt(x.numbs);
              sel.push(true);
            }
            money = money.toFixed(2);
            that.setData({
              sel: sel,
              max_money: money,
              max_num: num,
              all_sel: true
            });
          }
        });
      }
    });
  }

})
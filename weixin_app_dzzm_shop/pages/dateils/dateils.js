// 引入wxParse
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mstr: 0,
    spid: null,
    is_collect: false,
    r_url: app.globalData.r_url,
    sel_proto_data: [],
    protos: {},
    shop_num: 1,
    proto_num: null,
    data_show: false,
    content: '',  //详情内容
    banners: [],
    sel_proto: -1,
    money: 0,              //最终价格
    add_money: 0,         //属性价格
  },
  // 显示属性
  show_proto: function () {
    let that = this;
    let d = !that.data.data_show;
    that.setData({
      data_show: d
    });
  },
  // 跳转到评论页面
  look_discuss: function () {
    let that = this;
    wx.navigateTo({
      url: `../discuss/discuss?id=${that.data.spid}`
    });
  },
  // 收藏和取消收藏
  add_collect: function (e) {
    // 添加到收藏 
    let that = this;
    let id = that.data.spid;
    let collect = that.data.is_colllect;  //是否收藏    
    let collect_id = that.data.colllect_id; // 收藏id
    if (!collect) {
      // 如果为假，天假到收藏
      wx.request({
        url: `${app.globalData.r_url}goods_add_collect`,
        data: {
          mstr: that.data.mstr,
          goods_id: id,
          sign_time: that.data.shop_data.sign_time
        },
        method: 'POST',
        success: function (data) {
          if (data.data.status) {
            // 模态框
            wx.showToast({
              title: '已收藏',
              icon: 'success',
              duration: 2000,
              mask: true
            });
            that.setData({
              colllect_id: data.data.data.collect_id,
              is_colllect: 1
            });

          } else {
            wx.showToast({
              title: '收藏失败',
              icon: 'loading',
              duration: 2000,
              mask: true
            });
          }
        }
      });
    } else {
      // 取消收藏
      wx.request({
        url: `${app.globalData.r_url}goods_del_collect`,
        data: {
          mstr: that.data.mstr,
          comment_id: collect_id
        },
        method: 'POST',
        success: function (data) {
          if (data.data.status) {
            // 模态框
            wx.showToast({
              title: '已经取消收藏',
              icon: 'success',
              duration: 2000,
              mask: true
            });

            that.setData({
              colllect_id: 0,
              is_colllect: 0
            });
          } else {
            wx.showToast({
              title: '取消失败',
              icon: 'loading',
              duration: 2000,
              mask: true
            });
          }
        }
      });
    }
  },

  // 大图预览
  lock_banner: function () {
    let banner = this.data.shop_data.imgs;
    let banner_2 = [];
    for (let x of banner) {
      banner_2.push(this.data.r_url + x);
    }
    wx.previewImage({
      urls: banner_2 // 需要预览的图片http链接列表
    });
  },
  // 加入购物车
  add_shop_car: function (e) {
    let that = this;
    let action = e.currentTarget.dataset.action;    //判断是购买还是 添加到购物车  0购物车  1 立即购买
    let param = that.data.param;          //商品属性
    let spid = that.data.spid;            //id
    let proto_id = '';                    //属性id
    let temp_num = -1;                    //循环次数
    if (param.length) {
      for (let x of param) {
        temp_num++;
        if (x.is_sel > -1) {
          if (temp_num > 0) {
            proto_id += ',' + parseFloat(x.children[x.is_sel].id);
          } else {
            proto_id += parseFloat(x.children[x.is_sel].id);
          }
        } else {
          wx.showToast({
            icon: 'loading',
            title: '请选择属性',
            mask: true,
            duration: 800
          });
          return false;
        }
      }
    } else {
      proto_id = 0;
    }
    // 请求
    wx.request({
      url: `${app.globalData.r_url}cart_add`,
      data: {
        mstr: that.data.mstr,
        goods_id: spid,
        param: proto_id,
        numbs: that.data.shop_num
      },
      method: 'POST',
      success: function (data) {
        if (data.data.status) {
          if (action) {
            wx.switchTab({
              url: '../shop_car/shop_car'
            });
            return false;
          }
          // 模态框
          wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 2000,
            mask: true
          });
        } else {
          // 模态框
          wx.showToast({
            title: '加入失败',
            icon: 'success',
            duration: 2000,
            mask: true
          });
        }
      }
    });

  },

  // 到购物车
  goto_shop_car: function () {
    wx.switchTab({
      url: '../shop_car/shop_car'
    });
  },
  // 购买数量+-
  shop_number: function (e) {
    let that = this;
    let edit = e.target.dataset.edit;//得到两个索引+
    let num = that.data.shop_num;
    if (edit == '1') {
      num++;
    } else {
      if (num > 1) {
        num--;
      }
    }
    that.setData({
      shop_num: num
    });
  },
  // 选择属性
  sel_proto: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;//得到索引

    let param = that.data.param;

    index = index.split(",");
    let i1 = parseInt(index[0]);   //i1   左边标题
    let i2 = parseInt(index[1]);   // i2  右边实际属性

    if (param[i1].is_sel != i2) {
      param[i1].is_sel = i2;
    } else {
      param[i1].is_sel = -1;
    }
    let money = that.data.shop_data.price;  //原价
    let proto_money = 0;                      //属性价格
    for (let x of param) {
      if (x.is_sel > -1) {
        proto_money += parseFloat(x.children[x.is_sel].price);
      }
    }

    that.setData({
      param: param,
      money: parseFloat(money) + proto_money
    });

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
        wx.request({
          // url: `${app.globalData.r_url}goods_get_this`, goods/getGoods
          url: `${app.globalData.r_url}api/goods/getGoods`,
          data: {
            mstr: that.data.mstr,
            goods_id: id,
            show_attr: 1,
            show_collect: 1,
            show_comment: 1
          },
          method: 'POST',
          success: function (data) {
            if (!data.data.status) {
              //等待弹窗
              wx.showLoading({
                title: '错误',
                icon: 'loading',
                mask: true,
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 800);
            }
            if (data.data.status) {
              let is_colllect = data.data.data.is_collect; //是否收藏
              let collect_id = data.data.data.collect_id; // 收藏id
              let t = data.data.data.goods;             //商品详情
              let param = data.data.data.goods_attr;    //商品属性
              let discuss = data.data.data.user_comment;//总评论

              for (let x of param) {
                x.is_sel = -1;
              }

              let show_discuss = [];                      //现有评论
              if (discuss.length >= 2) {
                show_discuss.push(discuss[0]);
                show_discuss.push(discuss[1]);
              } else if (discuss.length >= 1) {
                show_discuss.push(discuss[0]);
              }
              if (show_discuss) {
                for (let i = 0; i < show_discuss; i++) {
                }
              }
              t.imgs = JSON.parse(t.imgs); //json   banner图 
              function test(pl) {
                for (let x of pl) {
                  x.create_time = new Date(parseInt(x.create_time) * 1000);
                  x.create_time = x.create_time.toLocaleDateString();
                  let da = x.create_time.split("/");
                  x.create_time = da[0] + '-' + da[1] + '-' + da[2];
                }
                return pl;
              };
              let pl = test(discuss);
              that.setData({
                money: t.price,  //原价
                show_discuss: pl,
                discuss: discuss,
                shop_data: t,
                money: t.price,  //价格
                param: param,    //属性
                is_colllect: is_colllect,  // 收藏,
                colllect_id: collect_id    //收藏id
              });
              // 详情
              let content = t.content;
              if (content) {
                let url = app.globalData.r_url;
                content = content.replace("/ueditor/php/upload/image", url + "ueditor/php/upload/image");
                WxParse.wxParse('article', 'html', content, that, 5);

              }
            }

          }
        });

      }
    });

  },
})
// pages/zhanghu/index.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    points:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let openId = options.openid;
    this.setData({ openId:openId });
    db.collection('user').where({
      _openid: _.eq(openId)
    }).get({
      success:res=>{
        console.log(res);
        that.setData({
          points: res.data[0].points
        })
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
    let that = this;
    let openId = that.data.openid;
    this.setData({ openId: openId });
    db.collection('user').where({
      _openid: _.eq(openId)
    }).get({
      success: res => {
        console.log(res);
        that.setData({
          points: res.data[0].points
        })
      }
    });
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
// pages/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow1:true,
    isShow2:true,
    isShow3:true,
  },
  // 切换按钮样式方法
  change1(){
    let isShow = this.data.isShow1;
    this.setData({
      isShow1: !isShow
    })
  },
  change2() {
    let isShow = this.data.isShow2;
    this.setData({
      isShow2: !isShow
    })
  },
  change3() {
    let isShow = this.data.isShow3;
    this.setData({
      isShow3: !isShow
    })
  },
  /**
   * 退出功能
   */
  out(){
    this.setData({
      name: '',
      src: ''
    });
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      src: options.src
    })
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

  }
})
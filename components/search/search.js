// components/search/search.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '', //输入框的值
  },

  //binInput事件，获取输入值
  getValue(e){
    this.setData({
      value:e.detail.value
    })
  },
  //bindconfirm事件，搜索结果
  search(){
    let that = this;
    let keyword = this.data.value;
    console.log('搜索：' + keyword)
    wx.navigateTo({
      url: '../../pages/Result/index?keyword='+keyword,
    })
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
    this.setData({
      value: '',
      book: []
    })
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
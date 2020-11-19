// pages/reader/list/list.js
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName: '',
    titles: [],
    currentPage: 0,
    bookId:''
  },
  /**
   * 关闭当前页面并前往阅读界面
   */
  toReader(e){
    console.log(e)
    let page = e.currentTarget.dataset['index'];
    let bookId = e.currentTarget.dataset['id'];
    console.log('list页面传递参数')
    console.log('page:'+page)
    console.log(typeof (page))
    wx.redirectTo({
      url: '../reader?id='+bookId+'&page='+page,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将传递的参数赋值到data中
    let that=this;
    let bookId=options.id;
    //传递过来的参数是string类型的，所以需要类型转换
    let currentPage=Number(options.page);
    console.log(typeof (currentPage))
    this.setData({
      currentPage: currentPage,
      bookId: bookId
    });
    console.log('bookId:'+bookId);
    //根据bookId查找到对应的书籍信息
    db.collection('allBook').where({
      _id:_.eq(bookId)
    }).get({
      success:res=>{
        console.log(res.data)
        that.setData({
          bookName: res.data[0].bookName,
          titles: res.data[0].title
        })
      }
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
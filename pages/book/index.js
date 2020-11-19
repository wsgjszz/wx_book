// pages/book/index.js
const db = wx.cloud.database()
const _ = db.command;
const myBook = db.collection("myBook")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: [],
    isShow: false //书架是否为空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //保存this对象
    let that = this;
    //获取用户openID
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: resID => {
        console.log('成功')
        let openid = resID.result.openid;
        that.setData({
          openId: openid
        });
        //查询条件：当前用户的openId
        myBook.where({
          openId: _.eq(openid)
        }).get({
          //查询成功   
          success: res => {
            console.log(res.data)
            //这一步很重要，给book赋值，没有这一步的话，前台就不会显示值      
            this.setData({
              book: res.data
            });
            if (res.data.length != 0) {
              this.setData({
                isShow: true
              });
            } else {
              this.setData({
                isShow: false
              });
            }
          }
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //保存this对象
    let that = this;
    //获取用户openID
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: resID => {
        console.log('成功')
        let openid = resID.result.openid;
        that.setData({
          openId: openid
        });
        //查询条件：当前用户的openId
        myBook.where({
          openId: _.eq(that.data.openId)
        }).get({
          //查询成功   
          success: res => {
            console.log(res.data)
            //这一步很重要，给book赋值，没有这一步的话，前台就不会显示值      
            this.setData({
              book: res.data
            });
            if (res.data.length != 0) {
              this.setData({
                isShow: true
              });
            } else {
              this.setData({
                isShow: false
              });
            }
          }
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    //保存this对象
    let that = this;
    //获取用户openID
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: resID => {
        console.log('成功')
        let openid = resID.result.openid;
        that.setData({
          openId: openid
        });
        //查询条件：当前用户的openId
        myBook.where({
          openId: _.eq(that.data.openId)
        }).get({
          //查询成功   
          success: res => {
            console.log(res.data)
            //这一步很重要，给book赋值，没有这一步的话，前台就不会显示值      
            this.setData({
              book: res.data
            });
            if (res.data.length != 0) {
              this.setData({
                isShow: true
              });
            } else {
              this.setData({
                isShow: false
              });
            }
          }
        })
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
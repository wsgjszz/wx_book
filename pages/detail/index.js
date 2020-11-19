// pages/detail/index.js
// let SCREEN_WIDTH =750;
// let RATE = wx.getStorageInfoSync().screenHeight / wx.getStorageInfoSync().screenWidth
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ScreenTotalW: SCREEN_WIDTH,
    // ScreenTotalH: SCREEN_WIDTH * RATE,
    hasBuy: false, //是否已购买当前书籍
    hasSC: false, //是否已收藏
    hasSJ: false, //是否已加入书架
    cost: 0, //当前书籍购买需花费积分
    openId: '',
    bookId:'',
    currentPoints: 0 //当前用户的积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let bookId = options.bookId;
    console.log('获取到bookId:' + options.bookId)
    //根据bookId查询书籍信息
    db.collection('allBook').where({
      _id: _.eq(bookId)
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          bookId: res.data[0]._id,
          bookAuthor: res.data[0].author,
          bookName: res.data[0].bookName,
          bookImage: res.data[0].bookImg,
          cost: res.data[0].cost,
          jianjie: res.data[0].jianjie
        });
      }
    })
    //获取用户openID
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: resID => {
        console.log('成功获取openId')
        let openid = resID.result.openid;
        that.setData({
          openId: openid
        });
        //获取当前用户积分
        db.collection('user').where({
          _openid: _.eq(openid)
        }).get({
          success: res => {
            that.setData({
              currentPoints: res.data[0].points
            })
          }
        });
        //判断当前用户是否已经购买该书籍
        db.collection('buyBook').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).get({
          success: res => {
            if (res.data.length != 0) {
              console.log('已购买')
              that.setData({
                hasBuy: true
              })
            }
          }
        });
        //判断当前用户是否已经收藏该书籍
        db.collection('shoucang').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).get({
          success: res => {
            if (res.data.length != 0) {
              console.log('已收藏')
              that.setData({
                hasSC: true
              })
            }
          }
        });
        //判断当前用户是否已将该书籍加入书架
        db.collection('myBook').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).get({
          success: res => {
            console.log(res)
            if (res.data.length != 0) {
              console.log('已加入书架')
              that.setData({
                hasSJ: true
              })
            }
          }
        });
      }
    });
  },
  /**
   * 购买或前往阅读页面
   */
  goToReader() {
    let that = this;
    let openId = this.data.openId;
    let points = this.data.currentPoints - this.data.cost;
    if (points < 0 && !this.data.hasBuy) {
      //积分不足，不能购买
      wx.showToast({
        title: '积分不足',
        icon: 'none',
        duration: 500
      })
    } else {
      //如果没有购买，需要花费积分购买
      if (!this.data.hasBuy) {
        db.collection('user').where({
          _openid: _.eq(openId)
        }).update({
          data: {
            points: points
          },
          success: res => {
            that.setData({
              hasBuy: true
            });
            db.collection('buyBook').add({
              data: {
                bookName: that.data.bookName,
                bookImage: that.data.bookImage,
                bookAuthor: that.data.author,
                jianjie: that.data.jianjie,
                cost: that.data.cost,
                openId: that.data.openId,
                bookId: that.data.bookId
              }
            });
            wx.showToast({
              title: '购买成功',
              icon: 'success',
              duration: 500
            });
            wx.navigateTo({
              url: '../reader/reader?id=' + this.data.bookId
            });
          },
          fail: res => {
            wx.showToast({
              title: '购买失败',
              icon: 'none',
              duration: 500
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../reader/reader?id=' + this.data.bookId
        });
      }
    }
  },
  //加入书架
  addshujia() {
    let that = this;
    console.log(that.data.hasSC)
    //判断当前用户是否已经将该书籍加入书架
    if (!that.data.hasSJ) {
      //该用户未将该书籍加入书架,往muBook表中插入一条记录
      db.collection('myBook').add({
        data: {
          bookName: that.data.bookName,
          bookImage: that.data.bookImage,
          bookAuthor: that.data.author,
          jianjie: that.data.jianjie,
          cost: that.data.cost,
          openId: that.data.openId,
          bookId: that.data.bookId
        },
        success: res => {
          console.log(res)
          //加入成功
          that.setData({
            hasSJ: true
          });
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 500
          })
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '加入失败',
            icon: 'none',
            duration: 500
          });
        }
      })
    } else {
      //已加入，将myBook表中的记录删除
      try {
        console.log(that.data.openId)
        console.log(that.data.bookId)
        db.collection('myBook').where({
            openId: that.data.openId,
            bookId: that.data.bookId
        }).remove({
          success: res => {
            console.log('移出成功')
            console.log(res)
          },
          fail: err => {
            console.log('移出失败')
            console.log(err)
          }
        })
        //删除成功，将hasSJ设置为false
        that.setData({
          hasSJ: false
        });
        wx.showToast({
          title: '移出成功',
          icon: 'none',
          duration: 500
        })
      } catch (e) {
        //删除出错，显示提示框
        wx.showToast({
          title: '移出失败',
          icon: 'none',
          duration: 500
        })
      }
    }
  },
  //收藏或取消收藏
  xiangdu: function() {
    let that = this;
    console.log(that.data.hasSC)
    //判断当前用户是否已经收藏该书籍
    if (!that.data.hasSC) {
      //该用户未收藏,往shoucang表中插入一条记录
      db.collection('shoucang').add({
        data: {
          bookName: that.data.bookName,
          bookImage: that.data.bookImage,
          bookAuthor: that.data.author,
          jianjie: that.data.jianjie,
          cost: that.data.cost,
          openId: that.data.openId,
          bookId: that.data.bookId
        },
        success: res => {
          console.log(res)
          //收藏成功
          that.setData({
            hasSC: true
          });
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 500
          })
        },
        fail: err => {
          //收藏失败
          console.log(err)
          wx.showToast({
            title: '收藏失败',
            icon: 'none',
            duration: 500
          });
        }
      })
    } else {
      //已收藏，将shoucnag表中的记录删除
      try {
        db.collection('shoucang').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).remove();
        //删除成功，将hasSC设置为false
        that.setData({
          hasSC: false
        });
      } catch (e) {
        //删除出错，显示提示框
        wx.showToast({
          title: '取消收藏失败',
          icon: 'none',
          duration: 500
        })
      }
    }
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
    //刷新，跟onload函数进行一样的操作
    let that = this;
    //根据bookId查询书籍信息
    db.collection('allBook').where({
      _id: _.eq(that.data.bookId)
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          bookId: res.data[0]._id,
          bookAuthor: res.data[0].author,
          bookName: res.data[0].bookName,
          bookImage: res.data[0].bookImg,
          cost: res.data[0].cost,
          jianjie: res.data[0].jianjie
        });
      }
    })
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
        //获取当前用户积分
        db.collection('user').where({
          _openid: _.eq(openid)
        }).get({
          success: res => {
            that.setData({
              currentPoints: res.data[0].points
            })
          }
        });
        //判断当前用户是否已经购买该书籍
        db.collection('buyBook').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).get({
          success: res => {
            if (res.data.length != 0) {
              console.log('已购买')
              that.setData({
                hasBuy: true
              })
            }
          }
        });
        //判断当前用户是否已经收藏该书籍
        db.collection('shoucang').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).get({
          success: res => {
            if (res.data.length != 0) {
              console.log('已收藏')
              that.setData({
                hasSC: true
              })
            }
          }
        });
        //判断当前用户是否已将该书籍加入书架
        db.collection('myBook').where({
          openId: _.eq(that.data.openId),
          bookId: _.eq(that.data.bookId)
        }).get({
          success: res => {
            if (res.data.length != 0) {
              console.log('已加入书架')
              that.setData({
                hasSJ: true
              })
            }
          }
        });
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
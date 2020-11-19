// pages/reader/reader.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: '',
    bookName: '',
    context: [], //章节内容
    title: [], //章节标题
    page: 0, //当前页码
    setInter: '', //存储计时器
    points: 0, //当前用户的积分
    openId: '', //当前用户的openid
    isHidden: false, //是否显示设置界面
    fontSize: 1, //0大，1中，2小
    bgColor: 0, //0白色，1褐色，2绿色，3黑色
  },

  /**
   * 上一页
   */
  lastPage() {
    let page = this.data.page;
    if (page <= 0) {
      this.setData({
        page: 0
      });
      wx.showToast({
        title: '已经是第一页了',
        icon: 'none'
      });
    } else {
      this.setData({
        page: page - 1
      })
    };
    this.goTop();
    this.history();
  },
  /**
   * 下一页
   */
  nextPage() {
    let page = this.data.page;
    if (page >= this.data.title.length - 1) {
      this.setData({
        page: this.data.title.length - 1
      })
      wx.showToast({
        title: '已经是最后一页了',
        icon: 'none'
      })
    } else {
      this.setData({
        page: page + 1
      })
    };
    this.goTop();
    this.history();
  },
  /**
   * 前往章节目录
   */
  goToList() {
    wx.redirectTo({
      url: './list/list?id=' + this.data.bookId + '&page=' + this.data.page,
    });
  },
  /**
   * 显示或隐藏设置界面
   */
  showSetting() {
    let ishidden = this.data.isHidden;
    this.setData({
      isHidden: !ishidden //设置为Hidden的相反值
    })
  },
  /**
   * 设置字体大小
   */
  bigSize() {
    this.setData({
      fontSize: 0
    })
  },
  middleSize() {
    this.setData({
      fontSize: 1
    })
  },
  smallSize() {
    this.setData({
      fontSize: 2
    })
  },
  /**
   * 设置背景色
   */
  color0() {
    this.setData({
      bgColor: 0
    })
  },
  color1() {
    this.setData({
      bgColor: 1
    })
  },
  color2() {
    this.setData({
      bgColor: 2
    })
  },
  color3() {
    this.setData({
      bgColor: 3
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('页面加载了');
    let that = this;
    let isList = false; //是否从list界面过来
    //获取bookid
    this.data.bookId = options.id;
    //获取当前页码,传递过来的参数是string类型的，所以需要类型转换
    let currentPage = Number(options.page);
    if(currentPage >= 0){
      isList=true;
    }
    if (options.page != null) {
      that.setData({
        page: currentPage
      })
    };
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
        db.collection('user').where({
          _openid: _.eq(openid)
        }).get({
          success: res => {
            console.log(res);
            that.setData({
              points: res.data[0].points
            });
            //获取阅读记录
            if(!isList){
              //不是从list过来的，才用获取阅读记录
              db.collection('history').where({
                _openid: _.eq(that.data.openId),
                bookId: _.eq(that.data.bookId)
              }).get({
                success: res => {
                  if (res.data.length != 0) {
                    //当前用户在该书籍有阅读记录，将获取到的page赋值给data
                    console.log('有阅读记录')
                    console.log(res.data[0].page)
                    that.setData({
                      page: res.data[0].page
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
    console.log('bookId:'+options.id);
    //根据bookid获取对应的章节内容
    db.collection('allBook').where({
      _id: _.eq(that.data.bookId)
    }).get({
      success: res => {
        that.setData({
          context: res.data[0].context,
          title: res.data[0].title,
          bookName: res.data[0].bookName
        })
      }
    });
  },
  // 获取滚动条当前位置
  onPageScroll(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 操作阅读记录，新增或更新
   */
  history() {
    let that = this;
    //新增阅读记录，往history表中插入或修改一条记录
    db.collection('history').where({
      _openid: that.data.openId,
      bookId: that.data.bookId
    }).get({
      success: res => {
        console.log('page:'+that.data.page)
        if (res.data.length != 0) {
          //当前用户在该书籍有阅读记录，更新记录
          db.collection('history').where({
            _openid: that.data.openId,
            bookId: that.data.bookId
          }).update({
            data: {
              page: that.data.page
            },
            success: res => {
              console.log('更新阅读记录')
            },
            fail: res => {
              console.log('更新记录失败')
            }
          })
        } else {
          db.collection('history').add({
            data: {
              bookId: that.data.bookId,
              page: that.data.page
            },
            success: res => {
              console.log('新增阅读记录')
            }
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    // console.log('页面显示了')
    let that = this;
    //设置定时器用来计算积分，每隔60000毫秒，即1分钟增加1点积分
    this.data.setInter = setInterval(
      function() {
        let point = that.data.points + 1;
        that.setData({
          points: point
        });
        console.log("当前分数为：" + that.data.points);
      }, 60000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    console.log('页面隐藏了');
    this.history(); //调用操作阅读记录方法
    //清除计时器，并将当前积分更新到数据库
    clearInterval(this.data.setInter);
    let openId = this.data.openId;
    let currentPoints = this.data.points;
    //根据openid找到对应用户进行更新操作
    db.collection('user').where({
      _openid: _.eq(openId)
    }).update({
      data: {
        points: currentPoints
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this;
    console.log('页面卸载了');
    this.history(); //调用操作阅读记录方法
    //清除计时器，并将当前积分更新到数据库
    clearInterval(this.data.setInter);
    let openId = this.data.openId;
    let currentPoints = this.data.points;
    //根据openid找到对应用户进行更新操作
    db.collection('user').where({
      _openid: _.eq(openId)
    }).update({
      data: {
        points: currentPoints
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
 
    //根据bookid获取对应的章节内容
    db.collection('allBook').where({
      _id: _.eq(that.data.bookId)
    }).get({
      success: res => {
        that.setData({
          context: res.data[0].context,
          title: res.data[0].title,
          bookName: res.data[0].bookName
        })
      }
    });
    //获取阅读记录
    db.collection('history').where({
      _openid: _.eq(that.data.openId),
      bookId: _.eq(that.data.bookId)
    }).get({
      success: res => {
        if (res.data.length != 0) {
          //当前用户在该书籍有阅读记录，将获取到的page赋值给data
          console.log('有阅读记录')
          console.log(res.data[0].page)
          that.setData({
            page: res.data[0].page
          })
        }
      }
    })
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
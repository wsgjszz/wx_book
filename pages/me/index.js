// pages/me/index.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '未登录',
    src: '../../assets/images/nologin.png',
    yhlist:[],
    openid:''
  },
//   getOpenid:function(){
// wx.cloud.callFunction({
//   name:'getOpenid',
//   data:{},
//   success:res=>{
//     console.log('成功')
//     let openid=res.result.openid;
//   },
//   fail:err=>{
//     console.error('失败')
//   }
// })
//   },
  zhanghu(){
    let openId=this.data.openid;
    //跳转到账户页面
    wx.navigateTo({
      url: '/pages/zhanghu/index?openid=' + openId,
    })
  },
  xiangdu(){
    let openId = this.data.openid;
    //跳转到想读页面
    wx.navigateTo({
      url: '/pages/shoucang/index?openid=' + openId,
    })
  },
  yigou(){
    let openId = this.data.openid;
    //跳转到已购页面
    wx.navigateTo({
      url: '/pages/yigou/index?openid=' + openId,
    })
  },
  shezhi(){
    let name = this.data.name;
    let src = this.data.src;
    //跳转到设置页面
    wx.navigateTo({
      url: '/pages/setting/index?name=' + name + '&src=' + src,
    })
  },
  chongzhi: function(res) {
    //跳转到充值页面
    wx.navigateTo({
      url: '/pages/newchongzhi/index',
    })
    // wx.requestPayment({
    //   timeStamp: 'res.data.httpmsg.timeStamp',
    //   nonceStr: 'res.data.httpmsg.nonceStr',
    //   package: 'res.data.httpmsg.package',
    //   signType: 'res.data.httpmsg.signType',
    //   paySign: 'res.data.httpmsg.paySign',
    //   success(res){
    //     if(res.errMsg == "requestPayment:ok"){
    //       调用支付成功
    //       util.requestUserInfo();
    //       var couponJson = that.data.coupons;
    //       wx.navigateTo({
    //         url: 'rechargeSuccess?upToBalance='+ that.data.upToBalance +'&awardBalance=' +that.data.awardBalance +'&couponJson='+JSON.stringify(couponJson)
    //       })
    //     } else if (res.errMsg =='requestPayment:cancel'){
    //       用户取消支付的操作
    //       console.log("取消支付");
    //     }
    //   },
    //   fail(err){
    //     console.log(err);
    //   }
    // })
  },
  getMyInfo: function(e) {
    // console.log(e.detail.userInfo)
    let info = e.detail.userInfo;
    this.setData({
      name: info.nickName, //更新名称
      src: info.avatarUrl //更新图片来源
    })
    var that = this;
    //获取用户openID
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: resID => {
        console.log('成功')
        let openid = resID.result.openid;
        // 获取数据库数据     
        db.collection('user').get({
          success: res => {
            console.log(res.data)
            // that.setData({
            //   yhlist: res.data
            // })
            var yhlist = res.data
            console.log("yhlist", yhlist)
            if (yhlist != '' && yhlist!=null){ //数据库返回的数据不为空，不为null
              for (var i = 0; i <= yhlist.length; i++) {
                if (yhlist[i]._openid != openid) {

                  db.collection('user').add({
                    data: {
                      name: info.nickName,
                      points: 20
                    }
                  })
                }
              }
            }else{//数据库为空 说明是首次
              db.collection('user').add({
                data: {
                  name: info.nickName,
                  points: 20
                }
              })
            }
          }
        })
      },
      fail: err => {
        console.error('失败')
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // db.collection('user').where({
    //   name: this.data.name
    // }).get({
    //   success: res => {
    //      console.log(res);
    //     return res;
    //   },
    //   fail: err => {
    //     console.log('sss')
    //     db.collection('user').add({
    //       data: {
    //         name: info.nickName
    //       }
    //     })
    //   },
    // })
//     var that =this;
//     db.collection('user').get({
//       success: res => {
//         console.log(res.data)
//         that.setData({
//           yhlist: res.data
//         })
//       }
//     })
// var yhlist =that.data.yhlist
//     for (var i = 0; i < yhlist.length; i++) {
//       if (yhlist[i].value != info.nickName) {
//         db.collection('user').add({
//           data: {
//             name: info.nickName
//           }
//         })
//       }
//     }



   
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
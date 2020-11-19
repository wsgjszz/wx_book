         
const db = wx.cloud.database()
const test = db.collection("allBook")
Page({
 


 data:{
  //  bookImg:"../../assets/images/xifangzhexueshi.jpg",
  //  bookName:"西方哲学史",
  test:[]
 },
 onLoad:function(){
// 获取数据库引用
// const db = wx.cloud.database();
// 获取集合的引用
// const c = db.collection("list");
// 通过集合获取数据
// c.get().then(res=>{
//   console.log(res);
// })
// c.add({
//   data:{
//     name:"晶莹",
//     age:"16"
//   }
// }).then

   test.get({
     //如果查询成功的话    
     success: res => {
       console.log(res.data)
       //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
       this.setData({
         test: res.data
       })
     }
   })
  }
})

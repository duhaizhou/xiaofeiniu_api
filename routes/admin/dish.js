/**
 * 菜品相关的路由
 */
//创建路由器
const express=require('express');
const pool=require('../../pool');
const router=express.Router();
module.exports=router;



/*
 * API: GET /admin/dish
 * 含义：获取所有菜品，类别进行分类
 * 
 * 返回值形式：
 * [
 *  {cid:1,cname:'...',dishList:[{},{},{}...]},
 *  {cid:2,cname:'..',dishList:[{},{},{}...]},
 * ...
 * ]
 */
router.get('/',(req,res)=>{
  //为了获得所有菜品，必须先查询所有的菜品类别
  pool.query('SELECT cid,cname FROM xfn_category ORDER BY cid',(err,result)=>{
    if(err) throw err;
    var categoryList=result;
    var count=0;
    for(let c of categoryList){//循环遍历每个菜品类别，查询该类别下有哪些菜品(***循环体内出现异步操作，循环变量必须使用let声明)
      
      pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC',c.cid,(err,result)=>{
        
        if(err) throw err;
        c.dishList=result;//在菜品类别表中新加一列来保存某一类菜品的所有菜品
        count++;
        console.log(c);
        //必须保证所有的类别下的菜品都查询完成才能发送响应消息---这些查询都是异步执行的
        if(count==categoryList.length){
          res.send(categoryList);
        }
      });
    }
  })
});


/**
 * POST /admin/dish/image
 * 请求参数：
 * 接受客户端上传的菜品的图片，保存在服务器上，返回该图片在服务器上的随机文件名
 * 响应数据：{code:200,msg:'upload succ',fileName:'1351287612-2342.jpg'}
 */
//引入multer中间件
const multer=require('multer');
const fs=require('fs');
var upload=multer({dest:'tmp/'});//指定客户端上传的文件临时存储路径
//定义路由，使用文件上传中间件
router.post('/image',upload.single('dishImg'),(req,res)=>{
  //console.log(req.file);//客户端上传的图片文件
  //console.log(req.body);//客户端随同图片提交的字符串
  //把客户端上传的文件从临时目录转移到永久的图片路径下
  var tmpFile=req.file.path;//临时文件名
  var suffix=req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));//初始文件名中的后缀部分
  var newFile=randFileName(suffix);//目标文件名
  fs.rename(tmpFile,'img/dish/'+newFile,()=>{//把临时文件转移到永久文件
    res.send({code:200,msg:'upload succ',fileName:newFile})
  })
 


})

//生成一个临时文件名
//参数：suffix表示要生成的文件名中的后缀
function randFileName(suffix){
  var time=new Date().getTime();
  var num=Math.floor(Math.random()*(10000-1000)+1000);//这是一个4位的随机数字
  return time+'-'+num+suffix;

}
/**
 * POST /admin/dish
 * 请求参数：{title:'xx',imgUrl:'..jpg',price:xx,detail:'xx',categoryId:xx}
 *添加一个新的菜品
 * 输出信息：
 * {code:200,msg:'dish added succ',dishId:46}
 */
router.post('/',(req,res)=>{
  pool.query('INSERT INTO xfn_dish SET ?',
  req.body,(err,result)=>{
    if(err) throw err;
    res.send({code:200,msg:'dish added succ',
    dishId:result.insertId})//将INSERT语句产生的自增编号返回客户端
  })
})


/**
 *DELETE /admin/dish/:did
 *根据指定的菜品编号删除该菜品
 *输出数据：
 *{code:200,msg:'dish deleted succ'}
 *{code:400,msg:'dish not exists'} 
 */


 /**
 * PUT /admin/dish
 * 请求参数：{data:xx,title:'xx',imgUrl:'..jpg',price:xx,detail:'xx',categoryId:xx}
 * 根据指定的菜品编号修改菜品
 * 输出数据
 * {code:200,msg:'dish updated succ'}
 * {code:400,msg:'dish not exists'}
 */

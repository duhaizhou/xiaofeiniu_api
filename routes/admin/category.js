/**
 * 菜品类别相关的路由
 */
//创建路由器
const express=require('express');
const pool=require('../../pool');
const router=express.Router();
module.exports=router;


/*
 * API: GET /admin/category
 * 含义：客户端获得所有的菜品类别，按编号升序排列
 * 返回值形式：
 * [{cid:1,cname:'...'},{}]
 */
router.get('/',(req,res)=>{
  pool.query('SELECT * FROM xfn_category ORDER BY cid',(err,result)=>{
    if(err) throw err;
    res.send(result)
  })
});


/**
 * API: DELETE /admin/category/:cid
 * 含义：根据表示菜品编号的路由参数。删除该菜品
 * 返回值形式：
 * {code:200,msg:'1 category deleted'}
 * {code:400,msg:'0 category deleted'}
 */
router.delete('/:cid',(req,res)=>{
  //注意：删除菜品类别之前必须先把属于该菜品类别的菜品的类别编号设置为NULL
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?',req.params.cid,(err,result)=>{
      if(err) throw err;
      //至此指定类别的菜品已经修改完毕
      pool.query('DELETE FROM xfn_category WHERE cid=?',req.params.cid,(err,result)=>{
        if(err) throw err;
        //获取DELETE语句在数据库中影响的行数
        if(result.affectedRows>0)
          res.send({code:200,msg:"1 category deleted"})
        else{
          res.send({code:400,msg:'0 category deleted'});
        }
      })
    })
  })
 
/**
 * API: POST /admin/category
 * 请求主体参数：{cname,'xxx'}
 * 含义：添加新的菜品类别
 * 返回值形式：
 * {code:200,msg:'1 category added',cid:x}
 * 
 */
router.post('/',(req,res)=>{
  var data=req.body;//形如{cname:'xxx'}
  pool.query('INSERT INTO xfn_category SET ?',data,(err,result)=>{
    //注意此处SQL语句的简写
    if(err) throw err;
    if(result.affectedRows>0){
      res.send({code:200,msg:'1 category added'})
    }else{
      res.send({code:400,msg:'add category failed'})
    }
  })
})
/* API:PUT /admin/category
 * 请求主体参数：{cid:x,cname:'xxx'}
 * 含义:根据菜品类别编号修改类别
 * 返回值形式：
 * {code:200,msg:'1 category modified'}
 * {code:400,msg:'0 category modified,not exists'}
 * {code:401,msg:'0 category modified,no modification'}
 */
router.put('/',(req,res)=>{
  var data=req.body;//请求数据{cid:xx,cname:'xx'}
  //TODO:此处可以对输入数据进行验证
  pool.query('UPDATE xfn_category SET ? WHERE cid=?',[data,data.cid],(err,result)=>{
    if(err) throw err;
    console.log(result);
    if(result.changedRows>0){//实际改变了一行
      res.send({code:200,msg:'1 category modified'});
    }else if(result.affectedRows==0){
      res.send({code:400,msg:'0 category modified,not exists'});
    }else if(result.affectedRows==1 && result.changedRows==0){ //影响到了一行，但实际改变了0行--新值和旧值完全一样
      res.send({code:401,msg:'0 category modifeid,no modification'})
    }
  })
})
/**
 *小肥牛扫码点餐项目API子系统 
**/
const PORT=8090;
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const categoryRouter=require('./routes/admin/category');
const adminRouter=require('./routes/admin/admin');
const dishRouter=require('./routes/admin/dish');


//创建HTTP应用服务器
var app=express();
app.listen(PORT,()=>{
  console.log('server listening:'+PORT);
  
});
//使用中间件CORS
app.use(cors());
app.use(bodyParser.json());//把application/json格式的请求主体数据解析出来放入req.body属性

//挂载路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/admin/dish',dishRouter);
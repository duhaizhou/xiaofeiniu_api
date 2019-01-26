/**
 *小肥牛扫码点餐项目API子系统 
**/
const POST=8090;
const express=require('express');

var app=express();
app.listen(POST,()=>{
  console.log('server listening '+POST+'........');
})
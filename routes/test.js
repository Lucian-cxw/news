
// 用于测试md5 和base64
const express=require("express");
const router=express.Router();
const Base64 = require("js-base64").Base64;
const md5 = require("md5");

router.get("/test_base64",(req,res)=>{
    let result=Base64.encode("Man");//编码
    // let result=Base64.decode("TWFu");//解码
    res.send(result);

});

router.get("/test_md5",(req,res)=>{
    let result=md5("hello");//加密
  
    res.send(result);

});

module.exports=router
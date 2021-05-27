const express=require("express");
const Captcha=require("../utils/captcha/index");
const handleDB=require("../db/handleDB");
const md5=require("md5");
const Keys = require("../keys");
const common = require("../utils/common");



const router=express.Router();

// router.get("/passport/xxx",(req,res)=>{
    
//     res.send("/passport/xxx");
// });

router.get("/passport/image_code/:float",(req,res)=>{
    let captchaObj = new Captcha();
    let captcha = captchaObj.getCode();
    // console.log(captcha.text) //验证码文本部分
    // console.log(captcha.data) //验证码文图片部分

    // 保存图片验证码到session中
    req.session["ImageCode"]=captcha.text;
    // console.log(req.session);
    // 发送图片时，是通过img<img src="" /> 要想不出错，需要设置响应头
    res.setHeader("Content-Type","image/svg+xml")
    res.send(captcha.data);
});

router.post("/passport/register",(req,res)=>{
    (async function(){     
        // 1获取post参数，判空.原则是，不管前端有没有判空，后端一定要判空，否则容易出错
        let {username,image_code,password,agree}=req.body;
        if(!username || !image_code||!password||!agree){
            res.json({errmsg:"缺少必填参数"});
            return;
        }
        // 2 验证用户输入验证码是否正确，错误则return
        if(image_code.toLowerCase()!==req.session["ImageCode"].toLowerCase()){
            // 将验证码统一成小写判断，即在验证码输入时忽略大小写问题
            res.send({errmsg:"验证码错误"});
            return;
        }
        // 3查询数据库，看用户是否被注册
        let result= await handleDB(res,"info_user","find","查询数据库操作",`username='${username}'`);
        // 存在该用户，则返回[{字段1：值}] 不存在则返回一个空数组

        // 4如果用户已存在，返回用户名已注册，并返回return
        if(result[0]){
            // result[0] 不为空则表示存在要搜索的用户，因此执行以下代码，除此之外，也可以用length》0 来判断数组是否为空
            res.send({errmsg:"用户名已被注册"});
            return;
        }
        // 5不存在则在数据库中增加一条新纪录
        
      common.getcurrentDate()
        let result2=await handleDB(res,"info_user","insert","数据库插入出错",{
            username,
            // password_hash:password,
            password_hash:md5(md5(password)+Keys.password_salt),
            nick_name:username,
            last_login: common.getcurrentDate()
        });
        // console.log(result2);
        // result2 的值可能是空，insertId（插入成功时自动生成）

        // 6保持用户登录状态
        req.session["user_id"]=result2.insertId;  //user_id 选能够唯一标识 作为session名
        // 7返回注册成功给前端
        res.send({errno:"0",errmsg:"注册成功"});
    })();

});

router.post("/passport/login",(req,res)=>{
    // console.log("login请求");
    (async function(){
          // 1获取post请求参数，判空
        let {username,password}=req.body;
        if(!username ||!password){
            res.json({errmsg:"缺少必填参数"});
            return;
        }
        // 2 查询数据库，验证用户是否已经注册
        let result= await handleDB(res,"info_user","find","查询数据库操作",`username='${username}'`);
        // 3 如果没注册，返回用户未注册，return
        if(!result[0]){
            res.send({errmsg:"该用户未注册，请注册后登录"});
            return;
        }
        // 4 校验 用户密码是否正确，不正确 则return
        if(md5(md5(password)+Keys.password_salt)!== result[0].password_hash){
            res.send({errmsg:"用户名或密码不正确，登录失败"});
            return;
        }
        // 5保持用户登录状态
        req.session["user_id"]=result[0].id;
        // 设置last——login，本质是更新数据库的数据
       
        await handleDB(res,"info_user","update","数据库修改出错",`id=${result[0].id}`,{last_login: common.getcurrentDate()});
        // 6 返回数据给前端
        res.send({errno:"0",errmsg:"登录成功"});
    })()
    
});
router.post("/passport/logout",(req,res)=>{
    // 退出登录，实际上是删除session中的user_id
    delete req.session["user_id"];
    res.send({errmsg:"退出成功"});

});

// 获取当前时间，格式为 2020-12-12 10:10:10 抽取到common.js中了
// function getcurrentDate(){
//     let d=new Date();
//     let y=d.getFullYear();
//     let m=d.getMonth()+1;
//     let day=d.getDate();
//     let h=d.getHours();
//     let min=d.getMinutes();
//     let s=d.getSeconds();
//     return `${y}-${m}-${day} ${h}:${min}:${s}`;
// }

// 演示如何配合vue 编写一个接口，返回token
router.get("/passport/token",(req,res)=>{
    // get 和post类似
    const jwt = require('jsonwebtoken');// 应当写在开头位置，
    const token = jwt.sign({id:1,username:"zhangsan"},Keys.jwt_salt,{expiresIn: 60 * 60 * 2})   //expiresIn为过期时间，单位是秒
    // {id:1,username:"zhangsan"} 为传递的数据
    res.send({
        errmsg:"success",
        errno:"0",
        reason:"登录请求",
        result:{
            token
        }
    });
});



module.exports=router;
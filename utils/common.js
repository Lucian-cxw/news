const handleDB = require("../db/handleDb.js");
const constant = require("../utils/constant");


// 公共工具函数（哪一个接口都可以用）

function csrfProtect(req,res,next){
    // 在执行router下的接口前执行此函数

    if(req.method=="GET"){
        let csrf_token=getRandomString(48);//随机设置的48位字符串
        res.cookie("csrf_token",csrf_token);
    }else if(req.method=="POST"){
        // console.log(req.cookies["csrf_token"]+":cookie");
        // console.log(req.headers["x-csrftoken"]+":header"); //虽然属性值是大写，但此处需要小写才能获取
        if(req.cookies["csrf_token"]===req.headers["x-csrftoken"]){
            console.log("CSRF验证通过");
        }else{
            console.log("CSRF验证不通过");
            res.send({errmsg:"csrf验证不通过"});
            return;
        }
    }

    next();//用于跳转到下一个函数
}

// 随机生成n位数的token值
function getRandomString(n){
    var str="";
    while(str.length<n){
        str+=Math.random().toString(36).substr(2);
        str+=Math.random().toString(36).substr(2);
        // toString(36) 表示转换为36 位的进制数（包含0~9 +26个字母）
        // substr(2) 表示提出前两位表示进制的字符

    }
    return str.substr(str.length-n);
}

// 获取用户信息,但用户可能没登录
async function getUser(req, res){
    let user_id = req.session["user_id"];
    let result1=[];
    if(user_id){
        result1 = await handleDB(res, "info_user", "find", "user_info数据库查询出错", `id=${user_id}`); 
    }
    return result1
}

// 获取用户信息，该用户已经登录
async function getUserInfo(req,res){
    let userInfo= await getUser(req,res)
    if(!userInfo[0]){
        // 没有登录，就重定向到首页
        res.redirect("/")
    }
    return userInfo
}


// 抛出404的操作
async function abort404(req, res){
    let userInfo=await getUser(req,res);
        let data={
            user_info:userInfo[0] ? {
                nick_name:userInfo[0].nick_name,
                avatar_url:constant.QINIU_AVATAR_URL_PRE+userInfo[0].avatar_url
            } :false
        }
    res.render("news/404",data);
}

// 时间格式
function getcurrentDate(){
    let d=new Date();
    let y=d.getFullYear();
    let m=d.getMonth()+1;
    let day=d.getDate();
    let h=d.getHours();
    let min=d.getMinutes();
    let s=d.getSeconds();
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
}
module.exports={
    csrfProtect,
    getUser,
    abort404,
    getcurrentDate,
    getUserInfo
}
const express=require("express");
const handleDB=require("../db/handleDB");
require("../utils/filter");
const common = require("../utils/common");
const constant = require("../utils/constant");


const router=express.Router();


router.get("/",(req,res)=>{
    // 访问首页，处理右上角是否登录的展示问题
    (async function(){
         // 从session中获取user_id
        // let user_id=req.session["user_id"];
        // let result=[];
        // if(user_id){
        //     // 如果获取到了user——id，还要在查询数据库，确认是有效的
        //     result=await handleDB(res,"info_user","find","查询数据库出错",`id='${user_id}'`);
        // }

         // 通过工具函数获取用户信息
         let userInfo=await common.getUser(req,res);
// -----------------------------------------------------------------
// 展示头部信息分类，查询数据库，查看分类信息，查看info_category
let result2= await handleDB(res,"info_category","find","查询数据库出错",["name"]);
// 显示右侧排行，先查询数据库， 后排序，取前6条
let result3= await handleDB(res,"info_news","sql","查询数据库出错","select * from info_news order by clicks desc limit 6");
// let result3= await handleDB(res,"info_news","find","查询数据库出错","1 order by clicks desc limit 6");
// 也可以使用find  其中省略了  select * from info_news where 1 order by clicks desc limit 6 ，1 表示true


// ----------------------------------------------------------------

        // 查到该用户，将该用户的nick_name传递到模板中渲染
        let data={
            user_info:userInfo[0] ? {
                nick_name:userInfo[0].nick_name,
                // avatar_url:userInfo[0].avatar_url,
                avatar_url:userInfo[0].avatar_url? constant.QINIU_AVATAR_URL_PRE+ userInfo[0].avatar_url:"/news/images/worm.jpg"

            } :false,
            category:result2,
            newsClick:result3
        };
        // 以下为测试代码，可删除
        // // 测试cookie 和session
        // res.cookie("name","nodejs");
        // // 小括号设置cookie
        // req.session["age"]=11;
        // // 中括号设置session
        res.render("news/index",data);
    })();
   
});

router.get("/news_list",(req,res)=>{
    (async function(){
        // 获取参数判空 cid（新闻分类） page（当前页码） per_page，每页几条
        let {cid=1,page=1,per_page=5}=req.query;//  没传就给默认值
        // let {cid,page,per_page}=req.query;

        // 查询数据库，获取前端所需数据
            // 思考，在表中，category_id 为一表示在整个表中排序，不为1 表示在对应的分类中排序
            // 因此查询条件有变化
            let condition=cid ==1?`1`:`category_id=${cid}`;// where 1 表示查询整个表
       let result4= await handleDB(res,"info_news","limit","数据库查询出错",{
           where:`${condition} order by create_time desc`,
           number:page,
           count:per_page
       });

    //    求总页数和当前页数,总页数=总条数/每页条数 
       let result2= await handleDB(res,"info_news","sql","数据库查询出错","select count(*) from info_news where "+condition)
// console.log(result2) 结果为一个数组，数组内有一个{'count(*)'：1155}  对象，该对象有一个名为'count(*)' 的字段，该字段的值为条数
        let totalPage=Math.ceil(result2[0]['count(*)']/per_page) ;
        // 将查询结果返回
       res.send({
           newsList:result4,
           totalPage,
           currentPage:Number(page)
        //    由于前端需要的是数字类型的参数，而查询参数为字符串，因此转一下格式
         });
    })();
    
});

// ----------------------------------------以下为测试接口，可删除
router.get("/get_cookie",(req,res)=>{
    // 获取cookies
    // req.cookies["name"]; 注意cookies 而不是cookie
    // 中括号获取cookie

    res.send("cookie中的name："+req.cookies["name"]);
});
router.get("/get_cookieSession",(req,res)=>{
    // 获取cookie
    // req.cookie["name"];
    // 中括号获取session
    // req.session["age"]

    res.send("cookie中的my_session中的name："+req.session["age"]);
});

router.get("/get_data",(req,res)=>{
    // 获取测试查询数据库
    // res, tableName, methodName, errMsg, n1, n2
    (async function(){
       let result= await handleDB(res,"info_category","find","数据库出错");
        res.send(result);
    })();
    
});

module.exports=router;
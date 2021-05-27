
// 两种方式导出,函数法和对象法，其中对象法还有构造函数法 和自定义函数法
const express=require("express");
const path=require("path");
const bodyParser=require("body-parser");
const indexRouter=require("./routes/index");
const passportRouter=require("./routes/passport");

const cookieSession=require("cookie-session");
const cookieParser=require("cookie-parser");
const common=require("./utils/common");
const testRouter=require("./routes/test");
const detailRouter=require("./routes/detail");
const profileRouter=require("./routes/profile");


const Keys = require("./keys");


/*
// 以函数的形势导出和使用配置文件

let appConfig=app=>{
    const express=require("express");

    const path=require("path");
    const bodyParser=require("body-parser");
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json()); 

    const cookieSession=require("cookie-session");
    const cookieParser=require("cookie-parser");
    app.use(cookieParser());
    app.use(cookieSession({
                name:"my_session",
                keys:["da986340jf33030598#$@dd"],
                maxAge:1000*60*60*24
            }));


    // 配置静态资源文件夹
    app.use(express.static("public"));

    //配置 art-template

    app.engine("html",require("express-art-template"));
    app.set("view options",{
    debug:process.env.NODE_ENV !=="development"
    });
    app.set("views",path.join(__dirname,"views"));
    app.set("view engine","html");


}

module.exports=appConfig;
*/ 


// 以对象的方式导出
class AppConfig{
    // 构造函数法，将配置内容写在构造函数内
    
    constructor(app){
        this.app=app;
        this.listenPort=3000;
       
        this.app.use(bodyParser.urlencoded({extended:false}));
        this.app.use(bodyParser.json()); 
      
        this.app.use(cookieParser());
        this.app.use(cookieSession({
                    name:"my_session",
                    keys:[Keys.session_keys],
                    maxAge:1000*60*60*24
                }));
        // 配置静态资源文件夹
        this.app.use(express.static("public"));
        this.app.engine("html",require("express-art-template"));
        this.app.set("view options",{
        debug:process.env.NODE_ENV !=="development"
        });
        this.app.set("views",path.join(__dirname,"views"));
        this.app.set("view engine","html");


        this.app.use(common.csrfProtect,indexRouter);
        this.app.use(common.csrfProtect,passportRouter);
        this.app.use(common.csrfProtect,testRouter);
        this.app.use(common.csrfProtect,detailRouter);
        this.app.use(common.csrfProtect,profileRouter);


        // 针对其他的错误路径请求，返回404页面，即当找不到以上的路由，执行以下路由
        // this.app.use((req,res)=>{
        //    (async function(){
        //         let userInfo=await common.getUser(req,res);
        //         let data={
        //             user_info:userInfo[0] ? {
        //                 nick_name:userInfo[0].nick_name,
        //                 avatar_url:userInfo[0].avatar_url
        //             } :false
        //         }
        //         res.render("news/404",data);
        //    })();
        // });
        
        // 抽取404方法调用
        this.app.use((req,res)=>{
            common.abort404(req,res);
        });

    }

    // 自定义函数法
    /*
    constructor(app){
        this.app=app;
    }
    run(){
        const express=require("express");

        const path=require("path");
        const bodyParser=require("body-parser");
        this.app.use(bodyParser.urlencoded({extended:false}));
        this.app.use(bodyParser.json()); 
        const cookieSession=require("cookie-session");
        const cookieParser=require("cookie-parser");
        this.app.use(cookieParser());
        this.app.use(cookieSession({
                    name:"my_session",
                    keys:["da986340jf33030598#$@dd"],
                    maxAge:1000*60*60*24
                }));
        // 配置静态资源文件夹
        this.app.use(express.static("public"));
        this.app.engine("html",require("express-art-template"));
        this.app.set("view options",{
        debug:process.env.NODE_ENV !=="development"
        });
        this.app.set("views",path.join(__dirname,"views"));
        this.app.set("view engine","html");
    }*/ 

}

module.exports=AppConfig;

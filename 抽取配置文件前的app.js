
const express=require("express");
const path=require("path");
const app=express();

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



app.get("/",(req,res)=>{
    // 测试cookie 和session
    res.cookie("name","nodejs");
    // 小括号设置cookie
    req.session["age"]=11;
    // 中括号设置session
    res.render("news/index");
});

app.get("/get_cookie",(req,res)=>{
    // 获取cookies
    // req.cookies["name"]; 注意cookies 而不是cookie
    // 中括号获取cookie

    res.send("cookie中的name："+req.cookies["name"]);
});
app.get("/get_cookieSession",(req,res)=>{
    // 获取cookie
    // req.cookie["name"];
    // 中括号获取session
    // req.session["age"]

    res.send("cookie中的my_session中的name："+req.session["age"]);
});


app.listen(3000,()=>{
    console.log("正在监听3000");
});
# news
### 1准备工作

>1.1 初始化项目以及安装必要的包，
>
>进入 NEWS文件夹下cmd

>```
>yarn init -y
>yarn add express 
>```
>
>1.2 编写入口文件 app.js
>
>```
>const express=require("express");
>const app=express();
>app.get("/",(req,res)=>{
>res.send("欢迎来到主页");
>});
>app.length(3000,()=>{
>console.log("正在监听3000");
>});
>```
>
>1.3 安装用于render的art-template包,注意引入path 包
>
>```
>yarn add art-template 
>yarn add express-art-template
>
>//配置 art-template
>const path=require("path");
>app.engine("html",require("express-art-template"));
>app.set("view options",{
>debug:process.env.NODE_ENV !=="production"
>});
>
>// 设置在哪一个文件夹下，查找模板文件
>app.set("views",path.join(__dirname,"views"));
>app.set("view engine","html");
>```
>
>1.4 在项目文件下建立views文件夹，存放index.html主页，通过render渲染到浏览器上

### 2模板和静态资源的处理

>2.1项目文件夹下建立public文件夹，存放静态资源，如 图片 样式 js 代码，在入口文件配置静态资源文件夹
>
>```
>app.use(express.static("public"));
>```
>
>2.2 将素材news的html文件放到views文件夹下，其余的放到静态资源public文件夹下的news文件夹中，
>
>回到views 文件夹下的index.html主页，修改link相对路径，使得css样式生效
>
>快捷方式，选中相对路径的 ..   Ctrl +shift +l ，然后修改为/news/即可 ，因为前面设置了静态资源public，所以第一个/ 代表 在public文件夹的路径
>
>可能出现的问题： 在vscode上运行app.js 时，在网页上不能正常显示样式，建议用cmd运行 app.js

### 3 项目中post请求方式处理

>```
>引入body-parser
>const bodyParser=require("body-parser");
>// 配置body-parser 
>app.use(bodyParser.urlencoded({extended:false}));
>app.use(bodyParser.json()); //针对异步提交的Ajax
>```
>
>

### 4cookie 和session 的配置和测试

>项目中需要发送请求获取参数，因此需要安转对应的包，以及配置
>
>```
>yarn add cookie-parser
>yarn add cookie-session
>
>配置
>const cookieSession=require("cookie-session");
>const cookieParser=require("cookie-parser");
>app.use(cookiePasrer());
>app.use(cookieSession({
>       name:"my_session",
>       keys:["da986340jf33030598#$@dd"],
>       maxAge:1000*60*60*24
>   }));
>
>设置一下代码，用于测试，注意，先清空浏览器cookie缓存，在设置cookie才能获取cookie值
>app.get("/get_cookie",(req,res)=>{ 
>// req.cookies["name"]; 注意cookies 而不是cookie
>res.send("cookie中的name："+req.cookies["name"]);
>});
>app.get("/get_cookieSession",(req,res)=>{
>res.send("cookie中的my_session中的name："+req.session["age"]);
>});
>
>```
>
>

### 5 项目信息配置抽取

>app.js' 入口文件，随着编写代码增加，为了便于管理，将一些代码抽取成单独的文件如：
>
>1app.use（）  注册代码，单独组成配置文件config.js ，因此在根目录下新建js文件
>
>```
>通过函数的形势抽取
>在config.js中
>let appConfig(){}
>module.exports=app.config
>
>在app.js中 
>const appConfig=require("./config");
>// 使用配置文件
>appConfig(app);
>
>法2：以对象的方式导出
>class AppConfig{
>	constructor（）{
>	//配置信息
>	}
>}
>在app.js中 
>new AppConfig(app);
>
>法三：
>class AppConfig{
>	constructor（）{
>	 this.app=app
>	}
>	run(){
>
>	}
>}
>在app.js中 
>let appConfig=new AppConfig(app);
>appConfig.run();
>
>推荐以对象构造函数的形势或直接以函数形势编写配置文件
>```
>
>
>
>2路由接口等
>
>新建routes文件夹，在该文件夹下创建index.js
>
>```
>将app.js 处理请求的代码剪切到index.js中
>
>const express=require("express");
>const router=express.Router();
>将所有的app用router替换
>
>app.get("/",(req,res)=>{
>// 测试cookie 和session
>res.cookie("name","nodejs");
>// 小括号设置cookie
>req.session["age"]=11;
>// 中括号设置session
>res.render("news/index");
>});
>
>app.get("/get_cookie",(req,res)=>{
>// 获取cookies
>// req.cookies["name"]; 注意cookies 而不是cookie
>// 中括号获取cookie
>
>res.send("cookie中的name："+req.cookies["name"]);
>});
>app.get("/get_cookieSession",(req,res)=>{
>// 获取cookie
>// req.cookie["name"];
>// 中括号获取session
>// req.session["age"]
>
>res.send("cookie中的my_session中的name："+req.session["age"]);
>});
>
>
>在哪注册使用？
>原则上在app.js，但因为app.use（indexRouter） 被抽成独立的config文件，因此在config.js中注册路由
>在config.js中 配置文件信息末尾补上  以后的router都按此种方式编写，如登录验证的请求、验证码等等
>
>再新建一个passport.js路由文件，按以上方式编写
>```



### 6项目数据表，

>一个数据库，一个项目可能有多个表，表有哪些字段，一般是根据产品，分析需求，设计而来的
>
>

![image-20210510152805361](./img/img1.png)

数据表分析

![image-20210510153446223](./img/img2.png)



>创建数据库方式:
>
>材料准备:在news项目文件夹下,新建db文件夹该文件夹下存放nodejs-orm 文件夹和handleDB.js 和news.sql
>
>其中news.sql 用于创建数据库的脚本文件，可通过Navicat导入创建数据库
>
>nodejs-orm 文件夹 下存放index.js 的数据库配置文件

#### 1cmd 进入数据库使用mysql 创建

>1 mysql -uroot -p 进入mysql
>
>2 create database news2 charset=utf8;创建news2;（用于演示）
>
>3 use news2;
>
>4输入 source 然后鼠标把 news.sql 拖拽到cmd中，再补上分号，注意路径中 不要有中文，否则导入失败

#### 2 Navicat 操作

>1 进入Navicat 邮件test 新建数据库, 名字:news  字符集 utf-8
>
>2 右键news，运行批次任务，选择 news.sql 完成后生成7个表
>
>3 info_category  和info_news 有数据，其他的没有
>
>
>
>show variables like "char%"; 可以查看字符集情况， 如果不是可以如下设置为utf-8
>
>SET character_set_client = utf8;
>SET character_set_connection = utf8;
>SET character_set_database = utf8;
>SET character_set_results = utf8;
>SET character_set_server = utf8;
>
>character_set_system= utf8;
>
>
>
>推荐第二种，第一种容易出现乱码
>
>
>
>

### 7数据库操作

>1 安装mysql 包，进行数据库操作   yarn add mysql 
>
>2配置数据库文件，db文件夹下 的index.js 
>
>```
>let orm_config = {host: 'localhost',//数据库地址port:'3306',user: 'root',//用户名，没有可不填password: '',//密码，没有可不填database: 'news'//数据库名称}
>```
>
>3 在router文件夹下的index.js 测试数据库接口
>
>注意：设计异步读取查询操作，因此用到 async await ，在采自只执行函数执行操作
>
>```
>router.get("/get_data",(req,res)=>{// 获取测试查询数据库// res, tableName, methodName, errMsg, n1, n2(async function(){  let result= await handleDB(res,"info_category","find","数据库出错");   res.send(result);})();});
>```

### 8验证码文本和图片生成

>详见图片1
>
>1安装验证码获取模块
>
>```
>yarn add svg-captcha
>```
>
>2在根目录下创建工具utils文件夹，存放capatcha的index.js 的配置文件
>
>3验证码写在passport 中，
>
>3.1 在passport.js中引入
>
>```
>const Captcha=require("../utils/captcha/index");router.get("/get_code",(req,res)=>{let captchaObj = new Captcha();let captcha = captchaObj.getCode();// console.log(captcha.text) //验证码文本部分// console.log(captcha.data) //验证码文图片部分// 发送图片时，是通过img<img src="" /> 要想不出错，需要设置响应头// res.setHeader("Content-Type","imag/svg+xml")res.send(captcha.data);});
>```
>
>4实际项目中使用方式
>
>1 点击首页的注册，出现登录页面以及验证码
>
>```
>router.get("/passport/image_code",(req,res)=>{let captchaObj = new Captcha();let captcha = captchaObj.getCode();// console.log(captcha.text) //验证码文本部分// console.log(captcha.data) //验证码文图片部分// 发送图片时，是通过img<img src="" /> 要想不出错，需要设置响应头res.setHeader("Content-Type","image/svg+xml")res.send(captcha.data);});可以在控制台的element中看出，通过img src="/passport/image_code" 向后台发送请求，router.get("/passport/image_code" 对请求做出回应
>```
>
>2点击验证码图片，更换验证码
>
>通过img的属性方法 onclick=“generateImageCode（）”
>
>先在header中查看引入了那些script，然后对应在public静态资源js下 ，找到该函数源码
>
>```
>image_url = '/passport/image_code'将源码做修改，image_url = '/passport/image_code/'+ Math.random();加个随机数，使得路径改变，进而图片改变同样的 响应请求的接口路径要采用动态路由方式router.get("/passport/image_code/:float"即可实现点击切换验证码的操作
>```
>
>3查看图片3 验证码与session补充

### 9注册功能

>9.1 在public文件夹下的main.js 中找到处理登录请求的代码，取消Ajax请求注释
>
>回到 passport.js 中处理该post请求响应
>
>9.2分析注册功能要做的东西（后端接口要尽可能严谨）
>
>原则，操作数据库时，需要添加数据，y应当尽全力把所有无效情况分析出来，确保数据的有效性
>
>无效则return
>
>9.3共七个功能
>
>```
>	// 1获取post参数，判空// 2 验证用户输入验证码是否正确，错误则return// 3查询数据库，看用户是否被注册   使用async +await // 4如果用户已存在，返回用户名已注册，并返回return// 5不存在则在数据库中增加一条新纪录// 6保持用户登录状态// 7返回注册成功给前端router.post("/passport/register",(req,res)=>{(async function(){        // 1获取post参数，判空.原则是，不管前端有没有判空，后端一定要判空，否则容易出错   let {username,image_code,password,agree}=req.body;   if(!username || !image_code||!password||!agree){       res.json({errmsg:"缺少必填参数"});       return;   }   // 2 验证用户输入验证码是否正确，错误则return   if(image_code.toLowerCase()!==req.session["ImageCode"].toLowerCase()){       // 将验证码统一成小写判断，即在验证码输入时忽略大小写问题       res.send({errmsg:"验证码错误"});       return;   }   // 3查询数据库，看用户是否被注册   let result= await handleDB(res,"info_user","find","查询数据库操作",`username='${username}'`);   // 存在该用户，则返回[{字段1：值}] 不存在则返回一个空数组   // 4如果用户已存在，返回用户名已注册，并返回return   if(result[0]){     // result[0] 不为空则表示存在要搜索的用户，因此执行以下代码，除此之外，也可以用length》0 来判断数组是否为空       res.send({errmsg:"用户名已被注册"});       return;   }   // 5不存在则在数据库中增加一条新纪录   let result2=await handleDB(res,"info_user","insert","数据库插入出错",{       username,       password_hash:password,       nick_name:username   });   // result2 的值可能是空，insertId（插入成功时自动生成）   // 6保持用户登录状态   req.session["user_id"]=result2.insertId;  //user_id 选能够唯一标识 作为session名   // 7返回注册成功给前端   res.send({errno:"0",errmsg:"注册成功"});})();
>```

### 10登录功能

>1同理在public文件夹下main.js 找到登录发送post请求的代码，取消Ajax请求注释
>
>回到 passport.js 中处理该post请求响应
>
>```
>router.post("/passport/login",(req,res)=>{// console.log("login请求");(async function(){     // 1获取post请求参数，判空   let {username,password}=req.body;   if(!username ||!password){       res.json({errmsg:"缺少必填参数"});       return;   }   // 2 查询数据库，验证用户是否已经注册   let result= await handleDB(res,"info_user","find","查询数据库操作",`username='${username}'`);   // 3 如果没注册，返回用户未注册，return   if(!result[0]){       res.send({errmsg:"该用户未注册，请注册后登录"});       return;   }   // 4 校验 用户密码是否正确，不正确 则return   if(password!== result[0].password_hash){       res.send({errmsg:"用户名或密码不正确，登录失败"});       return;   }   // 5保持用户登录状态   req.session["user_id"]=result[0].id;   // 6 返回数据给前端   res.send({errno:"0",errmsg:"登录成功"});})()
>```



### 11首页登录状态展示

>```
>
>```
>
>在views 的index.html下，编写条件渲染
>
>```
> 将以下代码      <div class="user_btns fr">           <a href="javascript:;" class="login_btn">登录</a> / <a href="javascript:;"    				class="register_btn">注册</a>       </div>    <!-- 用户登录后显示下面，隐藏上面 -->    <div class="user_login fr">           <img src="/news/images/person01.png" class="lgin_pic">           <a href="#">张三</a>           <a href="#" onclick="logout()">退出</a>     </div>改为下面的{{if !user_info}}       <div class="user_btns fr">           <a href="javascript:;" class="login_btn">登录</a> / <a href="javascript:;"    				class="register_btn">注册</a>       </div>{{else}}       <!-- 用户登录后显示下面，隐藏上面 -->       <div class="user_login fr">           <img src="/news/images/person01.png" class="lgin_pic">           <a href="#">{{user_info.nick_name}}</a>           <a href="#" onclick="logout()">退出</a>       </div>{{/if}}
>```
>
>

### 12退出功能

>1 在main.js中 取消退出Ajax post请求的注释
>
>2回到passport.js 中处理对应的请求
>
>```
>router.post("/passport/logout",(req,res)=>{   // 退出登录，实际上是删除session中的user_id   delete req.session["user_id"];   res.send({errmsg:"退出成功"});});
>```

### 13设置用户最后一次登录时间

>1每次登录时往这个字段中设置一个时间
>
>```\
>在passport.js 新用户注册时 添加一个新字段last_login:new Date().toLocaleString()// 我也不知道为什么这段代码不能运行last_login:getcurrentDate()登录时，    await handleDB(res,"info_user","update","数据库修改出错",`id=${result[0].id}`,{last_login: getcurrentDate()});其中// 获取当前时间，格式为 2020-12-12 10:10:10function getcurrentDate(){   let d=new Date();   let y=d.getFullYear();   let m=d.getMonth()+1;   let day=d.getDate();   let h=d.getHours();   let min=d.getMinutes();   let s=d.getSeconds();   return `${y}-${m}-${day} ${h}:${min}:${s}`;}
>```
>
>

### 14首页头部分类和右侧排行

>1在 router文件夹下的index.js 下，编写头部分类
>
>```
>在后端处理get请求中// 展示头部信息分类，查询数据库，查看分类信息，查看info_categorylet result2= await handleDB(res,"info_category","find","查询数据库出错",["name"]);let result3= await handleDB(res,"info_news","sql","查询数据库出错","select * from info_news order by clicks desc limit 6");let data={       user_info:result[0] ? {           nick_name:result[0].nick_name,           avatar_url:result[0].avatar_url       } :false,       category:result2，       newClick:result3   };在index.html中将原本的html代码注释替换为{{each category}}               <li data-cid={{$index+1}} class={{$index==0? "active" :""}}><a href="javascript:;">						{{$value.name}}</a></li>{{/each}}在html排行处替换为以下代码{{each newsClick}}               <li><span class="first">{{$index+1}}</span><a href="#">{{$value.title}}</a></li>           {{/each}}
>```
>
>当数据库排序时报错Out of sort memory, consider increasing server sort buffer size。
>
>表明sort内存溢出，考虑增加服务器的排序缓冲区(sort_buffer_size)大小。
>
>```sql
>在mysql中输入show variables like '%sort_buffer_size%'; +-------------------------+---------+| Variable_name           | Value   |+-------------------------+---------+| innodb_sort_buffer_size | 1048576 || myisam_sort_buffer_size | 8388608 || sort_buffer_size        | 262144  |+-------------------------+---------+通过 SET GLOBAL sort_buffer_size = 1024*1024;改变sort_buffer_size 大小然后exit 退出在进入mysqlshow variables like '%sort_buffer_size%'; +-------------------------+---------+| Variable_name           | Value   |+-------------------------+---------+| innodb_sort_buffer_size | 1048576 || myisam_sort_buffer_size | 8388608 || sort_buffer_size        | 1048576 |+-------------------------+---------+表明更改成功
>```
>
>
>
>

### 15右侧分类排行样式

>
>
>```
><li><span class={{$index==0 ? "first":$index==1? "second":$index==2?"third":''}}>{{$index+1}}</span><a href="#">{{$value.title}}</a></li>通过多次嵌套三元运算符来设置 四种不同样式也可以使用过滤器（推荐）	1在html处	<li><span class={{$index|classNameFilter}}>{{$index+1}}</span><a href="#">{{$value.title}}</a></li>2 在utils下的filter.jsconst template=require("art-template");template.defaults.imports.classNameFilter=function(value){// value 接受的是{{|}}  |前面的值，即$indexif(value===0){   return "first"}else if(value===1){   return "second"}else if(value===0){   return "third"}else{   return ""}}3在router 的index.js下引入require("../utils/filter");
>```
>
>

### 16给post设置csrf_token

>1在utils文件夹下设置common.js 用于编写代码
>
>```
>// 公共工具函数（哪一个接口都可以用）function csrfProtect(req,res,next){// 在执行router下的接口前执行此函数if(req.method=="GET"){   let csrf_token=getRandomString(48);//随机设置的48位字符串   res.cookie("csrf_token",csrf_token);}else if(req.method=="POST"){   // console.log(req.cookies["csrf_token"]+":cookie");   // console.log(req.headers["x-csrftoken"]+":header"); //虽然属性值是大写，但此处需要小写才能获取   if(req.cookies["csrf_token"]===req.headers["x-csrftoken"]){       console.log("CSRF验证通过");   }else{       console.log("CSRF验证不通过");       res.send({errmsg:"csrf验证不通过"});       return;   }}next();//用于跳转到下一个函数}// 随机生成n位数的token值function getRandomString(n){var str="";while(str.length<n){   str+=Math.random().toString(36).substr(2);   str+=Math.random().toString(36).substr(2);   // toString(36) 表示转换为36 位的进制数（包含0~9 +26个字母）   // substr(2) 表示提出前两位表示进制的字符}return str.substr(str.length-n);}module.exports={csrfProtect,}
>```
>
>2 在config.js 中通过use（） 使用
>
>```
>const common=require("./utils/common");this.app.use(common.csrfProtect,indexRouter);this.app.use(common.csrfProtect,passportRouter);
>```
>
>3同时在js文件夹下的main.js修改前端Ajax请求，设置请求头
>
>

### 17base64讲解见 day15笔记.md 中的第二部分

补充知识查看day15 的md文件，为什么用base64：因为有时候使用中文或图片事出现乱码问题，采用base64编码，传输数据。

>1安装base64编码包 yarn add js-base64
>
>```
>const Base64 = require("js-base64").Base64;Base64.encode('hello');      // aGVsbG8=Base64.decode('aGVsbG8=');  // hello
>```

>2在routers 下新建一个test.js 用于测试base64
>
>```
>const express=require("express");const router=express.Router();const Base64 = require("js-base64").Base64;router.get("/test_base64",(req,res)=>{let result=Base64.encode("Man");//编码// let result=Base64.decode("TWFu");//解码res.send(result);});module.exports=router
>```
>
>
>
>

### 18加密介绍，见补充知识

### 19单项散列函数介绍，见补充知识

### 20对称加密于非对称加密，见补充知识

### 21使用md5

>注意，有一个网站能够在线破解md5：<https://www.cmd5.com/> 
>
>其原理是根据数据库中保存的md5 记录比对，反向找出明文，并非反向解密
>
>因此在使用md5时 采用双重md5加盐来对密码存储前的加密
>
>md5（md5（密码）+“%&￥%##%&*”） 后面一串复杂的字符串即为盐
>
>
>
>1安装  yarn add md5
>
>```
>const md5 = require("md5");console.log(md5("hello"));      //5d41402abc4b2a76b9719d911017c592  
>```
>
>2 /routes/passport.js中：
>
>```
>const Keys = require("../keys");const md5 = require("md5");....//注册接口中，存储密码的时候：let result2 = await handleDB(res,"info_user","insert", "info_user数据库新增出错",{username:username,nick_name:username,// password_hash:password,password_hash:md5(md5(password)+Keys.password_salt),last_login:(new Date()).toLocaleString(),})....//登录接口中，验证密码的时候：if(md5(md5(password)+Keys.password_salt) !== result2[0].password_hash){res.json({errmsg:"用户名或密码错误"});return}
>```
>
>3 在项目文件夹下新建keys：
>
>```
>module.exports = {session_keys:"%$#$^%*&^*%$REFDGWERDFG^%$^&*^$ERF$",password_salt:"DGFFDHRERDV%$$#&^&%^#%$RFDHG#$FGTHG^$%#FG"}
>```
>
>4在 config.js中 的session配置改为 keys:[keys.session_keys],

### 22resful 风格接口

>党后端与vue配合时，多采用以下方式，将前端的所需数据返回

![img](./img/img3.png)



### 23 JSON Web Token（JWT）

>1企业级别的应用，采用的是JSON  web Token，详见文档 JWT.md
>
>以前将token 设置在cookie 或session中，通过浏览器去沟通，但是 其他APP的登录（手机应用等）不具备cookie和session，因此原先的方式设置token行不通，因此采用Jwt。
>
>
>
>![04jwt三个部分和jwt验签原理](./补充知识\04jwt三个部分和jwt验签原理.png)

>1.安装jsonwebtoken
>
>```
>yarn add jsonwebtoken
>```
>
>2写一个接口（可以和vue配合），返回JWT值，与本项目相关性较小，近做演示
>
>在passport.js中
>
>```
>// 演示如何配合vue 编写一个接口，返回tokenrouter.get("passport/token",(req,res)=>{// get 和post类似const jwt = require('jsonwebtoken');// 应当写在开头位置，const token = jwt.sign({id:1,username:"zhangsan"},Keys.jwt_salt,{expiresIn: 60 * 60 * 2})   //expiresIn为过期时间，单位是秒// {id:1,username:"zhangsan"} 为传递的数据res.send({   errmsg:"success",   errno:"0",   reason:"登录请求",   result:{       token   }});});
>```
>
>在keys.js中
>
>```
>jwt_salt:"$kajfgl3$@*ljhblefhbel*"
>```
>
>然后可以测试该接口了



### 24 postman的使用

# 新闻列表

### 1 **首先明确(需求)**

> 在静态资源的index.js中，取消 Ajax get请求的代码
>
> 1、最新，指的是所有新闻中最新的数据，而不是一个叫“最新”的分类，所有的新闻的category_id字段不会为1 (所属的分类id不会为1， 1是“最新”)
>
> 2、先实现点击导航的分类，展示对应分类的新闻，并且没有刷新页面，即点击之后前端向后台服务器发起ajax请求，只是获取新闻数据，用GET方式请求

### 2前端传哪些参数给服务器

> 1、点击导航的分类，要展示对应分类的新闻，应该告诉服务器此时点击的分类id（即代码中的cid）
>
> ​	2、一个分类对应多条新闻，不会在点击之后把该分类的所有新闻一次性展示完，比如，只展示最新的n条，这个n要告诉服务器(即代码中的per_page)
>
> ​	3、因为后台服务器通过limit分页查询查出数据返回给前端，涉及到第几页数据（并且后面下拉加载更多也需要告诉服务器要拿第几页的新闻），所以传当前页数((即代码中的page)       

### 3思路分析(步骤)

> 1、获取参数，前端发送通过GET参数发送
>
> ​	2、分页查询新闻表中的新闻(根据分类id，即cid；降序；使用分页查询；查询到的是python的模型对象列表)
>
> 3、返回新闻数据
>
> ```
> router.get("/news_list",(req,res)=>{(async function(){    // 获取参数判空 cid（新闻分类） page（当前页码） per_page，每页几条    let {cid=1,page=1,per_page=5}=req.query;//  没传就给默认值    // let {cid,page,per_page}=req.query;    // 查询数据库，获取前端所需数据        // 思考，在表中，category_id 为一表示在整个表中排序，不为1 表示在对应的分类中排序        // 因此查询条件有变化        let condition=cid ==1?`1`:`category_id=${cid}`;// where 1 表示查询整个表   let result4= await handleDB(res,"info_news","limit","数据库查询出错",{       where:`${condition} order by create_time desc`,       number:page,       count:per_page   });    // 将查询结果返回   res.send({       newsList:result4     });})();});
> ```
>
> 

### 4首页滚动到底部加载更多新闻数据

>1 在静态资源的index.js中，取消页面滚动加载相关 代码的注释
>
>同时在router文件夹下的index.js下的router.get("/news_list",(req,res)将以下结果返回
>
>```
>router.get("/news_list",(req,res)=>{(async function(){   // 获取参数判空 cid（新闻分类） page（当前页码） per_page，每页几条   let {cid=1,page=1,per_page=5}=req.query;//  没传就给默认值   // let {cid,page,per_page}=req.query;   // 查询数据库，获取前端所需数据       // 思考，在表中，category_id 为一表示在整个表中排序，不为1 表示在对应的分类中排序       // 因此查询条件有变化       let condition=cid ==1?`1`:`category_id=${cid}`;// where 1 表示查询整个表  let result4= await handleDB(res,"info_news","limit","数据库查询出错",{      where:`${condition} order by create_time desc`,      number:page,      count:per_page  });//    求总页数和当前页数,总页数=总条数/每页条数   let result2= await handleDB(res,"info_news","sql","数据库查询出错","select count(*) from info_news where "+condition)// console.log(result2) 结果为一个数组，数组内有一个{'count(*)'：1155}  对象，该对象有一个名为'count(*)' 的字段，该字段的值为条数   let totalPage=Math.ceil(result2[0]['count(*)']/per_page) ;   // 将查询结果返回  res.send({      newsList:result4,      totalPage,      currentPage:Number(page)   //    由于前端需要的是数字类型的参数，而查询参数为字符串，因此转一下格式    });})();});
>```
>
>

### 5详情页

>1在routes文件夹下创建detail.js
>
>2在该文件中编写
>
>```
>const express=require("express");const handleDB=require("../db/handleDB");const router=express.Router();router.get("/news_detail/:news_id",(req,res)=>{// (async function(){//    let result= await handleDB(res,"info_category","find","数据库出错");//     res.send(result);// })();res.render("news/detail");});module.exports=router;
>```
>
>3在config.js 中注册
>
>```
>const detailRouter=require("./routes/detail");this.app.use(common.csrfProtect,detailRouter);
>```
>
>4样式不显示，则到对应的views下的detail.html修改link 的路径
>
>5右侧排行也要修改html中的路径，在views下的index.html
>
>```
>将<li><span class={{$index|classNameFilter}}>{{$index+1}}</span><a href="#">{{$value.title}}</a></li>的href="#" 改为
>```
>
>

### 6详情页模板继承

>进入详情页后，右侧有一个一模一样的新闻排行，因此可以继承主页的新闻排行
>
>1 在views文件夹下，将index.html复制一份，并改名为base.html
>
>2在detail.html   继承base.html
>
>```
>{{extend './base.html'}}
>```
>
>3 对比base 和detail ，找到不一样的地方
>
>```
>如：在base中：<title>首页-News</title> 不一样，改为 <title>{{block titleBlock}}}</title> ，用于给子模板设置不同标题，其余的类似在detail中：{{block titleBlock}}文章详情页{{/block}}第二处：在base中<script type="text/javascript" src="/news/js/index.js"></script>替换为{{block 'scriptBlock'}}{{/block}}在detail中{{block 'scriptBlock'}} <script type="text/javascript" src="/news/js/detail.js"></script> {{/block}}全部比对完成后，删除detail中的多余代码
>```
>
>4 detail展示
>
>```
>{{extend './base.html'}}{{block "titleBlock"}}文章详情页{{/block}}{{block 'scriptBlock'}} <script type="text/javascript" src="/news/js/detail.js"></script> {{/block}}{{block 'contentBlock'}}	<div class="detail_con fl">  		具体代码省略     	</div>{{/block}}{{block 'autherCardBlock'}}	<div class="author_card">		 具体代码省略	</div>  {{/block}}
>```
>
>5注意：此时刷新详情页，右侧点击排行没有数据，页面右上角登录注册也没有数据，需要在detail.js的接口中获取这些数据，传到detail.html上，（这部分代码已经在index.js接口中写了，直接复制到detail.js的接口上即可）
>
>```
>router.get("/news_detail/:new_id", (req,res)=>{(async function news_detail(){   let user_id = req.session["user_id"];   let result1=[];   if(user_id){       result1 = await handleDB(res, "info_user", "find", "user_info数据库查询出错", `id=${user_id}`);    }   let result3 = await handleDB(res, "info_news", "limit", "info_category数据库查询出错", {where:"1 order by clicks desc",number:1,count:5});    let data = {       user_info:result1[0]?{           nick_name:result1[0].nick_name,           avatar_url:result1[0].avatar_url       }:"",       newsClick:result3   }   res.render("news/detail", data);})();})
>```

### 7 index.html 继承base.html

>1 由于着两者有相同之处，为简化代码，采用继承方式
>
>```
>	{{extend "./base.html"}}并且只需要些这5个不同之处的代码，例如：	{{block 'titleBlock'}}首页-News{{/block}}	{{block 'scriptsBlock'}}<script type="text/javascript" src="/news/js/index.js"></script>{{/block}}	{{block 'menuBlock'}}  ...  {{/block}}	{{block 'contentLeftBlock'}}  ...  {{/block}}	{{block 'authorCardBlock'}}  ...  {{/block}}
>```
>
>

### 8详情页新闻内容的查询

>1在detail.js 中补充以下代码

```
// 左侧新闻内容的查询        let {news_id}=req.params;        let newsRes=await handleDB(res,"info_news","find","查询数据库出错",`id=${news_id}`);           在data中返回 newsData:newsRes[0]        
```

>2 在detail.html中
>
>```
><h3>{{newsData.title}}</h3> 将h3的内容替换为后端返回的内容{{newsData.content}} 注意，由于在数据库中存放的，内容包含了标签，为了在渲染时能够识别，根据art-templat语法相应调整，具体查看文档{{@newsData.content}}  或者{{#newsData.content}}   <h3>{{newsData.title}}</h3>          {{newsData.create_time | dateFormat}} 来源: {{newsData.source}    {{newsData.clicks?newsData.clicks:0}}            摘要：{{newsData.digest }}        </p>        {{#newsData.content }}    这个井号是为了把字符串格式化成html  {{newsData.comments_count?newsData.comments_count:0}}条评论  
>```
>
>3处理时间的过滤器dataFormat,在filter.js文件中
>
>```
>template.defaults.imports.dateFormat=function(value){   var d = new Date(value);  //2018-01-16T21:19:19.000Z   var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();    return times}然后再detail.js中引入即可
>```
>
>3.1 也可以将其编写成一个工具函数，关于时间格式的操作，只需要一个格式转化函数即可，把它当成我们的工具函数放在common.js中:
>
>```
> function dateFormat(value){    	var d = new Date(value);  //2018-01-16T21:19:19.000Z    	var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' 		+ d.getMinutes() + ':' + d.getSeconds();    return times}module.exports = {  dateFormat}
>```
>
>

### 9新闻页面点击数量 +1

>分析，在进入detail接口，渲染页面前对数据库的clicks字段加一
>
>```
>newsRes[0].clicks+=1;   await handleDB(res,"info_news","update","数据库更新出错",`id=${news_id}`,{clicks:newsRes[0].clicks});
>```

### 10获取用户登录的信息函数抽取

>1我们把这个获取用户登录信息的功能抽取到common.js中
>
>```
>const handleDB = require("../db/handleDb.js");async function getUser(req, res){let user_id = req.session["user_id"];let result1=[];if(user_id){   result1 = await handleDB(res, "info_user", "find", "user_info数据库查询出错", `id=${user_id}`); }return result1}module.exports = {csrfProtect,getUser}
>```
>
>2原先书写的获取用户登录信息的地方（两处：/routes/index.js和/routes/detail.js）：
>
>```
>const common = require("../utils/common");let userInfo = await common.getUser(req, res);
>```
>
>3 修改对应需要返回前端的数据
>
>```
>let data={       user_info:userInfo[0] ? {           nick_name:userInfo[0].nick_name,           avatar_url:userInfo[0].avatar_url       } :false,       category:result2,       newsClick:result3   };
>```
>
>

### 11 404页面抽取工作

>1确保数据id为news_id这篇新闻在数据库中存在，才能继续后续操作,如当用户输入
>
>[404](http://localhost:3000/news_detail/-100)

```
if(!newsRes[0]){       res.render("news/404");       return  }
```

>2 在404页面的html文件修改路径应用样式，然后考虑继承base.html优化代码
>
>```
>base 中的内容区为左右结构，而404没有，因此用一个大的块标签包裹住，{{block 'centerBlock'}}	具体代码省略{{/block}}在base中{{block 'centerBlock'}}<div class="conter_con">        <div class="error_con">   <img src="/news/images/not_found.png" alt="404">   <h3>OOPS!</h3>   <h4>该内容不存在</h4>   <p>请检查你输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</p>   <a href="/">返回首页</a></div>            </div>{{/block}}同理，用{{block 'footerBlock'}}footer 的html代码{{/block}} 将base中的footer 包住，在404中则用空字符替代{{block 'footerBlock'}}{{/block}}
>```
>
>3 删除多余代码,j结果为
>
>```
>{{extend "./base.html"}}{{block "titleBlock"}}404{{/block}}{{block 'centerBlock'}}<div class="conter_con">        <div class="error_con">   <img src="/news/images/not_found.png" alt="404">   <h3>OOPS!</h3>   <h4>该内容不存在</h4>   <p>请检查你输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</p>   <a href="/">返回首页</a></div>            </div>{{/block}}{{block 'footerBlock'}}{{/block}}
>```

### 12 其他情况的404页面 的返回

>1问题描述：当访问数据库不存在的页面，后端返回404 ，在右上角没显示用户是否登录
>
>```
>在 config.js中// 针对其他的错误路径请求，返回404页面，即当找不到以上的路由，执行以下路由   this.app.use((req,res)=>{      (async function(){           let userInfo=await common.getUser(req,res);           let data={               user_info:userInfo[0] ? {                   nick_name:userInfo[0].nick_name,                   avatar_url:userInfo[0].avatar_url               } :false           }           res.render("news/404",data);      })();   });
>```
>
>2 处理404页面代码抽取，在common的.js 中
>
>```
>// 抛出404的操作async function abort404(req, res){let userInfo=await getUser(req,res);   let data={       user_info:userInfo[0] ? {           nick_name:userInfo[0].nick_name,           avatar_url:userInfo[0].avatar_url       } :false   }res.render("news/404",data);}调用在config.js中this.app.use((req,res)=>{       common.abort404(req,res);   });在detail.js中common.abort404(req,res);
>```
>
>

# 收藏和已收藏

### 1收藏和已收藏功能展示

>分析：通过查看表info_user_collection ，可知收藏的情况
>
>1 在detail.js的 router.get("/news_detail/:news_id",(req,res)=>{}中
>
>```
>// 登的用户是不是收藏了这篇新闻，传一个布尔值给模板   let isCollected=false;// 查询数据库，查看表中的info_user_colletion是否收藏，同时判断用户是否登录，登录了才能收藏   if(userInfo[0]){//验证是否登录      let collectionRes= await handleDB(res,"info_user_collection","find","查询数据库出错",`user_id=${userInfo[0].id} and news_id=${news_id}`);       if(collectionRes[0]){//验证是否收藏           isCollected=true;       }   }并将 isisCollected，通过data 传递给前端detail.html中
>```
>
>2在detail.html中
>
>```
><a href="javascript:;" class="collection block-center" data-newid="" style="display: {{isCollected? 'none':'block'}}" >收藏</a><a href="javascript:;" class="collected block-center" data-newid="" style="display: {{isCollected? 'block' :'none'}}"><span class="out">已收藏</span><span class="over">取消收藏</span></a>
>```
>
>3点击收藏和取消收藏
>
>3.1 在静态文件夹下的detail.js 中 将收藏的post请求取消注释
>
>3.2 回到routes下的detail.js中，编写处理前端收藏请求接口
>
>前置工作： 将detail.html 中收藏 标签的属性赋值 data-newid="{{newsData.id}}，用于传递新闻id给后端
>
>```
>router.post("/news_detail/news_collect",(req,res)=>{(async function(){   // 点击收藏，向info_user_collection 添加记录，取消则删除一条记录   // 传参，那个用户，收藏那篇新闻   // 前端返回一个action用于表示收藏还是取消收藏   /*业务流程 ：（适用于所有需要登录才能操作的接口）       1获取登录用户信息，没有获取到，直接return       2 获取参数，判空       3查询数据库，判断新闻是否存在，不存在就return，确保新闻有效性       4 根据action的值收藏或者取消收藏       5返回操作成功   */        // 1获取登录用户信息，没有获取到，直接return   let userInfo= await common.getUser(req,res);   if(!userInfo[0]){//没有登录就return       res.send({errno:"4101",errmsg:"用户未登录"});       return ;   }   // 2 获取参数，判空   let {news_id,action}=req.body;   if(!news_id||!action){       res.send({errmsg:"参数错误"});       return   }   // 3查询数据库，判断新闻是否存在，不存在就return，确保新闻有效性   let newsRes=await handleDB(res,"info_news","find","数据库查询出错",`id=${news_id}`);   if(!newsRes[0]){       res.send({errmsg:"参数错误2"})       return   }   // 4 根据action的值收藏或者取消收藏   if(action=="collect"){       await handleDB(res,"info_user_collection","insert","数据库添加失败",{           user_id:userInfo[0].id,           news_id       })   }else{       await handleDB(res,"info_user_collection","delete","数据库添加失败",`user_id=${userInfo[0].id} and news_id=${news_id}`)   }   // 5返回操作成功   res.send({errno:0,errmsg:"操作成功"})})();})
>```
>
>

### 2评论

>2.1在 detail.html 的评论表单中
>
>```
><form action="" class="comment_form" data-newsid="{{newsData.id}}">添加data-newsid="{{newsData.id}}" 属性
>```
>
>2.2在routes文件夹下detail.js处理评论post请求接口
>
>```
>router.post("/news_detail/news_comment",(req,res)=>{(async function(){   /*       需要的参数：           1一种情况评论新闻： 评论内容 新闻id           2另一种情况。回复别人的评论： 回复内容  回复对象 parent_id       业务流程：           1获取登录用户的信息 ，获取不到就return           2获取参数，判空           3 查询新闻，看看新闻是否存在           4往数据库插入数据（如果有parent_id，这个属性也要记得插入）           5返回成功响应   */    // 1获取登录用户的信息 ，获取不到就return   let userInfo= await common.getUser(req,res);   if(!userInfo[0]){//没有登录就return       res.send({errno:"4101",errmsg:"用户未登录"});       return ;   }   // 2获取参数，判空   let {news_id,comment,parent_id=null}=req.body;   if(!news_id||!comment){       res.send({errmsg:"参数错误"});       return   }   // 3 查询新闻，看看新闻是否存在   let newsRes=await handleDB(res,"info_news","find","数据库查询出错",`id=${news_id}`);   if(!newsRes[0]){       res.send({errmsg:"参数错误2"})       return   }   // 4往数据库插入数据（如果有parent_id，这个属性也要记得插入）   let commentObj={       user_id:userInfo[0].id,       news_id:news_id,       content:comment,       // create_time:new Date().toLocaleString()//不知道为什么，插入的时间格式，数据库识别不了       create_time:common.getcurrentDate()//调用自定义时间格式   }   if(parent_id){//如果传了parent_id 就设置这个属性       commentObj.parent_id=parent_id   }  let insertRes= await handleDB(res,"info_comment","insert","数据库查询出错",commentObj)   // 5返回成功响应   let data={       user:{           avatar_url:userInfo[0].avatar_url ? userInfo[0].avatar_url:"/news/images/worm.jpg",           nick_name:userInfo[0].nick_name       },       content:comment,       create_time:commentObj.create_time,       news_id,       id:insertRes.insertId//新增的这条评论的id   }   res.send({errno:"0",errmsg:"评论成功",data})})()})
>```
>
>2. 3 至此，可以实现数据库中插入评论，但是前端页面刷新，评论就会消失，但数据库确实存在评论 
>
>解决办法：在router.get("/news_detail/:news_id",(req,res)=>{}接口中，将查询数据库评论的结果返回前端，并且展示即可
>
>```
> // 查询和这篇新闻相关的评论，查询结果为一个数组       let commonRes=await handleDB(res,'info_comment','find',"数据库查询出错",       `news_id=${news_id} order by create_time desc`)       // 给commentRes中每个元素进行处理，添加commenter属性       for(let i=0;i<commonRes.length;i++){              // 查询info_user表，根据conmentRes[i]中的user_id           let commenterRes=await handleDB(res,'info_user','find',"数据库查询出错",`id=${commonRes[i].user_id}`)           commonRes[i].commenter={                nick_name:commenterRes[0].nick_name,               avatar_url:commenterRes[0].avatar_url ?commenterRes[0].avatar_url :"/news/images/worm.jpg",           }       }
>```
>
>2.4在detail.html中修改html代码
>
>```
><div class="comment_list_con"> 下的4个comment——list注释，替换为以下 {{ each commentList }}           <div class="comment_list">               <div class="person_pic fl">                   <img src="{{ $value.commenter.avatar_url }}" alt="用户图标">               </div>               <div class="user_name fl">{{ $value.commenter.nick_name }}</div>               <div class="comment_text fl">{{ $value.content }}</div>               {{ if $value.parent_id }}                   <div class="reply_text_con fl">                       <div class="user_name2">{{ $value.parent.user.nick_name }}</div>                       <div class="reply_text">                           {{ $value.parent.content }}                       </div>                   </div>               {{ /if }}               <div class="comment_time fl">{{ $value.create_time | dateFormat }}</div>               <a href="javascript:;" class="comment_up fr" data-commentid="{{ $value.id }}" data-newsid="{{ $value.news_id }}">赞</a>               <a href="javascript:;" class="comment_reply fr">回复</a>               <form class="reply_form fl" data-commentid="{{ $value.id }}" data-newsid="{{ $value.news_id }}">                   <textarea class="reply_input"></textarea>                   <input type="button" value="回复" class="reply_sub fr">                   <input type="reset" name="" value="取消" class="reply_cancel fr">               </form>           </div>       {{ /each }}在静态资源的detail.js 下 的打开登录框前补充更新评论数updateCommentCount();   // 打开登录框
>```

### 3回复

>3.1 取消 在静态资源的detail.js 下，回复功能的Ajax请求注释,评论和回复公用一个接口
>
>至此，可以实现往数据库中插入回复内容，但是前端页面没有马上显示回复内容
>
>3.2 在routes下的detail.js中处理router.post("/news_detail/news_comment",(req,res)=>{}
>
>```
>补充data={	 parent:parent_id?{           user:{               nick_name:parentUserInfo[0].nick_name,           },           content:parentComment[0].content       }:null}
>```
>
>3.3同时，在2.3 的for循环中，添加一个parent属性
>
>```
>if(commonRes[i].parent_id){           // 如果有父评论，查询其内容 和昵称           var parentComment= await handleDB(res,"info_comment","find","数据库查询失败",`id=${commonRes[i].parent_id}`)           var parentUserInfo= await handleDB(res,"info_user","find","数据库查询失败",`id=${parentComment[0].user_id}`)           commonRes[i].parent={               user:{                   nick_name:parentUserInfo[0].nick_name,               },               content:parentComment[0].content           }       }
>```
>
>

### 4点赞

>4.1 点赞通过post提交，因此取消静态资源下的detail.js 关于点赞的post请求注释
>
>4.2在routes下的detail.js编写处理请求的接口
>
>```
>// 处理点赞和取消点赞router.post("/news_detail/comment_like",(req,res)=>{(async function(){   /*       参数： 哪一个用户（通过登录直接获取），点赞了哪一个 pinglun       点赞和取消点赞，都是此接口处理，通过action 获取参数       业务流程：           1 回去登录用户信息           2获取参数，判空           3查询数据库，看评论是否存在，不存在就return           4根据action 的值是add还是remove，确定点赞还是取消点赞行为               把用户点赞的评论，作为记录 保存到info_comment_like表               点赞数 在info_comment 的立刻——count字段        5 返回操作成功   */     // 1获取登录用户的信息 ，获取不到就return    let userInfo= await common.getUser(req,res);    if(!userInfo[0]){//没有登录就return        res.send({errno:"4101",errmsg:"用户未登录"});        return ;    }    // 2获取参数，判空    let {comment_id,action}=req.body;    if(!comment_id||!action){        res.send({errmsg:"参数错误"});        return    }   //  console.log(comment_id,action)    // 3查询数据库，看评论是否存在，不存在就return   let commentRes=await handleDB(res,"info_comment","find","数据库查询出错",`id=${comment_id}`);   if(!commentRes[0]){       res.send({errmsg:"参数错误2"})       return   }   // 4根据action 的值是add还是remove，确定点赞还是取消点赞行为   if(action=="add"){       // 把用户点赞的评论，作为记录 保存到info_comment_like表点赞数 在info_comment 的立刻——count字段       await handleDB(res,"info_comment_like","insert","数据库添加出错",{           comment_id,           user_id:userInfo[0].id       })       var like_count=commentRes[0].like_count ?commentRes[0].like_count+1:1   }else{       //取消点赞， 删除info_comment_like 表记录       await handleDB(res,"info_comment_like","delete","数据库删除出错",`comment_id=${comment_id} and user_id=${userInfo[0].id}`)       var like_count=commentRes[0].like_count ?commentRes[0].like_count-1:0   }   // 更新数据库中的点赞数，   await handleDB(res,"info_comment","update","数据库更新失败",`id=${comment_id}`,{like_count})   // 5 返回操作成功   res.send({errno:"0",errmsg:"操作成功"})})()})
>```
>
>4.3 在 detail.html中 的赞标签 中添加属性 data-likecount="{{$value.like_count ? $value.like_count:0}}"，用于记录点赞数量，同时 将标签的赞字替换为
>
>```
>{{$value.like_count ? $value.like_count:"赞"}}
>```
>
>4.4 至此，可以实现点赞变亮，但是一旦刷新页面，失去高亮,解决办法
>
>```
>在点赞的标签中添加一个类：{{ user_like_comments_ids.indexOf($value.id)>=0 ? 'has_comment_up':''}}
>```
>
>4.5回到routes的detail.js的router.get("/news_detail/:news_id",(req,res)=>{}中，补充需要传递给前端，控制点赞高亮的数据
>
>```
>// 把登录用户 曾点过赞的评论全部查出来，以数组 id的形势返回给前端   let user_like_comments_ids=[];   if(userInfo[0]){       let User_like_Res=await handleDB(res,"info_comment_like","find","数据库查询出错",       `user_id=${userInfo[0].id}`);       // 遍历User_like_Res ，获取每个元素的id，插入到user_like_comments_ids       User_like_Res.forEach(el=>{           user_like_comments_ids.push(el.comment_id)       })   }将user_like_comments_ids 传递给前端
>```

### 5详情页右侧作者信息

>5.1回到routes的detail.js的router.get("/news_detail/:news_id",(req,res)=>{}中，将作者信息返回前端
>
>```
>// 把登录用户 曾点过赞的评论全部查出来，以数组 id的形势返回给前端   let user_like_comments_ids=[];   if(userInfo[0]){       let User_like_Res=await handleDB(res,"info_comment_like","find","数据库查询出错",       `user_id=${userInfo[0].id}`);       // 遍历User_like_Res ，获取每个元素的id，插入到user_like_comments_ids       User_like_Res.forEach(el=>{           user_like_comments_ids.push(el.comment_id)       })   }   // 查询新闻作者的信息，返回给前端   let autherInfo=await handleDB(res,"info_user","find","查询数据库出错",`id=${newsRes[0].user_id}`)   // 查看该作者，发布新闻条数   let autherNewsCount=await handleDB(res,"info_news","sql",    "查询数据库出错",`select count(*) from info_news where user_id=${autherInfo[0].id}`)   //  查询作者粉丝数 查看info_user_fans表   let autherFansCount=await handleDB(res,"info_user_fans","sql","查询粉丝数数据库出错",       `select count(*) from info_user_fans where followed_id=${autherInfo[0].id}`)在data中添加以下数据autherInfo:autherInfo[0],autherNewsCount:autherNewsCount[0]["count(*)"],autherFansCount:autherFansCount[0]["count(*)"]
>```
>
>5.2 回到对应的html页面,在 {{block 'autherCardBlock'}} 中
>
>```
>{{block 'autherCardBlock'}}<div class="author_card"><a href="#" class="author_pic"><img src="{{autherInfo.avatar_url?autherInfo.avatar_url :'/news/images/user_pic.png'}}" alt="author_pic"></a><a href="#" class="author_name">{{autherInfo.nick_name}}</a><div class="author_resume">{{autherInfo.signature}}</div><div class="writings"><span>总篇数</span><b>{{autherNewsCount}}</b></div><div class="follows"><span>粉丝</span><b>{{autherFansCount}}</b></div><a href="javascript:;" class="focus fr">关注</a><a href="javascript:;" class="focused fr"><span class="out">已关注</span><span class="over">取消关注</span></a></div>  {{/block}}
>```
>
>

### 6关注和取消关注

>6.1  在5.1 的后面添加
>
>```
>// 登的用户是不是关注了作者，传一个布尔值给模板    let isFollow=false;    // 查询数据库，查看表中的info_user_colletion是否收藏，同时判断用户是否登录，登录了才能收藏    if(userInfo[0]){//验证是否登录       let followRes= await handleDB(res,"info_user_fans","find","查询数据库出错",       `follower_id=${userInfo[0].id} and followed_id=${autherInfo[0].id}`);        if(followRes[0]){//验证是否收藏            isFollow=true;        }    }在data中 将 isFollow传递给前端
>```
>
>6.2 在html处,为已关注添加一个内联样式
>
>```
>关注 标签添加 style="display: {{isFollow? 'none':'block'}};"已关注标签添加 style="display: {{isFollow? 'block':'none'}};"
>```
>
>6.3 将静态资源下的detail.js 关于关注与取消关注的post请求取消注释
>
>```
>此外 在6.2 的基础上，在style后添加一个 data-userid={{authorInfo.id}} 属性，便于后端操作
>```
>
>6.4 在route下的detail.js 处理 关注个取消关注的post请求
>
>```
>// 关注和取消关注router.post("/news_detail/followed_user",(req,res)=>{(async function(){   /*业务流程 ：（适用于所有需要登录才能操作的接口）       1获取登录用户信息，没有获取到，直接return       2 获取参数，判空       3查询数据库，判断新闻是否存在，不存在就return，确保user_id是有的       4 根据action的值关注和取消关注       5返回操作成功   */        // 1获取登录用户信息，没有获取到，直接return   let userInfo= await common.getUser(req,res);   if(!userInfo[0]){//没有登录就return       res.send({errno:"4101",errmsg:"用户未登录"});       return ;   }   // 2 获取参数，判空   let {user_id,action}=req.body;   if(!user_id||!action){       res.send({errmsg:"参数错误"});       return   }   // 3查询数据库，判断新闻是否存在，不存在就return，确保user_id是有的   let newsRes=await handleDB(res,"info_user","find","数据库查询出错",`id=${user_id}`);   if(!newsRes[0]){       res.send({errmsg:"参数错误2"})       return   }   // 4 根据action的值关注还是取消关注   if(action=="follow"){       await handleDB(res,"info_user_fans","insert","数据库添加失败",{           follower_id:userInfo[0].id,           followed_id:user_id       })   }else{       await handleDB(res,"info_user_fans","delete","数据库添加失败",`follower_id=${userInfo[0].id} and followed_id=${user_id}`)   }   // 5返回操作成功   res.send({errno:0,errmsg:"操作成功"})})();})
>```
>
>

# 个人中心页面

### 1 个人中心页面展示

>1.1在routes下，新建一个profile.js文件
>
>```
>const express=require("express");const handleDB=require("../db/handleDB");const router=express.Router();require("../utils/filter")const common = require("../utils/common");router.get("/profile",(req,res)=>{res.render("news/user")})module.exports=router
>```
>
>1.2 咋config.js 中注册使用
>
>```
>const profileRouter=require("./routes/profile");this.app.use(common.csrfProtect,profileRouter);
>```
>
>1.3 修改user.html link的路径，使样式产生效果

### 2用户登录后才能进入到用户中心

>2.1 在router.get("/profile",(req,res)=>{}  中编写对应的代码

>```
>router.get("/profile",(req,res)=>{(async function(){   let userResult= await common.getUser(req,res)   if(!userResult[0]){       // 没有登录，就重定向到首页       res.redirect("/")   }   res.render("news/user")})()})
>```
>
>2.2实现点击用户名，跳转到个人主页,在base.html中 的用户名处
>
>```
><a href="#">{{user_info.nick_name}}</a> 给 href="/profile" 实现点击跳转页面
>```
>
>2.3 user.html 继承base.html
>
>```
>{{extend './base.html'}}{{block "titleBlock"}}用户中心{{/block}}{{block 'scriptBlock'}}<script type="text/javascript" src="/news/js/jquery.form.min.js"></script>{{/block}}{{block 'centerBlock'}}<div class="conter_con">	<div class="user_menu_con fl">		<div class="user_center_pic">			<img src="/news/images/user_pic.png" alt="用户图片">		</div>		<div class="user_center_name">用户张山</div>		<ul class="option_list">			<li class="active"><a href="user_base_info.html" target="main_frame">基本资料</a></li>			<li><a href="user_pic_info.html" target="main_frame">头像设置</a></li>			<li><a href="user_follow.html" target="main_frame">我的关注</a></li>			<li><a href="user_pass_info.html" target="main_frame">密码修改</a></li>			<li><a href="user_collection.html" target="main_frame">我的收藏</a></li>			<li><a href="user_news_release.html" target="main_frame">新闻发布</a></li>			<li><a href="user_news_list.html" target="main_frame">新闻列表</a></li>		</ul>	</div>	<div class="user_con fr">		<iframe src="user_base_info.html" frameborder="0" name="main_frame" class="main_frame" id="main_frame"></iframe>	</div>		</div>{{/block}}
>```
>
>2.4 保持登录状态,在2.1的基础上添加，修改为以下代码
>
>```
>let data={       user_info:{           nick_name:userInfo[0].nick_name,           avatar_url:userInfo[0].avatar_url?userInfo[0].avatar_url:"/news/images/worm.jpg"       }    }   res.render("news/user",data)
>```
>
>

### 3展示基本信息页面，以及处理基本信息

>分析：
>
>1在user.html 最后处，有一个 iframe 框架标签，用于在不跳转页面的情况下，展示另一个html网页，改标签通过src指向要展示的页面内（user_base_info.html），一般为get 请求，但是user_base_info.html 存在表单，使用的是post，因此在profile.js中采用router.all（） 统一处理请求，
>
>2 之前说的表单，没有action 提交页面，而是采用外部js/user_base_info.js 中编写post请求，请求路径为/user/base_info
>
>3.1 展示基本信息页面，以及处理基本信息的post请求
>
>```
>router.all("/user_base_info",(req,res)=>{(async function(){   // 获取用户登录信息，没有获取到就重定向到首页   let userInfo= await common.getUser(req,res)   if(!userInfo[0]){       res.redirect("/")   }   if(req.method=="GET"){       res.render("news/user_base_info")   }     if(req.method=="POST"){   }       })()   })
>```
>
>3.2 将 user.html页面的iframe中src  赋值  src="/user_base_info"
>
>3.3 修改user_base_info.html 的路径，使样式生效
>
>3.4点击 基本资料就显示基本资料
>
>```
>将 href="user_base_info.html"改为 href=/user_base_info
>```
>
>

### 4基本资料的数据展示

>4.1在3.1 对于get请求的基础上，传递一个data数据给前端
>
>```
>if(req.method=="GET"){       let data={           nick_name:userInfo[0].nick_name,           signature:userInfo[0].signature,           gender:userInfo[0].gender ? userInfo[0].gender:"MAN"       }       res.render("news/user_base_info",data)   }else if(req.method=="POST"){}
>```
>
>4.2 在user_base_info.html  的 input标签，添加一个value值，用于显示具体内容
>
>```
><input class="gender" type="radio" name="gender" {{if gender=="MAN"}}checked{{/if}} value="MAN"> <b>男</b>&nbsp;&nbsp;&nbsp;&nbsp;       <input class="gender" type="radio" name="gender" {{if gender=="WOMAN"}}checked{{/if}} value="WOMEN">  <b>女</b> <input id="signature" type="text" name="signature" class="input_txt" value="{{signature}}"><input id="nick_name" type="text" name="" class="input_txt" value="{{nick_name}}"><input class="gender" type="radio" name="gender" {{if gender=="MAN"}}checked{{/if}} value="MAN"> <b>男</b>&nbsp;&nbsp;&nbsp;&nbsp;<input class="gender" type="radio" name="gender" {{if gender=="WOMAN"}}checked{{/if}} value="WOMAN">  <b>女</b>
>```
>
>

### 5修改用户基本数据

>5.1 user_base_info.js 中关于保存用户修改基本信息数据的post请求，取消其注释
>
>5.2  在4.1 的基础上，编写处理post请求的代码
>
>```
>else if(req.method==="POST"){       console.log("收到post请求")       /*           1获取参数判空           2修改数据库中的数据           3返回操作成功       */        // 1获取参数判空       let {nick_name, signature, gender}=req.body       if(!nick_name ||!signature||!gender){           res.send({errmsg:"参数错误"})           return       }       console.log(nick_name, signature, gender)       // 2修改数据库中的数据       await handleDB(res,"info_user","update","更新数据库出错",`id=${userInfo[0].id}`,{           nick_name,            signature,            gender       })       // 3返回操作成功       res.send({errno:"0",errmsg:"操作成功"})   }  
>```
>
>5.3 在base.html 处，为 右上角昵称 添加一个id
>
>```
><a href="/profile" >{{user_info.nick_name}}</a>改为<a href="/profile" id="nick_name" >{{user_info.nick_name}}</a>
>```
>
>5.2 在user.html 处 将<div class="user_center_name">用户张山</div>
>
>```
>改为 <div class="user_center_name">{{user_info.nick_name}}</div>
>```

### 6修改用户密码

>6.1修改密码和5 类似，首先在user.html中
>
>```
><li><a href="user_pass_info.html" target="main_frame">密码修改</a></li>改为 			<li><a href="/user/pass_info" target="main_frame">密码修改</a></li>
>```
>
>6.2 回到profile.js，编写处理get和post请求
>
>```
>const md5=require("md5");const Keys = require("../keys");// 展示修改密码页面，以及保存修改后的密码router.all("/user/pass_info",(req,res)=>{(async function(){   // 获取用户登录信息，没有获取到就重定向到首页   let userInfo= await common.getUser(req,res)   if(!userInfo[0]){       res.redirect("/")   }   if(req.method==="GET"){       res.render("news/user_pass_info")   }else if(req.method==="POST"){       console.log("收到post请求")       /*           1获取参数,判空(新旧密码)            2校验两次密码是否一致           3校验旧密码是否正确           4修改用户数据库中的password——hash           5返回修改成功       */        // 1获取参数，判空(新旧密码)        let {old_password,new_password,new_password2}=req.body       if(!old_password||!new_password||!new_password2){           res.send({errmsg:"参数错误"})           return       }       console.log(old_password,new_password,new_password2)       // 2校验两次密码是否一致       if(new_password!==new_password2){           res.send({errmsg:"两次密码不一致"})           return       }       // 3校验 用户密码是否正确，不正确 则return       if(md5(md5(old_password)+Keys.password_salt)!== userInfo[0].password_hash){           res.send({errmsg:"旧密码不正确，修改失败"});           return;       }       // 4修改用户数据库中的password——hash       await handleDB(res,"info_user","update","更新数据库出错",`id=${userInfo[0].id}`,{           password_hash:md5(md5(new_password)+Keys.password_salt)       })       // 5返回修改成功       res.send({errno:"0",errmsg:"操作成功"})   }  })()   })
>```
>
>6.3 在user_pass_info.html处修改路径，使样式生效，并且取消user_pass_info.js中 Ajax请求的注释
>
>6.4 由于主页左侧每项操作，都要检查用户是否登录，因此将此功能抽象为一个函数，放在common.js中
>
>```
>// 获取用户信息，该用户已经登录async function getUserInfo(){let userInfo= await getUser(req,res)if(!userInfo[0]){   // 没有登录，就重定向到首页   res.redirect("/")}return userInfo}回到profile.js 替换掉重复的代码
>```
>
>

### 7展示修改头像页面

>此功能，将get和post分开编写，没有采用router.all（）统一处理
>
>7.1 在profile.js中编写get请求
>
>```
>// 展示修改头像页面router.get("/user/pic_info",(req,res)=>{(async function(){   let userInfo=await common.getUserInfo(req,res)   // console.log("头像get请求")   res.render("news/user_pic_info")})()})
>```
>
>7.2 将user.html 中头像标签的href 改为
>
>```
><li><a href="/user/pic_info" target="main_frame">头像设置</a></li>
>```

### 8上传头像

>上传原理
>
>![上传原理](D:\web_front_end\Node.js\ES6\nodejs\day14\img\15上传图片流程图.png)
>
>8.1图片上传到后台服务器
>
>```
>1安装：yarn add multer2引入和使用：	const multer = require('multer');	//const upload = multer({ dest: '设置上传图片的保存路径' })		const upload = multer({ dest: 'public/news/upload' })	3 接受图片提交的接口：	// 提交头像图片的接口router.post("/user/pic_info",upload.single("avatar"),(req,res)=>{// 此处的avatar 为user_pic_info.html页面 上传图片标签的name属性console.log("头像post请求")console.log(req.file) //获取本次上传图片的一些信息/*   {       fieldname: 'avatar',       originalname: 'avatar1.png',       encoding: '7bit',       mimetype: 'image/png',       destination: 'public/news/upload/avatar',       filename: '95471240eb3fd1dd3577b93a1e368744',       path: 'public\\news\\upload\\avatar\\95471240eb3fd1dd3577b93a1e368744',       size: 15632   }*/ res.send(req.file)})
>```
>
>8.2 取消 post注释
>
>8.3 在服务器中将用户上传的图片上传到第三方服务器，采用对象存储方式，其中七牛云就是该方式之一
>
>首先在七牛云创建存储空间，
>
>​	网址：[七牛云 - 国内领先的企业级云服务商 (qiniu.com)](https://www.qiniu.com/)
>
>```
>该网站可以免费使用一段时间，但作为企业存储依然收费，使用前要注册账号其次，点击 管理控制台，在左侧菜单栏找到 对象存储，然后选择  空间管理  再然后 新建空间 填写信息，选择公开，确认七牛云账号：电话号码：密码qny免费时长，30天创建成功后，在文件管理处可见上传的文件
>```

### 9上传图片到七牛云空间

>​	不会有可以点击文档，开发者中心查看使用方法，在上方的sdK&工具处，点击官方sdk，找到node.js 文档
>
>点击sdk v6 查看文件上传的js代码，将资料中的qn.js 复制到util文件夹下，注意修改对应的配置
>
>```
>秘钥，在七牛云账号个人空间的秘钥管理中获取qiniu_sdk.conf.ACCESS_KEY = 'q6uiVp8lLebLyxqKnZMZ0cmwihBfk1rWzMqnkgXX';qiniu_sdk.conf.SECRET_KEY = 'p7Kj0vFgFi55gsdv5vCcJqJQ52LGZTwD16s8093D';// 要上传的空间const bucket = "lucian-cao"
>```
>
>
>
>9.1 安装七牛包,
>
>```
>yarn add qiniu
>```
>
>9.3 回到profile.js 编写 8.1 的post请求接口
>
>```
>const upload_file = require("../utils/qn");const constant = require("../utils/constant");// 提交头像图片的接口router.post("/user/pic_info",upload.single("avatar"),(req,res)=>{ // 此处的avatar 为user_pic_info.html页面 上传图片标签的name属性(async function(){let userInfo=await common.getUserInfo(req,res)   /*       1接受上传图片的对象req.file       2上传到七牛云服务器       3将七牛云返回对象的key属性保存操数据库       4 返回上传成功   */        // 1接受上传图片的对象req.file   let file=req.file//将图片上传到本地服务器的avatar文件夹中   // console.log(file) //获取本次上传图片的一些信息   /*       {           fieldname: 'avatar',           originalname: 'avatar1.png',           encoding: '7bit',           mimetype: 'image/png',           destination: 'public/news/upload/avatar',           filename: '95471240eb3fd1dd3577b93a1e368744',           path: 'public\\news\\upload\\avatar\\95471240eb3fd1dd3577b93a1e368744',           size: 15632       }   */    // 2上传到七牛云服务器   // upload_file(上传后的名字，上传的图片路径)   //上传的图片相对路径, 从项目文件夹出发   try{//上传有可能出错，因此需要捕获错误       var retObj=await upload_file(file.originalname, `${file.destination}/${file.filename}`)        // console.log(retObj)         /*           返回一个对象：{           hash: 'FtjN3dN5gSQCE_WevHcSX3pZMmNA',           key: 'image/avatar/avatar.png'   ，在浏览器中 添加外链域名作为前缀（在七牛云的文件管理中找） 即可访问此图片           又或者，点击图片右侧的更多，复制外链，直接在浏览器中寻找                   即：http://qtju0iulu.hn-bkt.clouddn.com/image/avatar/avatar.png     }     */   }catch(error){       console.log(error)       res.send({errmsg:'上传七牛云失败'})       return   }    // 3将七牛云返回对象的key属性保存操数据库   await handleDB(res,"info_user","update","数据库修改失败",`id=${userInfo[0].id}`,{       avatar_url:file.originalname   })   let data={       avatar_url:constant.QINIU_AVATAR_URL_PRE+ file.originalname       // http://qtju0iulu.hn-bkt.clouddn.com/image/avatar/  +  文件名.后缀   }   res.send({errno:"0",errmsg:"上传成功",data})})()})
>```
>
>9.4 在util文件夹下，创建constant.js 用于保存常量
>
>```
>// 上传七牛云保存的外链路径前缀const QINIU_AVATAR_URL_PRE="http://qtju0iulu.hn-bkt.clouddn.com/image/avatar/"module.exports={QINIU_AVATAR_URL_PRE}
>```
>
>9.5 解决刷新页面头像消失问题
>
>```
>1在base.html页面将 <img src="/news/images/person01.png" class="lgin_pic">改为  <img src="{{user_info.avatar_url}}" class="lgin_pic"> 同时来到 profile.js 的router.get("/profile",(req,res)=>{}中将data传给前端的avatar_url                  	avatar_url:userInfo[0].avatar_url?userInfo[0].avatar_url:"/news/images/worm.jpg"改为avatar_url:userInfo[0].avatar_url? 	(constant.QINIU_AVATAR_URL_PRE+userInfo[0].avatar_url):"/news/images/worm.jpg" 2 同样，首页也要如此处理，在routes文件夹下的index中const constant = require("../utils/constant");3详情页detail.js也是一样4 user.html 页面	<img src="/news/images/user_pic.png" alt="用户图片">替换为	<img src="{{user_info.avatar_url}}" alt="用户图片">5 detail.html的form表单 评论部分	<img src="/news/images/worm.jpg" alt="用户图标">替换为	 <img src="{{user_info.avatar_url}}" alt="用户图标">6common.js中abort404处	const constant = require("../utils/constant");	 avatar_url:constant.QINIU_AVATAR_URL_PRE+userInfo[0].avatar_url7将detail.html 关于作者头像设为 <img src="{{user_info.avatar_url}}" 
>```
>
>

### 10我的收藏页

>10.1 在profile中编写处理get请求的接口
>
>```
>// 展示收藏页面router.get("/user/collection",(req,res)=>{// 因为只是提交，没有post，所以可以自定义请求路径(async function(){   let userInfo=await common.getUserInfo(req,res)  let {p=1} =req.query  let currentPage=p  let counts=await handleDB(res,"info_user_colletion","sql","查询数据库出错",  `select count(*) from info_user_collection where user_id=${userInfo[0].id} `)   let totalPage=Math.ceil(counts[0]["count(*)"]/10)  //固定每页显示10条,也可以设置前端端传递一个显示每页条数的参数   console.log(totalPage)    let data={      currentPage,      totalPage,   //    colletionNewsList  }   res.render("news/user_collection",data)})()})
>```
>
>10.2 在user.html 中改变a标签的链接
>
>```
><li><a href="/user_collection" target="main_frame">我的收藏</a></li>
>```
>
>10.3修改user_collection.html link 使得样式生效，同时在最后面的js代码中的success
>
>```
>callback: function(current) {	 // 点击分页按钮时触发，current为当前页，用于向后端请求第几页数据	location.href="http://localhost:3000/user/collection?p="+current// 向后端发送查询页    alert('ok!');}
>```
>
>10.4 在10.1的基础上，补充data数据内容
>
>```
>//先查询登录用户收藏过的新闻的id（分页查询） 后查询info_news 表的标题 和创建时间      let collectionNewsIdList=await handleDB(res,"info_user_collection","find","查询数据库出错",   `user_id=${userInfo[0].id } limit ${(currentPage-1)*10},10`)   let collectionNewsList=[]   // 遍历数组，通过news_id 去查询info_news表   for(var i=0;i<collectionNewsIdList.length;i++){       let ret=await handleDB(res,"info_news","sql","数据库查询出错",       `select title,create_time from info_news where id=${collectionNewsIdList[i].news_id}`)       collectionNewsList.push(ret[0])   }   console.log( collectionNewsList)在data中将collectionNewsList传给前端
>```
>
>10.5来到user_collection.html 
>
>```
>{{each collectionNewsList}}       <li><a href="#">{{$value.title}}</a><span>{{$value.create_time |dateFormat}}</span></li>       {{/each}}
>```

# 补充知识-跨域（参考day15）




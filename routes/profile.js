const express=require("express");
const handleDB=require("../db/handleDB");

const multer = require('multer');
const upload = multer({ dest: 'public/news/upload/avatar' })	

const router=express.Router();
const md5=require("md5");
const Keys = require("../keys");

require("../utils/filter")
const common = require("../utils/common");
const constant = require("../utils/constant");


const upload_file = require("../utils/qn");


// 主页请求
router.get("/profile",(req,res)=>{
    (async function(){
        // let userInfo= await common.getUser(req,res)
        // if(!userInfo[0]){
        //     // 没有登录，就重定向到首页
        //     res.redirect("/")
        // }

        // 以上代码替换为以下函数
        let userInfo=await common.getUserInfo(req,res)
        let data={
            user_info:{
                nick_name:userInfo[0].nick_name,
                avatar_url:userInfo[0].avatar_url? constant.QINIU_AVATAR_URL_PRE+ userInfo[0].avatar_url:"/news/images/worm.jpg"
            } 
        }
        res.render("news/user",data)
    })()
})

// 展示用户基本资料 
router.all("/user_base_info",(req,res)=>{
    (async function(){
        // 获取用户登录信息，没有获取到就重定向到首页
        // let userInfo= await common.getUser(req,res)
        // if(!userInfo[0]){
        //     res.redirect("/")
        // }
        let userInfo=await common.getUserInfo(req,res)
       
        if(req.method==="GET"){
            console.log("收到get请求")
            let data={
                nick_name:userInfo[0].nick_name,
                signature:userInfo[0].signature,
                gender:userInfo[0].gender ? userInfo[0].gender:"MAN"
            }
            res.render("news/user_base_info",data)
        }else if(req.method==="POST"){
            console.log("收到post请求")
            /*
                1获取参数判空
                2修改数据库中的数据
                3返回操作成功
            */ 
            // 1获取参数判空
            let {nick_name, signature, gender}=req.body
            if(!nick_name ||!signature||!gender){
                res.send({errmsg:"参数错误"})
                return
            }
            // console.log(nick_name, signature, gender)
            // 2修改数据库中的数据
            await handleDB(res,"info_user","update","更新数据库出错",`id=${userInfo[0].id}`,{
                signature, 
                nick_name, 
                gender
            })
            // 3返回操作成功
            res.send({errno:"0",errmsg:"操作成功"})
        }  
        
    })()   
})

// 展示修改密码页面，以及保存修改后的密码
router.all("/user/pass_info",(req,res)=>{
    (async function(){
        // 获取用户登录信息，没有获取到就重定向到首页
        // let userInfo= await common.getUser(req,res)
        // if(!userInfo[0]){
        //     res.redirect("/")
        // }
        let userInfo=await common.getUserInfo(req,res)
        if(req.method==="GET"){
            res.render("news/user_pass_info")
        }else if(req.method==="POST"){
            console.log("收到post请求")
            /*
                1获取参数,判空(新旧密码) 
                2校验两次密码是否一致
                3校验旧密码是否正确
                4修改用户数据库中的password——hash
                5返回修改成功
            */ 
            // 1获取参数，判空(新旧密码) 
            let {old_password,new_password,new_password2}=req.body
            if(!old_password||!new_password||!new_password2){
                res.send({errmsg:"参数错误"})
                return
            }
            console.log(old_password,new_password,new_password2)
            // 2校验两次密码是否一致
            if(new_password!==new_password2){
                res.send({errmsg:"两次密码不一致"})
                return
            }
            // 3校验 用户密码是否正确，不正确 则return
            if(md5(md5(old_password)+Keys.password_salt)!== userInfo[0].password_hash){
                res.send({errmsg:"旧密码不正确，修改失败"});
                return;
            }
            // 4修改用户数据库中的password——hash
            await handleDB(res,"info_user","update","更新数据库出错",`id=${userInfo[0].id}`,{
                password_hash:md5(md5(new_password)+Keys.password_salt)
            })
            // 5返回修改成功
            res.send({errno:"0",errmsg:"操作成功"})
        }  
        
    })()   
})

// 展示修改头像页面
router.get("/user/pic_info",(req,res)=>{
    (async function(){
        let userInfo=await common.getUserInfo(req,res)
        // console.log("头像get请求")
        res.render("news/user_pic_info")
    })()
})

// 提交头像图片的接口
router.post("/user/pic_info",upload.single("avatar"),(req,res)=>{
      // 此处的avatar 为user_pic_info.html页面 上传图片标签的name属性
    (async function(){
    let userInfo=await common.getUserInfo(req,res)

        /*
            1接受上传图片的对象req.file
            2上传到七牛云服务器
            3将七牛云返回对象的key属性保存操数据库
            4 返回上传成功
        */ 
            // 1接受上传图片的对象req.file
        let file=req.file//将图片上传到本地服务器的avatar文件夹中
        // console.log(file) //获取本次上传图片的一些信息
        /*
            {
                fieldname: 'avatar',
                originalname: 'avatar1.png',
                encoding: '7bit',
                mimetype: 'image/png',
                destination: 'public/news/upload/avatar',
                filename: '95471240eb3fd1dd3577b93a1e368744',
                path: 'public\\news\\upload\\avatar\\95471240eb3fd1dd3577b93a1e368744',
                size: 15632
            }
        */ 

        // 2上传到七牛云服务器
        // upload_file(上传后的名字，上传的图片路径)   //上传的图片相对路径, 从项目文件夹出发
        try{//上传有可能出错，因此需要捕获错误
            var retObj=await upload_file(file.originalname, `${file.destination}/${file.filename}`) 
            // console.log(retObj) 
             /*
                返回一个对象：{
                hash: 'FtjN3dN5gSQCE_WevHcSX3pZMmNA',
                key: 'image/avatar/avatar.png'   ，在浏览器中 添加外链域名作为前缀（在七牛云的文件管理中找） 即可访问此图片
                又或者，点击图片右侧的更多，复制外链，直接在浏览器中寻找
                        即：http://qtju0iulu.hn-bkt.clouddn.com/image/avatar/avatar.png
          }
          */
        }catch(error){
            console.log(error)
            res.send({errmsg:'上传七牛云失败'})
            return
        } 
        // 3将七牛云返回对象的key属性保存操数据库
        await handleDB(res,"info_user","update","数据库修改失败",`id=${userInfo[0].id}`,{
            avatar_url:file.originalname
        })
        let data={
            avatar_url:constant.QINIU_AVATAR_URL_PRE+ file.originalname
            // http://qtju0iulu.hn-bkt.clouddn.com/image/avatar/  +  文件名.后缀
        }
        res.send({errno:"0",errmsg:"上传成功",data})
    })()
  
})

// 展示收藏页面
router.get("/user/collection",(req,res)=>{
    // 因为只是提交，没有post，所以可以自定义请求路径
    (async function(){
        let userInfo=await common.getUserInfo(req,res)

       let {p=1} =req.query
       let currentPage=p
       let counts=await handleDB(res,"info_user_colletion","sql","查询数据库出错",
       `select count(*) from info_user_collection where user_id=${userInfo[0].id} `)
        let totalPage=Math.ceil(counts[0]["count(*)"]/10)  //固定每页显示10条,也可以设置前端端传递一个显示每页条数的参数
        console.log(totalPage)

        //先查询登录用户收藏过的新闻的id（分页查询） 后查询info_news 表的标题 和创建时间   
        let collectionNewsIdList=await handleDB(res,"info_user_collection","find","查询数据库出错",
        `user_id=${userInfo[0].id } limit ${(currentPage-1)*10},10`)

        let collectionNewsList=[]
        // 遍历数组，通过news_id 去查询info_news表
        for(var i=0;i<collectionNewsIdList.length;i++){
            let ret=await handleDB(res,"info_news","sql","数据库查询出错",
            `select title,create_time from info_news where id=${collectionNewsIdList[i].news_id}`)
            collectionNewsList.push(ret[0])
        }
        console.log( collectionNewsList)
         let data={
           currentPage,
           totalPage,
           collectionNewsList
       }
        res.render("news/user_collection",data)
    })()
})
module.exports=router
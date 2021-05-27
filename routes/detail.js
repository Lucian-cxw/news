const express=require("express");
const handleDB=require("../db/handleDB");
const router=express.Router();
require("../utils/filter")
const common = require("../utils/common");
const constant = require("../utils/constant");


router.get("/news_detail/:news_id",(req,res)=>{
    
    (async function(){

        // let user_id=req.session["user_id"];
        // let result=[];
        // if(user_id){
        //     // 如果获取到了user——id，还要在查询数据库，确认是有效的
        //     result=await handleDB(res,"info_user","find","查询数据库出错",`id='${user_id}'`);
        // }

        // 通过工具函数获取用户信息
        let userInfo=await common.getUser(req,res);

        // 右侧点击查询
        let result3= await handleDB(res,"info_news","sql","查询数据库出错","select * from info_news order by clicks desc limit 6");

        // 左侧新闻内容的查询
        let {news_id}=req.params;
        let newsRes=await handleDB(res,"info_news","find","查询数据库出错",`id=${news_id}`);
        // 确保数据id为news_id这篇新闻在数据库中存在，才能继续后续操作
        if(!newsRes[0]){
            // 传递 data ，用于显示登录所需的用户名 头像
            // let data={
            //     user_info:userInfo[0] ? {
            //         nick_name:userInfo[0].nick_name,
            //         avatar_url:userInfo[0].avatar_url
            //     } :false
            // }
            // res.render("news/404",data);
            // 查不到就返回

            // 采用abort404 工具函数处理
            common.abort404(req,res);
            return
        }

        // 点击数加1
        newsRes[0].clicks+=1;
        await handleDB(res,"info_news","update","数据库更新出错",`id=${news_id}`,{clicks:newsRes[0].clicks});

        // 登的用户是不是收藏了这篇新闻，传一个布尔值给模板
        let isCollected=false;
        // 查询数据库，查看表中的info_user_colletion是否收藏，同时判断用户是否登录，登录了才能收藏

        if(userInfo[0]){//验证是否登录
           let collectionRes= await handleDB(res,"info_user_collection","find","查询数据库出错",`user_id=${userInfo[0].id} and news_id=${news_id}`);
            if(collectionRes[0]){//验证是否收藏
                isCollected=true;
            }
        }
        // 查询和这篇新闻相关的评论，查询结果为一个数组
        let commonRes=await handleDB(res,'info_comment','find',"数据库查询出错",
        `news_id=${news_id} order by create_time desc`)

        // 给commentRes中每个元素进行处理，添加commenter属性
        for(let i=0;i<commonRes.length;i++){
               // 查询info_user表，根据conmentRes[i]中的user_id
            let commenterRes=await handleDB(res,'info_user','find',"数据库查询出错",`id=${commonRes[i].user_id}`)
            commonRes[i].commenter={ 
                nick_name:commenterRes[0].nick_name,
                avatar_url:commenterRes[0].avatar_url ?constant.QINIU_AVATAR_URL_PRE+commenterRes[0].avatar_url :"/news/images/worm.jpg",
                // avatar_url:commenterRes[0].avatar_url ?  
                // constant.QINIU_AVATAR_URL_PRE+commenterRes[0].avatar_url :"/news/images/worm.jpg",  
            }
            if(commonRes[i].parent_id){
                // 如果有父评论，查询其内容 和昵称
                var parentComment= await handleDB(res,"info_comment","find","数据库查询失败",`id=${commonRes[i].parent_id}`)
                var parentUserInfo= await handleDB(res,"info_user","find","数据库查询失败",`id=${parentComment[0].user_id}`)
    
                commonRes[i].parent={
                    user:{
                        nick_name:parentUserInfo[0].nick_name,
    
                    },
                    content:parentComment[0].content
                }
            }
        }

        // 把登录用户 曾点过赞的评论全部查出来，以数组 id的形势返回给前端
        let user_like_comments_ids=[];
        if(userInfo[0]){
            let User_like_Res=await handleDB(res,"info_comment_like","find","数据库查询出错",
            `user_id=${userInfo[0].id}`);

            // 遍历User_like_Res ，获取每个元素的id，插入到user_like_comments_ids
            User_like_Res.forEach(el=>{
                user_like_comments_ids.push(el.comment_id)
            })
        }

        // 查询新闻作者的信息，返回给前端
        let autherInfo=await handleDB(res,"info_user","find","查询数据库出错",`id=${newsRes[0].user_id}`)
        // 查看该作者，发布新闻条数
        let autherNewsCount=await handleDB(res,"info_news","sql",
         "查询数据库出错",`select count(*) from info_news where user_id=${autherInfo[0].id}`)

        //  查询作者粉丝数 查看info_user_fans表
        let autherFansCount=await handleDB(res,"info_user_fans","sql","查询粉丝数数据库出错",
            `select count(*) from info_user_fans where followed_id=${autherInfo[0].id}`)

         // 登的用户是不是关注了作者，传一个布尔值给模板
         let isFollow=false;
         // 查询数据库，查看表中的info_user_colletion是否收藏，同时判断用户是否登录，登录了才能收藏
 
         if(userInfo[0]){//验证是否登录
            let followRes= await handleDB(res,"info_user_fans","find","查询数据库出错",
            `follower_id=${userInfo[0].id} and followed_id=${autherInfo[0].id}`);
             if(followRes[0]){//验证是否收藏
                 isFollow=true;
             }
         }
         console.log(isFollow)
        //  作者头像设置
         autherInfo[0].avatar_url=autherInfo[0].avatar_url ?  
            constant.QINIU_AVATAR_URL_PRE+autherInfo[0].avatar_url :"/news/images/worm.jpg"

        let data={
            user_info:userInfo[0] ? {
                nick_name:userInfo[0].nick_name,
                avatar_url:userInfo[0].avatar_url? constant.QINIU_AVATAR_URL_PRE+userInfo[0].avatar_url:"/news/images/worm.jpg"
            } :false,
            newsClick:result3,
            newsData:newsRes[0],
            isCollected,
           commentList :commonRes,
           user_like_comments_ids,
           autherInfo:autherInfo[0],
           autherNewsCount:autherNewsCount[0]["count(*)"],
           autherFansCount:autherFansCount[0]["count(*)"],
           isFollow
        };
       res.render("news/detail",data);
    })();
   
});

// 处理收藏和取消收藏
router.post("/news_detail/news_collect",(req,res)=>{
    (async function(){
        // 点击收藏，向info_user_collection 添加记录，取消则删除一条记录

        // 传参，那个用户，收藏那篇新闻

        // 前端返回一个action用于表示收藏还是取消收藏

        /*业务流程 ：（适用于所有需要登录才能操作的接口）
            1获取登录用户信息，没有获取到，直接return
            2 获取参数，判空
            3查询数据库，判断新闻是否存在，不存在就return，确保新闻有效性
            4 根据action的值收藏或者取消收藏
            5返回操作成功
        */ 
            // 1获取登录用户信息，没有获取到，直接return
        let userInfo= await common.getUser(req,res);
        
        if(!userInfo[0]){//没有登录就return
            res.send({errno:"4101",errmsg:"用户未登录"});
            return ;
        }
        // 2 获取参数，判空
        let {news_id,action}=req.body;
        if(!news_id||!action){
            res.send({errmsg:"参数错误"});
            return
        }
        // 3查询数据库，判断新闻是否存在，不存在就return，确保新闻有效性
        let newsRes=await handleDB(res,"info_news","find","数据库查询出错",`id=${news_id}`);
        if(!newsRes[0]){
            res.send({errmsg:"参数错误2"})
            return
        }
        // 4 根据action的值收藏或者取消收藏
        if(action=="collect"){
            await handleDB(res,"info_user_collection","insert","数据库添加失败",{
                user_id:userInfo[0].id,
                news_id
            })
        }else{
            await handleDB(res,"info_user_collection","delete","数据库添加失败",`user_id=${userInfo[0].id} and news_id=${news_id}`)
        }
        // 5返回操作成功
        res.send({errno:0,errmsg:"操作成功"})

        

    })();
})

// 处理评论和回复的请求接口
router.post("/news_detail/news_comment",(req,res)=>{
    (async function(){
        /*
            需要的参数：
                1一种情况评论新闻： 评论内容 新闻id
                2另一种情况。回复别人的评论： 回复内容  回复对象 parent_id
            业务流程：
                1获取登录用户的信息 ，获取不到就return
                2获取参数，判空
                3 查询新闻，看看新闻是否存在
                4往数据库插入数据（如果有parent_id，这个属性也要记得插入）
                5返回成功响应
        */ 
        // 1获取登录用户的信息 ，获取不到就return
        let userInfo= await common.getUser(req,res);
        if(!userInfo[0]){//没有登录就return
            res.send({errno:"4101",errmsg:"用户未登录"});
            return ;
        }
        // 2获取参数，判空
        let {news_id,comment,parent_id=null}=req.body;
        if(!news_id||!comment){
            res.send({errmsg:"参数错误"});
            return
        }
        // 3 查询新闻，看看新闻是否存在
        let newsRes=await handleDB(res,"info_news","find","数据库查询出错",`id=${news_id}`);
        if(!newsRes[0]){
            res.send({errmsg:"参数错误2"})
            return
        }
        // 4往数据库插入数据（如果有parent_id，这个属性也要记得插入）
        let commentObj={
            user_id:userInfo[0].id,
            news_id:news_id,
            content:comment,
            // create_time:new Date().toLocaleString()//不知道为什么，插入的时间格式，数据库识别不了
            create_time:common.getcurrentDate()//调用自定义时间格式
        }
        if(parent_id){//如果传了parent_id 就设置这个属性
            commentObj.parent_id=parent_id
            // 有父评论，查询父评论和父评论者的信息
           var parentComment= await handleDB(res,"info_comment","find","数据库查询失败",`id=${parent_id}`)

            var parentUserInfo= await handleDB(res,"info_user","find","数据库查询失败",`id=${parentComment[0].user_id}`)

        }
       let insertRes= await handleDB(res,"info_comment","insert","数据库查询出错",commentObj)
        // 5返回成功响应
        let data={
            user:{
                avatar_url:userInfo[0].avatar_url ? constant.QINIU_AVATAR_URL_PRE+ userInfo[0].avatar_url:"/news/images/worm.jpg",
                nick_name:userInfo[0].nick_name
            },
            content:comment,
            create_time:commentObj.create_time,
            news_id,
            id:insertRes.insertId,//新增的这条评论的id
            // 前端传递了parent——id有就用，没有就给null
            parent:parent_id?{
                user:{
                    nick_name:parentUserInfo[0].nick_name,

                },
                content:parentComment[0].content
            }:null
        }
        res.send({errno:"0",errmsg:"评论成功",data})
    })()
})

// 处理点赞和取消点赞
router.post("/news_detail/comment_like",(req,res)=>{
    (async function(){
        /*
            参数： 哪一个用户（通过登录直接获取），点赞了哪一个 pinglun
            点赞和取消点赞，都是此接口处理，通过action 获取参数

            业务流程：
                1 回去登录用户信息
                2获取参数，判空
                3查询数据库，看评论是否存在，不存在就return
                4根据action 的值是add还是remove，确定点赞还是取消点赞行为
                    把用户点赞的评论，作为记录 保存到info_comment_like表
                    点赞数 在info_comment 的立刻——count字段
             5 返回操作成功
                
        */ 
         // 1获取登录用户的信息 ，获取不到就return
         let userInfo= await common.getUser(req,res);
         if(!userInfo[0]){//没有登录就return
             res.send({errno:"4101",errmsg:"用户未登录"});
             return ;
         }
         // 2获取参数，判空
         let {comment_id,action}=req.body;
         if(!comment_id||!action){
             res.send({errmsg:"参数错误"});
             return
         }
        //  console.log(comment_id,action)

         // 3查询数据库，看评论是否存在，不存在就return
        let commentRes=await handleDB(res,"info_comment","find","数据库查询出错",`id=${comment_id}`);
        if(!commentRes[0]){
            res.send({errmsg:"参数错误2"})
            return
        }
      
       
        // 4根据action 的值是add还是remove，确定点赞还是取消点赞行为
        if(action=="add"){
            // 把用户点赞的评论，作为记录 保存到info_comment_like表点赞数 在info_comment 的立刻——count字段
            await handleDB(res,"info_comment_like","insert","数据库添加出错",{
                comment_id,
                user_id:userInfo[0].id
            })
            
            var like_count=commentRes[0].like_count ?commentRes[0].like_count+1:1

        }else{
            //取消点赞， 删除info_comment_like 表记录
            await handleDB(res,"info_comment_like","delete","数据库删除出错",`comment_id=${comment_id} and user_id=${userInfo[0].id}`)
            var like_count=commentRes[0].like_count ?commentRes[0].like_count-1:0

        }

        // 更新数据库中的点赞数，
        await handleDB(res,"info_comment","update","数据库更新失败",`id=${comment_id}`,{like_count})
        // 5 返回操作成功
        res.send({errno:"0",errmsg:"操作成功"})
    })()
})

// 关注和取消关注
router.post("/news_detail/followed_user",(req,res)=>{
    (async function(){
        /*业务流程 ：（适用于所有需要登录才能操作的接口）
            1获取登录用户信息，没有获取到，直接return
            2 获取参数，判空
            3查询数据库，判断新闻是否存在，不存在就return，确保user_id是有的
            4 根据action的值关注和取消关注
            5返回操作成功
        */ 
            // 1获取登录用户信息，没有获取到，直接return
        let userInfo= await common.getUser(req,res);
        
        if(!userInfo[0]){//没有登录就return
            res.send({errno:"4101",errmsg:"用户未登录"});
            return ;
        }
        // 2 获取参数，判空
        let {user_id,action}=req.body;
        if(!user_id||!action){
            res.send({errmsg:"参数错误"});
            return
        }
        // 3查询数据库，判断新闻是否存在，不存在就return，确保user_id是有的
        let newsRes=await handleDB(res,"info_user","find","数据库查询出错",`id=${user_id}`);
        if(!newsRes[0]){
            res.send({errmsg:"参数错误2"})
            return
        }
        // 4 根据action的值关注还是取消关注
        if(action=="follow"){
            await handleDB(res,"info_user_fans","insert","数据库添加失败",{
                follower_id:userInfo[0].id,
                followed_id:user_id
            })
        }else{
            await handleDB(res,"info_user_fans","delete","数据库添加失败",`follower_id=${userInfo[0].id} and followed_id=${user_id}`)
        }
        // 5返回操作成功
        res.send({errno:0,errmsg:"操作成功"})

        

    })();
})

module.exports=router;
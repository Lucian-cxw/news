
const express=require("express");
const AppConfig=require("./config");

const app=express();

// 使用配置文件,函数导出法
// appConfig(app);

// 使用配置文件,对象导出法,利用构造函数
let appConfig=new AppConfig(app);

// 使用配置文件,对象导出法,利用自定义函数run
// let appConfig=new AppConfig(app);
// appConfig.run();



app.listen(appConfig.listenPort,()=>{
    console.log(`正在监听${appConfig.listenPort}`);
});
### 后台管理系统基本模板

#### 1. 用户管理

获取User表中的全部数据
#### 2. 角色管理
#### 3. 元数据管理

### 问题
#### 1. 跨域问题
- 前端解决的方法

```
dataType : "JSONP",前端可解决跨域问题
```
- 其他方法见

[一个总结跨域问题比较优秀的博客](https://blog.csdn.net/qq_23832313/article/details/81946838)

#### 2. win10安装mongodb 出现net start MongoDB 服务名无效错误解决
- 将data目录下的所有文件删除
- 使用**管理员模式**打开cmd,运行
```
 mongod --config "D:\mongDB\config\mongodb.conf" --install --serviceName "mongodb"
```
- 运行 **net start mongodb**

#### 3.可视化接口平台Yapi的搭建部署（windows本地)
##### 3.1 安装环境
- node.js
- MongoDB
- git
##### 3.2 部署
- 前提是必须在MongoDB中有一个和yapi中的config.json相对应的数据库
```
mkdir yapi
cd yapi
git clone https://github.com/YMFE/yapi.git vendors //或者下载 zip 包解压到 vendors 目录
cp vendors/config_example.json ./config.json //复制完成后请修改相关配置
cd vendors
npm install --production --registry https://registry.npm.taobao.org
npm run install-server //安装程序会初始化数据库索引和管理员账号，管理员账号名可在 config.json 配置,这个会出错，可以忽略
node server/app.js //启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
```
**博客借鉴:** https://www.darlang.com/2019/02/yapi-jiekouwendangneiwangbushudao-windowslinux/
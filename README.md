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


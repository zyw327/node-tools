# node-tools
### 递归创建文件夹
```javascript
const mkdir = require('./lib/mkdir');
mkdir('./a/b/c/d/f');
```
### 递归删除文件夹及文件

```javascript
const rmdir = require('./lib/rmdir');
rmdir('./a');
```

### 脚本注意事项

    使用redis，mysql,mongodb时，脚本执行的完成一定要关闭连接，避免连接得不到释放而造成连接数爆满，影响redis,mysql,mongodb的正常使用。
## node-cli node开发命令行工具从0到1

> 参考：
> [使用 npm 构建一个简单的命令行工具](https://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm)
> [阮一峰 Node.js 命令行程序开发教程](https://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)

### 1. npm init


### 2. 安装 commander

命令行工具

```bash
npm install commander -s
```

> 注：
> commander的参数${}字符串参数 需要用单引号‘’， 双引号的"${}"会被解析成变量

### 3. 安装 chalk

命令行高亮提示

```bash
npm install chalk -s
```

### 4. 使用

```bash
# 本地安装
npm link

# 卸载
npm unlink
```
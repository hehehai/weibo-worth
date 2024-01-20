<div align="center">

<h1>微博价值评估</h1>
一键评估微博账号价值金额，生成图片
<br/>

![image](https://github.com/hehehai/weibo-worth/assets/12692552/6596c540-2c73-45ca-a2e5-e1cf714c6bbd)

</div>

> [MemoMe](https://speechless.fun/)
> 一键轻松备份新浪微博，把文字、图片、评论，导出成 PDF 到本地

## ⌨️ 安装&运行

配置环境变量，账号历史消息的获取需要微博 Cookie。 在根目录创建 `.env.local` 文件(参考 `.env.example`)，之后复制下面内容将`Cookie`替换为个人微博 Cookie

```txt
SELF_COOKIE=Cookie
```

```shell
npm install
npm run dev
```

打开 `http://localhost:3000`

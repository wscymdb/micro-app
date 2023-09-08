## 主应用的配置

这里主应用可以是任意技术栈，我这使用 jquery 原生的，至于 vue、react 都是一样的

**注意一** 这里需要注意的是因为主应用使用的是 jquery 所以路由跳转使用的是 history 比如 http://www.a.com是项目的地址 如果捕获的规则是/vue 这时候我们输入http://www.a.com/a 其实他是去找/a 文件或/a 文件夹下的 index.html 因为没有所以会报错 这里不晓得为 qiankun 没拦截到 大概猜想一下解决思路 就是我们自己拦截/a 不让他去跳转 这个后续继续研究 所以要使用 hash 模式进行拦截 这样就不会跳转了

**注意二** 官方原话： 这里也可以直接写 activeRule: '#/app-hash'，但是如果主应用是 history 模式或者主应用部署在非根目录，这样写不会生效。 所以要写成函数的形式 具体看下面的 demo

```js
const { registerMicroApps, start, addGlobalUncaughtErrorHandler } = qiankun

const activeRule = (hash) => (location) => location.hash.startsWith(hash)

registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:10000',
    container: '#vapp',
    activeRule: activeRule('#/vue-app'),

    // 这里不能这样写的原因是  基座是jq 所以路由是histry模式 如果这样写不生效，所以不会触发qiankun的匹配机制
    // activeRule: '#/vue'
  },
])
// 无法加载提示错误
addGlobalUncaughtErrorHandler((event) => {
  console.error(event)
  const { message: msg } = event
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    console.error('子应用加载失败，请检查应用是否可运行')
  }
})

start()
```

## 微应用

步骤官网有写 这里只说细节点

微应用使用的是 vue 的 hash 路由模式，history 的尚未测试

**注意一** 官方原话如下

```
vue-router 的 hash 模式下不支持设置路由的 base，需要额外新建一个空的路由页面，将其他所有路由都作为它的 children：
const routes = [
  {
    path: '/vue-app',
    name: 'My',
    component: Home,
    children: [
      // 其他的路由都写到这里
    ],
  },
];
```

但是我要说就是主应用中匹配的 activeRule 一定要和空路由的 path 保持一致 不然你只能获取到空路由对应的页面的内容 无法获取其下对应的子路由

原因
如果不保持一致 主应用跳转匹配的是 http:xxx:11/#/vue qiankun 拦截到了加载子应用的内容 但是子应用的路由是这样的 http:xxx:22/vue-app/about 那么在主应用中匹配子应用的其他路由就是这样的 http:xxx:11/#/vue/vue-app/about 所以匹配不到 （#/vue/ 是一定要包含的 qiankun 考这个匹配呢）

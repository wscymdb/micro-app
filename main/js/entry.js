const {
  registerMicroApps,
  start,
  addGlobalUncaughtErrorHandler,
  initGlobalState,
} = qiankun

// 乾坤3.0 弃用了这个方法
const globalState = initGlobalState({
  name: '你好',
})

const activeRule = (hash) => (location) => location.hash.startsWith(hash)

registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:10000',
    // entry: 'http://10.168.162.97:80',
    container: '#vapp',
    // activeRule: activeRule('#/vue-app'),
    activeRule: activeRule('#/vue-app'),

    // 这里不能这样写的原因是  基座是jq 所以路由是histry模式 如果这样写不生效，所以不会触发qiankun的匹配机制
    // activeRule: '#/vue'

    props: {
      title: 'xxx',
    },
  },
])

addGlobalUncaughtErrorHandler((event) => {
  console.error(event)
  const { message: msg } = event
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    console.error('子应用加载失败，请检查应用是否可运行')
  }
})

start()

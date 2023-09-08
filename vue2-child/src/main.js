import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

let instance = null

function render(props = {}) {
  // 当主应用调用微应用时 会在mount中传入一个props 这个prop是会包含一个container 也就是微应用显示在父应用的哪个容器内
  // 下面在$mount的时候会做判断如果是作为子应用就渲染主应用传入的container的#app元素内部
  const { container } = props
  // console.log(container.querySelector('#app'))

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// 如果是qiankun引用

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}

// 判断是否是独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('vue app bootstrap')
}

export async function mount(props) {
  console.log('vue app mount', props)
  render(props)
}

export async function unmount() {
  console.log('vue app unmount')
  instance.$destroy()
  instance = null
}

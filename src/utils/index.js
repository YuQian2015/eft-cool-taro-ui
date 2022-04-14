import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

let throttleTimer = {}
// TODO 多处地方同时调用throttle时，如果第一个传的是ahead = true，另外一个传的是ahead = false, 有可能造成两个的method方法都不会被调用
export const throttle = ({ method, delay = 300, ahead = false, type = 'common' }) => {
  // console.log('已阻止频繁触发..........', ahead)
  if (ahead && !throttleTimer[type]) {
    method()
  }
  clearTimeout(throttleTimer[type])
  throttleTimer[type] = setTimeout(() => {
    if (!ahead) {
      method()
    }
    clearTimeout(throttleTimer[type])
    throttleTimer[type] = undefined
  }, delay);
}

export const vibrateShort = () => {
  if (process.env.TARO_ENV != 'h5') {
    Taro.vibrateShort()
  }
}

export const routerGoBack = () => {
  if (process.env.TARO_ENV === 'h5') {
    if (JSON.parse(localStorage.getItem('taroRouterStore')).key == 0) {
      const version = Taro.getStorageSync('version')
      if (version == '3') {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.inappbrowserClose) {
          window.webkit.messageHandlers.inappbrowserClose.postMessage('')
        }
      } else {
        if (window.inappbrowser && window.inappbrowser.close) {
          window.inappbrowser.close()
        }
      }
    }
    document.querySelector('.taro_page:last-child').classList.add("remove")
    const last2 = document.querySelector('.taro_page:nth-last-child(2)')
    if (last2) {
      last2.classList.add('show')
    }
    setTimeout(() => {
      if (last2) {
        last2.classList.remove('show')
      }
      Taro.navigateBack()
    }, 400)
  }
}

export const routerGoIn = (url) => {
  if (process.env.TARO_ENV === 'h5') {
    const last = document.querySelector('.taro_page:last-child');
    last.classList.add("in")
    setTimeout(() => {
      Taro.navigateTo({
        url
      })
      last.classList.remove("in")
    }, 400)
  }
}

// 类组件装饰器
export const pageAnimation = (target) => {
  // target.prototype.goInDir = 'left';  // 为类添加实例属性
  const { componentWillMount, componentDidMount, beforeRouteLeave } = target.prototype
  const render = target.prototype.render
  target.prototype.beforeRouteLeave = function (from, to, next) {
    const pages = Taro.getCurrentPages() // 获取所有的页面
    const length = pages.length // 获取当前路由的层级
    function leave() {
      if (length > 1 && pages[length - 2]) {
        const previewPageDom = pages[length - 2].vnode.dom.parentNode
        previewPageDom.style.display = 'block'
      }
      pages[length - 1].vnode.dom.classList.add('right-out')
      setTimeout(() => {
        target.back = true
        Taro.navigateBack()
      }, 300)
    }
    console.log('是否返回：', target.back);
    if (!target.back) {
      next(false)
    } else {
      next(true)
    }
    if (beforeRouteLeave) {
      beforeRouteLeave.bind(this)(from, to, flag => {
        if (flag) {
          leave()
        }
      })
    } else {
      leave()
    }
  }

  target.prototype.componentWillMount = function () {
    // console.log(target.prototype.constructor.name)
    target.back = false
    const pages = Taro.getCurrentPages() // 获取所有的页面
    const length = pages.length // 获取当前路由的层级
    if (length > 1 && pages[length - 2]) {
      const previewPageDom = pages[length - 2].vnode.dom.parentNode
      previewPageDom.style.display = 'block'
      setTimeout(() => {
        previewPageDom.style.display = 'none'
      }, 400)
    }
    componentWillMount && componentWillMount.bind(this)()
  }
  target.prototype.componentDidMount = function () {
    componentDidMount && componentDidMount.bind(this)()
  }

  target.prototype.render = function () {
    const renderResult = render.bind(this)()
    return <View className='EPage-animation right-in'>
      {renderResult}
    </View>
  }
}

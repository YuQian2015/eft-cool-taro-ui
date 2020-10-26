import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import PropTypes from 'prop-types'
import ERefresher from '../ERefresher/ERefresher'
import { throttle, vibrateShort } from '../../utils'

/**
 * 监听 EContent 的事件
 * 针对刷新、内容高度、加载状态的控制
 * ESetHeader、ESetFooter、ERefreshStart、ERefreshEnd、
 */
export default class EContent extends Component {

  static options = {
    addGlobalClass: true
  }

  constructor() {
    super(...arguments)
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    this.state = {
      dragStyle: { //下拉框的样式
        top: 0 + 'px'
      },
      downDragStyle: { //下拉图标的样式
        height: 0 + 'px'
      },
      textStatus: 0,
      dragState: 0, //刷新状态 0不做操作 1刷新
      dragComplete: 0, // 拖拽状态的完成度
      windowHeight,
      scrollY: true,
      footerHeight: 0,
      headerHeight: 0,
      isRefreshing: false,
      focus: false
    }
    this.isTop = true
    this.needPrevent = false
    this.refresherConfig = {
      recoverTime: 300, // 回弹动画的时间时间 ms
      refreshTime: 500, // 刷新动画至少显示的时间 ms （用来展示刷新动画）
      threshold: 70, // 刷新的阈值 px  拉动长度（低于这个值的时候不执行）
      maxHeight: 200, // 可拉动的最大高度 px
      height: 60,  // 刷新动画占的高度 px
      showText: true, // 显示文字
      refreshText: ['下拉刷新', '释放刷新', '加载中'], // 刷新文字
      ...this.props.refresherConfig
    }
    this.scrollTop = this.props.scrollTop || 0
    this.pageIndex = Taro.getCurrentPages().length
  }

  componentWillMount() {
    console.log('加载Content——————————————')
    Taro.eventCenter.on('ESetHeader', this.header)
    Taro.eventCenter.on('ESetFooter', this.footer)
    Taro.eventCenter.on('ERefreshStart', this.showRefresh)
    Taro.eventCenter.on('ERefreshEnd', this.hideRefresh)
    Taro.eventCenter.on('focus', this.focus)
    Taro.eventCenter.on('blur', this.blur)

    if (process.env.TARO_ENV === 'h5') {
      window.addEventListener('resize', this.onresize)
    }
  }

  componentWillUnmount() {
    console.log('卸载Content——————————————')
    Taro.eventCenter.off('ESetHeader', this.header)
    Taro.eventCenter.off('ESetFooter', this.footer)
    Taro.eventCenter.off('ERefreshStart', this.showRefresh)
    Taro.eventCenter.off('ERefreshEnd', this.hideRefresh)
    Taro.eventCenter.off('focus', this.focus)
    Taro.eventCenter.off('blur', this.blur)

    if (process.env.TARO_ENV === 'h5') {
      window.removeEventListener('resize', this.onresize)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.scrollTop != nextProps.scrollTop) {
      this.scrollTop = nextProps.scrollTop
    }
    if (nextProps.refreshStatus === 2) {
      this.doRecover(true)
    }
    if (nextProps.refreshStatus === 1) {
      this.showRefresh()
    }
  }

  onresize = () => {
    const windowHeight = Taro.getSystemInfoSync().windowHeight
    this.setState({
      windowHeight
    })
  }

  /**
 * 触发加载更多
 *
 * @memberof Content
 */
  onScrollToLower = () => {
    throttle({
      method: () => {
        console.log('滑动到底部')
        !this.props.loading && this.props.hasMore && this.props.onScrollToLower && this.props.onScrollToLower()
      },
      ahead: true
    })
  }

  onScrollToUpper = () => { //滚动到顶部事件
    // console.log('滚动到顶部事件')
  }
  onScroll = (e) => {
    const { scrollTop } = e.detail
    if (process.env.TARO_ENV === 'h5') {
      this.scrollTop = scrollTop // 修复滚动不流畅的问题
    }
    const { onScrollUp, onScrollDown, onScroll, onScrollEnd } = this.props
    this.isTop = scrollTop <= 60 // 滚动到了顶部
    // deltaY在微信小程序适用
    if (scrollTop > 200) {
      onScrollUp && onScrollUp()
    } else {
      onScrollDown && onScrollDown()
    }

    throttle({
      method: () => {
        onScrollEnd && onScrollEnd(e)
      },
      delay: 100,
      type: 'scrollEnd'
    })

    onScroll && onScroll(e)

    // throttle({
    //   method: () => {
    //     console.log('开始滚动')
    //     Taro.eventCenter.trigger('scrollStart', {})
    //   },
    //   ahead: true,
    //   delay: 1000
    // })
    // throttle({
    //   method: () => {
    //     console.log('滚动结束')
    //     Taro.eventCenter.trigger('scrollEnd', {})
    //   },
    //   delay: 500
    // })
  }
  header = (rect) => {
    // 优化 Content 渲染频率
    throttle({
      method: () => {
        if (this.cacheHeader !== rect.height) {
          // console.log('计算header')
          const windowHeight = Taro.getSystemInfoSync().windowHeight
          this.cacheHeader = rect.height
          this.setState({
            headerHeight: rect.height,
            windowHeight
          })
        }
      },
      type: 'header'
    })
  }
  footer = (rect) => {
    // 优化 Content 渲染频率
    throttle({
      method: () => {
        if (this.cacheFooter !== rect.height) {
          // console.log('计算footer')
          const windowHeight = Taro.getSystemInfoSync().windowHeight
          this.cacheFooter = rect.height
          this.setState({
            footerHeight: rect.height,
            windowHeight
          })
        }
      },
      type: 'footer'
    })
  }
  focus = () => {
    this.setState({
      focus: true
    })
  }
  blur = () => {
    this.setState({
      focus: false
    })
  }

  touchStart = (e) => {
    this.start_p = e.touches[0];
  }
  touchmove = (e) => {
    if (this.refresherConfig.disabled) {
      return
    }
    if (this.state.isRefreshing) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      e.stopPropagation();
      return
    }
    if (!this.isTop) {
      this.start_p = e.touches[0];
      return
    }
    const start_x = this.start_p.clientX
    const start_y = this.start_p.clientY


    const move_p = e.touches[0] // 移动时的位置
    const move_x = move_p.clientX
    const move_y = move_p.clientY
    const deviationX = 0.30 // 左右偏移量(超过这个偏移量不执行下拉操作)

    //得到偏移数值
    let dev = Math.abs(move_x - start_x) / Math.abs(move_y - start_y);
    if (dev < deviationX) { // 当偏移数值大于设置的偏移数值时则不执行操作
      let pY = move_y - start_y;
      pY = Math.pow(10, Math.log10(Math.abs(pY)) / 1.3); // 拖动倍率
      let dragComplete = parseInt((pY / this.refresherConfig.threshold) * 100);
      if (dragComplete > 100) {
        dragComplete = 100
      }
      this.setState({
        dragComplete
      })
      if (move_y - start_y > 0) { // 下拉操作
        if (this.needPrevent) {
          e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
          e.stopPropagation();
        }
        if (pY >= this.refresherConfig.threshold) {
          if (this.state.dragState === 0) {
            vibrateShort()
            this.setState({ dragState: 1, textStatus: 1 })
          }
        } else {
          this.setState({ dragState: 0, textStatus: 0 })
        }
        if (pY >= this.refresherConfig.maxHeight) {
          pY = this.refresherConfig.maxHeight
        }
        this.setState({
          dragStyle: {
            top: pY + 'px',
          },
          downDragStyle: {
            height: pY + 'px'
          },
          scrollY: false//拖动的时候禁用
        })
      }
    }
  }
  touchEnd = (e) => {
    if (this.isTop) {
      this.needPrevent = true;
    } else {
      this.needPrevent = false
    }
    if (this.state.dragState === 1) {
      // 触发下拉刷新
      this.showRefresh()
      !this.props.loading && this.props.onRefresh && this.props.onRefresh()
    }
    this.recover()
  }
  doRecover = (force) => {
    if (this.props.refreshStatus !== 1 || force) {
      this.setState({
        dragState: 0,
        dragStyle: {
          top: 0 + 'px',
          transition: `all ${this.refresherConfig.recoverTime}ms`
        },
        downDragStyle: {
          height: 0 + 'px',
          transition: `all ${this.refresherConfig.recoverTime}ms`
        },
        scrollY: true,
        isRefreshing: false,
        textStatus: 0
      })
    }
  }
  recover() {//还原初始设置
    const refreshLimit = this.refresherConfig.refreshTime - (new Date - this.startTime)
    if (refreshLimit <= 0) {
      this.doRecover()
    } else {
      setTimeout(() => {
        this.doRecover()
      }, refreshLimit)
    }
  }

  showRefresh = () => {
    if (Taro.getCurrentPages().length === this.pageIndex) {
      throttle({
        method: () => {
          // console.log('显示刷新')
          this.startTime = new Date()
          const time = 0.2;
          this.setState({
            dragStyle: {
              top: this.refresherConfig.height + 'px',
              transition: `all ${time}s`
            },
            downDragStyle: {
              height: this.refresherConfig.height + 'px',
              transition: `all ${time}s`
            },
            dragComplete: 100,
            isRefreshing: true,
            textStatus: 2
          })
        },
        ahead: true,
        type: 'showRefresh'
      })
    }
  }

  hideRefresh = () => {
    if (Taro.getCurrentPages().length === this.pageIndex) {
      throttle({
        method: () => {
          // console.log('隐藏刷新')
          this.recover()
        },
        ahead: true,
        type: 'hideRefresh'
      })
    }
  }

  render() {
    const { dragStyle, downDragStyle, dragComplete, textStatus,
      footerHeight, headerHeight, isRefreshing, focus, windowHeight } = this.state;
    const { loading, hasMore, noMore, onScrollToLower, children, loadMoreThreshold, hasMoreText, noMoreText } = this.props

    const bottom = noMore
      ? <View className='no-more'>{noMoreText || '没有更多了'}</View>
      : hasMore
        ? <View className='load-more'>{hasMoreText || '加载中'}</View>
        : null

    let tabBarBottom = 0

    if (process.env.TARO_ENV === 'h5') {
      if (document.querySelector('.taro-tabbar__tabbar-bottom')) {
        tabBarBottom = document.querySelector('.taro-tabbar__tabbar-bottom').clientHeight
      }
    }

    return (
      <View className='EContent' style={{ height: `${windowHeight - footerHeight - headerHeight - tabBarBottom}px` }}>
        <View className='refresher' style={downDragStyle}>
          <View className='refresher-holder'>
            <ERefresher complete={dragComplete} isRefreshing={isRefreshing} />
            {
              this.refresherConfig.showText
                ? <View className='down-text'>{this.refresherConfig.refreshText[textStatus]}</View>
                : null
            }
          </View>
        </View>
        <ScrollView
          style={dragStyle}
          onTouchMove={this.touchmove}
          onTouchEnd={this.touchEnd}
          onTouchStart={this.touchStart}
          onScrollToUpper={this.onScrollToUpper}
          onScrollToLower={this.onScrollToLower}
          onScroll={this.onScroll}
          lowerThreshold={loadMoreThreshold >= 0 ? loadMoreThreshold : 100}
          enableBackToTop
          className='scroll-content'
          scrollY
          scrollWithAnimation
          scrollTop={this.scrollTop}
        >
          {children}
          {bottom}
          {focus ? <View className='keyboard'></View> : ""}
        </ScrollView>
      </View>
    )
  }
}
EContent.propTypes = {
  onRefresh: PropTypes.func,
  onScrollToLower: PropTypes.func
}

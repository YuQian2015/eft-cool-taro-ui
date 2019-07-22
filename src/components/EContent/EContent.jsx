import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import PropTypes from 'prop-types'
import ERefresher from '../ERefresher/ERefresher'
import { throttle, vibrateShort } from '../../utils'
import './EContent.scss'

let windowHeight = Taro.getSystemInfoSync().windowHeight

/**
 * 监听 EContent 的事件
 * 针对刷新、内容高度、加载状态的控制
 * ESetHeader、ESetFooter、ERefreshStart、ERefreshEnd、
 */
export default class EContent extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      dragStyle: { //下拉框的样式
        top: 0 + 'px'
      },
      downDragStyle: { //下拉图标的样式
        height: 0 + 'px'
      },
      downText: '下拉刷新',
      dragState: 0, //刷新状态 0不做操作 1刷新
      dragComplete: 0, // 拖拽状态的完成度
      scrollY: true,
      footerHeight: 0,
      headerHeight: 0,
      isRefreshing: false,
      focus: false
    }
    this.isTop = true
    this.needPrevent = false
    this.config = {
      recoverTime: 300, // 恢复未加载状态的时间 ms
      refreshTime: 500, // 刷新动画至少显示的时间 ms
      threshold: 70, // 刷新的阈值 px  拉动长度（低于这个值的时候不执行）
      maxY: 200, // 拉动的最大高度 px
      refresherHeight: 50  // 刷新动画占的高度 px
    }
    this.onScrollToLower = this.onScrollToLower.bind(this)
    this.onScrollToUpper = this.onScrollToUpper.bind(this)
    this.onScroll = this.onScroll.bind(this)

    this.touchStart = this.touchStart.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    this.touchmove = this.touchmove.bind(this)

    this.showRefresh = this.showRefresh.bind(this)
    this.hideRefresh = this.hideRefresh.bind(this)

    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)

    this.header = this.header.bind(this)
    this.footer = this.footer.bind(this)
  }

  static defaultProps = {
    loading: false,
    hasMore: false,
    onScrollToLower: null
  }
  componentWillMount() {
    console.log('加载Content——————————————')
    Taro.eventCenter.on('ESetHeader', this.header)
    Taro.eventCenter.on('ESetFooter', this.footer)
    Taro.eventCenter.on('ERefreshStart', this.showRefresh)
    Taro.eventCenter.on('ERefreshEnd', this.hideRefresh)
    Taro.eventCenter.on('focus', this.focus)
    Taro.eventCenter.on('blur', this.blur)
  }

  componentWillUnmount() {
    console.log('卸载Content——————————————')
    Taro.eventCenter.off('ESetHeader', this.header)
    Taro.eventCenter.off('ESetFooter', this.footer)
    Taro.eventCenter.off('ERefreshStart', this.showRefresh)
    Taro.eventCenter.off('ERefreshEnd', this.hideRefresh)
    Taro.eventCenter.off('focus', this.focus)
    Taro.eventCenter.off('blur', this.blur)
  }

    /**
   * 触发加载更多
   *
   * @memberof Content
   */
  onScrollToLower () {
    throttle({
      method: () => {
        console.log('滑动到底部')
        !this.props.loading && this.props.hasMore && this.props.onScrollToLower && this.props.onScrollToLower()
      },
      ahead: true
    })
  }

  onScrollToUpper() { //滚动到顶部事件
    // console.log('滚动到顶部事件')
  }
  onScroll(e) {
    const { scrollTop } = e.detail;
    const { onScrollUp, onScrollDown, onScroll } = this.props;
    this.isTop = scrollTop <= 100 // 滚动到了顶部
    // deltaY在微信小程序适用
    if(scrollTop > 200) {
      onScrollUp && onScrollUp()
    } else {
      onScrollDown && onScrollDown()
    }

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
  header (rect) {
    // 优化 Content 渲染频率
    throttle({
      method: () => {
        if( this.cacheHeader !== rect.height ) {
          console.log('计算header')
          windowHeight = Taro.getSystemInfoSync().windowHeight
          this.cacheHeader = rect.height
          this.setState({
            headerHeight: rect.height
          })
        }
      },
      type: 'header'
    })
  }
  footer (rect) {
    // 优化 Content 渲染频率
    throttle({
      method: () => {
        if( this.cacheFooter !== rect.height ) {
          console.log('计算footer')
          windowHeight = Taro.getSystemInfoSync().windowHeight
          this.cacheFooter = rect.height
          this.setState({
            footerHeight: rect.height
          })
        }
      },
      type: 'footer'
    })
  }
  focus () {
    this.setState({
      focus: true
    })
  }
  blur () {
    this.setState({
      focus: false
    })
  }

  touchStart(e) {
    this.start_p = e.touches[0];
  }
  touchmove(e) {
    if(this.props.disabledRefresh) {
      return
    }
    if(this.state.isRefreshing) {
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
      let dragComplete = parseInt((pY / this.config.threshold) * 100);
      if (dragComplete > 100) {
        dragComplete = 100
      }
      this.setState({
        dragComplete
      })
      if (move_y - start_y > 0) { // 下拉操作
        if(this.needPrevent) {
          e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
          e.stopPropagation();
        }
        if (pY >= this.config.threshold) {
          if(this.state.dragState === 0) {
            vibrateShort()
            this.setState({ dragState: 1, downText: '释放刷新' })
          }
        } else {
          this.setState({ dragState: 0, downText: '下拉刷新' })
        }
        if (pY >= this.config.maxY) {
          pY = this.config.maxY
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
  touchEnd(e) {
    if(this.isTop) {
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
  recover() {//还原初始设置
    const refreshLimit = this.config.refreshTime - (new Date - this.startTime)
    const _doRecover = () => {
      this.setState({
        dragState: 0,
        dragStyle: {
          top: 0 + 'px',
          transition: `all ${this.config.recoverTime}ms`
        },
        downDragStyle: {
          height: 0 + 'px',
          transition: `all ${this.config.recoverTime}ms`
        },
        scrollY: true,
        isRefreshing: false
      })
    }
    if(refreshLimit <= 0) {
      _doRecover()
    } else {
      setTimeout(()=>{
        _doRecover()
      }, refreshLimit)
    }
  }

  showRefresh() {
    throttle({
      method: () => {
        console.log('显示刷新')
        this.startTime = new Date()
        const time = 0.2;
        this.setState({
          dragStyle: {
            top: this.config.refresherHeight + 'px',
            transition: `all ${time}s`
          },
          downDragStyle: {
            height: this.config.refresherHeight + 'px',
            transition: `all ${time}s`
          },
          dragComplete: 100,
          isRefreshing: true
        })
      },
      ahead: true,
      type: 'showRefresh'
    })
  }

  hideRefresh() {
    throttle({
      method: () => {
        console.log('隐藏刷新')
        this.recover()
      },
      ahead: true,
      type: 'hideRefresh'
    })
  }

  render() {
    const { dragStyle, downDragStyle, dragComplete, downText,
      footerHeight, headerHeight, isRefreshing, focus } = this.state;
    const { emptyText, loading, hasMore, onScrollToLower, children } = this.props
    const showNoMore = !loading && !hasMore && !!onScrollToLower
    const showLoadMore = !loading && hasMore && !!onScrollToLower
    const bottom = emptyText
      ?<View className='empty'>{emptyText}</View>
      :showNoMore
        ?<View className='no-more'>
           没有更多了
        </View>
        : showLoadMore
          ?<View className='load-more'>
            <View>加载中</View>
          </View>
          : null

    return (
      <View className='EContent' style={{ height: `${windowHeight - footerHeight - headerHeight}px` }}>
        <View className='refresher' style={downDragStyle}>
          <View className='refresher-holder'>
            <ERefresher
              complete={dragComplete}
              text={downText}
              isRefreshing={isRefreshing}
            />
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
          lowerThreshold={100}
          enableBackToTop
          className='scroll-content'
          scrollY
          scrollWithAnimation
        >
          <View onTouchMove={this.touchmove}>
            { children }
            { bottom }
            { focus ? <View className='keyboard'></View> : "" }
          </View>
        </ScrollView>
      </View>
    )
  }
}
EContent.propTypes = {
  onRefresh: PropTypes.func,
  onScrollToLower: PropTypes.func
}

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types'

import EHeader from '../EHeader/EHeader'
import EContent from '../EContent/EContent'
import EFooter from '../EFooter/EFooter'

export default class EPage extends Component {


  render() {
    return (
      <View className={`EPage ${this.props.className || ''}`}>
        <EHeader>{this.props.renderHeader}</EHeader>
        <EContent
          onRefresh={this.props.onRefresh}
          onScrollToLower={this.props.onLoadMore}
          onScroll={this.props.onScroll}
          hasMore={this.props.hasMore}
          noMore={this.props.noMore}
          loadMoreThreshold={this.props.loadMoreThreshold}
          noMoreText={this.props.noMoreText}
          hasMoreText={this.props.hasMoreText}
          refreshStatus={this.props.refreshStatus}
          refresherConfig={this.props.refresherConfig || {}}
        >{this.props.children}</EContent>
        <EFooter>{this.props.renderFooter}</EFooter>
      </View>
    )
  }
}

EPage.propTypes = {
  className: PropTypes.string,
  renderHeader: PropTypes.element,
  renderFooter: PropTypes.element,
  onRefresh: PropTypes.func,
  onLoadMore: PropTypes.func,
  onScroll: PropTypes.func,
  loadMoreThreshold: PropTypes.number,
  hasMore: PropTypes.bool,
  noMore: PropTypes.bool,
  noMoreText: PropTypes.string,
  hasMoreText: PropTypes.string,
  refreshStatus: PropTypes.number,
  refresherConfig: PropTypes.shape({
      recoverTime:  PropTypes.number,
      refreshTime: PropTypes.number,
      threshold: PropTypes.number,
      maxHeight: PropTypes.number,
      height: PropTypes.number
  })
}

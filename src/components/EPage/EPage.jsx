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
          hasMore={this.props.hasMore}
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
  hasMore: PropTypes.bool
}

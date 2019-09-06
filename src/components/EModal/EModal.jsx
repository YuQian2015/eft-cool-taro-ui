import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

class EModal extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    openModel: false,
    showMask: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      show: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.openModel
    })
  }

  hideModal = () => {
    this.setState({
      show: false
    })
    const { onHide } = this.props
    onHide && onHide()
  }

  render() {
    const { show } = this.state;
    
    let className = 'model-container'
    let maskClass = 'mask'
    className += this.props.position ? ` ${this.props.position}` : ' bottom'
    if (show) {
      className += ' open'
      maskClass += ' active'
    }
    if (this.props.showMask) {
      maskClass += ' display-background'
    }
    return (
      <View className='EModal'>
        {
          show ? <View className={maskClass} onClick={this.hideModal}></View> : null
        }
        
        <View className={className}>
          {this.props.children}
        </View>
      </View>
    )
  }
}
export default EModal

EModal.propTypes = {
  openModel: PropTypes.bool,
  showMask: PropTypes.bool,
  onHide: PropTypes.func,
}
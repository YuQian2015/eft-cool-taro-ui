import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'

class ESearch extends Component {

  blur = () => {
    this.fileInputEl && this.fileInputEl.vnode.dom.blur()
  }

  render() {
    const { cancelText, placeholder, value, focus, onChange, onCancel, onClear } = this.props
    return (
      <View className='ESearch'>
        <View className='search-box'>
          <Text className='eft exe-search'></Text>
          <Input className='wrap-input'
            ref={node => this.fileInputEl = node}
            placeholder={placeholder || 'Search'}
            focus={focus || true}
            value={value}
            onChange={onChange}
          />
          {value && <Text onClick={onClear} className='eft exe-fail'></Text>}
        </View>
        <View className='cancel' onClick={onCancel}>{cancelText || 'Cancel'}</View>
      </View>
    )
  }
}

export default ESearch;

import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import EOrgUser from './EOrgUser'

class EOrgDept extends Component {
  static options = {
    addGlobalClass: true
  }

  state = {
    showChildren: false,
    list: []
  }

  handleClick = () => {
    const { data } = this.props
    const { showChildren, list } = this.state
    if (data.has_child && !showChildren) {
      if (list.length === 0) {
        this.fetchOrgData()
      }
      this.setState({
        showChildren: true
      })
      return
    }
    this.setState({
      showChildren: false
    })
  }

  transformResData = (res) => {
    if (res && res.data && res.data.length) {
      return res.data
    } else {
      return []
    }
  }

  fetchOrgData = () => {
    const { orgUrl, http, data } = this.props
    http.get({
      url: orgUrl + `?parentId=${data.id}&type=${data.type}`
    }).then(res => {
      const list = this.transformResData(res)
      this.setState({
        list
      })
    })
  }

  handleSelectChange = data => {
    const { onSelectChange, checkable } = this.props
    if (checkable) {
      onSelectChange && onSelectChange(data)
    }
  }

  render() {
    const { data, http, orgUrl, checkable, selectedUserIds } = this.props
    const { list, showChildren } = this.state
    return (
      <View className='EOrgDept'>
        {
          (data.type === 0 || data.type === 1) &&
          <View className='parent-dept' onClick={this.handleClick}>
            {
              data.has_child && (showChildren ? <Text className='eft exe-unfold EOrgDept-icon'></Text> : <Text className='eft exe-enter EOrgDept-icon'></Text>)
            }
            {data.name || '未知'}{data.count && `（${data.direct_count} / ${data.count}）`}
          </View>
        }
        {
          data.type !== 0 && data.type !== 1 && <EOrgUser active={selectedUserIds && selectedUserIds[data.id]} data={data} checkable={checkable} onSelectChange={this.handleSelectChange} />
        }
        {
          showChildren &&
          <View className='children-dept'>
            {
              list && list.length > 0 && list.map(
                item => item.type === 2
                  ? <EOrgUser active={selectedUserIds && selectedUserIds[item.id]} key={item.id} data={item} checkable={checkable} onSelectChange={this.handleSelectChange} />
                  : <EOrgDept selectedUserIds={selectedUserIds} key={item.id} http={http} checkable={checkable} onSelectChange={this.handleSelectChange} orgUrl={orgUrl} data={item} />
              )
            }
          </View>
        }
      </View>
    )
  }
}

export default EOrgDept
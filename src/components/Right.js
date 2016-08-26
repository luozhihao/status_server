// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Form, Table, Button, Select, Menu, Icon, Popconfirm, Input } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const SubMenu = Menu.SubMenu
const ButtonGroup = Button.Group
const InputGroup = Input.Group

// 表头
const columns = [{
    title: 'OrderBy',
    dataIndex: 'OrderBy',
    sorter: (a, b) => a.OrderBy - b.OrderBy
}, {
    title: 'GameID',
    dataIndex: 'GameID'
}, {
    title: 'IssuerID',
    dataIndex: 'IssuerId'
}, {
    title: 'ServerID',
    dataIndex: 'ServerID'
}, {
    title: 'ServerName',
    dataIndex: 'ServerName'
}, {
    title: 'ServerIP',
    dataIndex: 'ServerIP'
}, {
    title: 'Port',
    dataIndex: 'Port'
}, {
    title: 'OnlineNum',
    dataIndex: 'OnlineNum'
}, {
    title: 'MaxOnlineNum',
    dataIndex: 'MaxOnlineNum'
}, {
    title: 'IsRunning',
    dataIndex: 'IsRuning',
    render: text => {
        let txt, status

        if (text === 0) {
            txt = '停止运行'
            status = 'text-danger'
        } else if (text === 1) {
            txt = '正常运行'
            status = 'text-success'
        } else {
            txt = '未开启'
            status = 'text-warning'
        }

        return (
            <div className={status}>{ txt }</div>
        )
    },
    sorter: (a, b) => a.IsRuning - b.IsRuning
}, {
    title: 'ServerStyle',
    dataIndex: 'ServerStyle',
    render: text => {
        let txt, status

        if (text === 0) {
            txt = '普通服'
            status = 'text-warning'
        } else if (text === 1) {
            txt = '推荐服'
            status = 'text-primary'
        } else {
            txt = '新服'
            status = 'text-success'
        }

        return (
            <div className={status}>{ txt }</div>
        )
    },
    sorter: (a, b) => a.ServerStyle - b.ServerStyle
}, {
    title: 'IsStartIPWhite',
    dataIndex: 'IsStartIPWhile',
    render: text => {
        let txt, status

        if (text === 0) {
            txt = '停止白名单'
            status = 'text-danger'
        } else {
            txt = '开启白名单'
            status = 'text-success'
        }

        return (
            <div className={status}>{ txt }</div>
        )
    },
    sorter: (a, b) => a.IsStartIPWhile - b.IsStartIPWhile
}]

class Right extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            filterData: []
        }
    }

    // 获取选中行ID
    onSelectChange = (selectedRowKeys) => {
        this.props.onSelectChange(selectedRowKeys)
    }

    // 提交表单并重置
    handleSubmit = () => {
        this.props.changeServers(this.props.form.getFieldsValue())
        this.props.form.resetFields()
    }

    // 搜索功能
    searchFn = e => {
        let value = e.target.value

        const filterData = this.props.tableData.filter(item => 
            item.ServerID.toString().indexOf(value) > -1 || item.ServerName.indexOf(value) > -1
        )

        this.setState({
            search: value,
            filterData: filterData
        })

        this.onSelectChange([])
    }

    // 开启关闭查询服务器白名单
    operateFn = type => {
        this.props.operateFn(type)
    }

    render() {
        const { tableData, loading, selectedRowKeys } = this.props
        const { getFieldProps } = this.props.form
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const hasSelected = selectedRowKeys.length > 0

        return(
            <div className="right-view">
                <Menu mode="horizontal">
                    <SubMenu title={<span><Icon type="user" />{this.props.username}</span>}>
                        <Menu.Item key="setting:1">
                            <div className="text-center" onClick={this.props.logout}>退出</div>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                <div className="right-box">
                    <Form inline className="form-operate">
                        <FormItem
                          label="运行状态"
                        >
                            <Select 
                                style={{ width: 120 }} 
                                {...getFieldProps('isRunning')}
                                placeholder="请选择"
                                allowClear
                            >
                                <Option value="0">停服维护</Option>
                                <Option value="1">正常运行</Option>
                                <Option value="2">未开启</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                          label="服务器状态"
                        >
                            <Select 
                                style={{ width: 120 }} 
                                {...getFieldProps('serverStyle')}
                                placeholder="请选择"
                                allowClear
                            >
                                <Option value="0">普通服</Option>
                                <Option value="1">推荐服</Option>
                                <Option value="2">新服</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                          label="是否启用白名单"
                        >
                            <Select 
                                style={{ width: 120 }} 
                                {...getFieldProps('isStartIpWhite')}
                                placeholder="请选择"
                                allowClear
                            >
                                <Option value="1">开启白名单</Option>
                                <Option value="0">停止白名单</Option>
                            </Select>
                        </FormItem>
                        <div style={{ marginRight: '10px', display: 'inline-block' }}>
                            <Popconfirm placement="bottom" title="确定要执行这个任务吗？" onConfirm={this.handleSubmit}>
                                <Button type="primary" icon="play-circle-o" disabled={!hasSelected || loading}>操作</Button>
                            </Popconfirm>
                        </div>
                        <ButtonGroup>
                            <Button type="ghost" onClick={this.operateFn.bind(this, 1)} disabled={!hasSelected || loading}>开启服务器白名单</Button>
                            <Button type="ghost" onClick={this.operateFn.bind(this, 2)} disabled={!hasSelected || loading}>关闭服务器白名单</Button>
                            <Button type="ghost" onClick={this.operateFn.bind(this, 3)} disabled={!hasSelected || loading}>查询服务器白名单</Button>
                        </ButtonGroup>
                        <FormItem
                          label="搜索"
                          className='pull-right'
                        >
                            <Input style={{ width: 150 }} placeholder="ServerID/ServerName" onChange={this.searchFn} />
                        </FormItem>
                    </Form>
                    <Table 
                        rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={this.state.search ? this.state.filterData : tableData} 
                        pagination={false} 
                        loading={loading}
                        size="small"
                    />
                </div>
            </div>
        )
    }
}

Right.propTypes = {
    tableData: PropTypes.array.isRequired,
    selectedRowKeys: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
}

Right = Form.create()(Right)

export default Right
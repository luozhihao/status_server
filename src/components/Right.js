// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Form, Table, Button, Select, Menu, Icon, Popconfirm } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const SubMenu = Menu.SubMenu

// 创建对象时设置初始化信息
const headers = new Headers()

// 设置请求头
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

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
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.props.onSelectChange(selectedRowKeys)
    }

    handleSubmit = () => {
        console.log('收到表单值：', this.props.form.getFieldsValue())
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
                    <SubMenu title={<span><Icon type="user" />luozh</span>}>
                        <Menu.Item key="setting:1">
                            <div className="text-center">退出</div>
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
                                <Option value="停服维护">停服维护</Option>
                                <Option value="正常运行">正常运行</Option>
                                <Option value="未开启">未开启</Option>
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
                                <Option value="普通服">普通服</Option>
                                <Option value="推荐服">推荐服</Option>
                                <Option value="新服">新服</Option>
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
                                <Option value="开启白名单">开启白名单</Option>
                                <Option value="停止白名单">停止白名单</Option>
                            </Select>
                        </FormItem>
                        <Popconfirm placement="bottom" title="确定要执行这个任务吗？" onConfirm={this.handleSubmit}>
                            <Button type="primary" icon="play-circle-o" disabled={!hasSelected || loading}>操作</Button>
                        </Popconfirm>
                    </Form>
                    <Table 
                        rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={tableData} 
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
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

const columns = [{
    title: 'OrderBy',
    dataIndex: 'OrderBy',
    sorter: (a, b) => a.OrderBy - b.OrderBy
}, {
    title: 'GameID',
    dataIndex: 'GameID'
}, {
    title: 'IssuerID',
    dataIndex: 'IssuerID'
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
    title: 'RateState',
    dataIndex: 'RateState'
}, {
    title: 'OnlineNum',
    dataIndex: 'OnlineNum'
}, {
    title: 'MaxOnlineNum',
    dataIndex: 'MaxOnlineNum'
}, {
    title: 'IsRunning',
    dataIndex: 'IsRunning',
    render: text => <div className="text-success">{text}</div>
}, {
    title: 'ServerStyle',
    dataIndex: 'ServerStyle',
    render: text => <div className="text-warning">{text}</div>
}, {
    title: 'IsStartIPWhite',
    dataIndex: 'IsStartIPWhite',
    render: text => <div className="text-danger">{text}</div>
}]

const data = []

for (let i = 0; i < 20; i++) {
    data.push({
        key: i + 1,
        OrderBy: i + 1,
        GameID: 40,
        IssuerID: 'YHLM[10002]',
        ServerID: '7400091',
        ServerName: '9区 叱咤风云',
        ServerIP: '115.182.109.144',
        Port: '8088',
        RateState: '0 (优良)',
        OnlineNum: 0,
        MaxOnlineNum: 3500,
        IsRunning: '正常运行',
        ServerStyle: '普通服',
        IsStartIPWhite: '停止白名单'
    })
}

class Right extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            loading: false
        }
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.setState({ selectedRowKeys })
    }

    handleSubmit = () => {
        console.log('收到表单值：', this.props.form.getFieldsValue())
    }

    render() {
        const { loading, selectedRowKeys } = this.state
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
                            <Button type="primary" disabled={!hasSelected} loading={loading}>操作</Button>
                        </Popconfirm>
                    </Form>
                    <Table 
                        rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={data} 
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
    
}

Right = Form.create()(Right);

export default Right
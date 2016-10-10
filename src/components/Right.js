// 动态数据列表
import React, { Component, PropTypes } from 'react'
import { Form, Table, Button, Select, Menu, Icon, Popconfirm, Input, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const SubMenu = Menu.SubMenu
const ButtonGroup = Button.Group

// 表头
const columns = [{
    title: 'OrderBy',
    dataIndex: 'OrderBy',
    width: '8%',
    sorter: (a, b) => a.OrderBy - b.OrderBy
}, {
    title: 'GameID',
    dataIndex: 'GameID',
    width: '5%'
}, {
    title: 'IssuerID',
    dataIndex: 'IssuerId',
    width: '5%'
}, {
    title: 'ServerID',
    dataIndex: 'ServerID',
    width: '7%'
}, {
    title: 'ServerName',
    dataIndex: 'ServerName',
    width: '10%'
}, {
    title: 'ServerIP',
    dataIndex: 'ServerIP',
    width: '10%'
}, {
    title: 'Port',
    dataIndex: 'Port',
    width: '5%'
}, {
    title: 'IsRunning',
    dataIndex: 'IsRuning',
    width: '10%',
    render: text => {
        let txt, status

        if (text === 0) {
            txt = '停服维护'
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
    width: '10%',
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
    width: '10%',
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
}, {
    title: 'Group',
    dataIndex: 'Group',
    width: '8%'
}, {
    title: 'NetType',
    dataIndex: 'NetType',
    width: '7%',
}]

class Right extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            filterData: [],
            uploading: false
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
            filterData: filterData
        })

        this.props.searchFn(value)

        this.onSelectChange([])
    }

    // 开启关闭查询服务器白名单
    operateFn = type => {
        this.props.operateFn(type)
    }

    // 自动生成备用列表
    getAutoList = () => {
        message.info('功能开发中...')
    }

    render() {
        const { tableData, loading, selectedRowKeys, search, showUpload, showEAI, useCDN } = this.props
        const { getFieldProps } = this.props.form
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const hasSelected = selectedRowKeys.length > 0

        let _this = this

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
                          label="搜索"
                        >
                            <Input style={{ width: 150, marginRight: '80px' }} placeholder="ServerID/ServerName" onChange={this.searchFn} value={search} />
                        </FormItem>
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
                    </Form>
                    <Table 
                        rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={search ? this.state.filterData : tableData} 
                        pagination={false} 
                        loading={loading}
                        scroll={{ y: 400 }}
                        size="small"
                        footer={() => {
                                return(
                                    <div>
                                        <ButtonGroup>
                                            <Button type="ghost" onClick={this.operateFn.bind(this, 1)} disabled={!hasSelected || loading}>内网测试</Button>
                                            <Button type="ghost" onClick={this.operateFn.bind(this, 2)} disabled={!hasSelected || loading}>对外开放</Button>
                                            <Button type="ghost" onClick={this.operateFn.bind(this, 3)} disabled={!hasSelected || loading}>查询是否对外开放</Button>
                                        </ButtonGroup>
                                        <div className="upload-list">
                                            <Button type="ghost" icon="setting" onClick={showEAI} disabled={!hasSelected || loading}>
                                                修改EAI状态
                                            </Button>
                                        </div>
                                        {
                                            useCDN 
                                            ? 
                                            <div className="pull-right">
                                                <ButtonGroup>
                                                    <Button type="ghost" icon="upload" onClick={showUpload}>
                                                        手动上传备用列表
                                                    </Button>
                                                    <Button type="ghost" icon="copy" onClick={this.getAutoList}>自动生成备用列表</Button>
                                                </ButtonGroup>
                                            </div>
                                            :
                                            ''
                                        }
                                    </div>
                                )
                            }
                        }
                    />
                </div>
            </div>
        )
    }
}

Right.propTypes = {
    tableData: PropTypes.array.isRequired,
    selectedRowKeys: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired
}

Right = Form.create()(Right)

export default Right
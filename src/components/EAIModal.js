import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select, Button, Modal, message, Popconfirm } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option

class EaiModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    // 修改EAI状态
    handleSubmit = () => {
        const { getFieldValue } = this.props.form
        const { selectedRowKeys, EAICancel, refreshTable, setLoading, curProduct } = this.props

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return
            }

            this.setState({loading: true})
            setLoading(true)
            
            fetch('/change_server_eai/', {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        product: curProduct,
                        stateIds: selectedRowKeys,
                        groupId: getFieldValue('group'),
                        netTypeId: getFieldValue('netType')
                    })
                })
                .then((res) => { return res.json() })
                .then((data) => {
                    if (data.result === 1) {
                        EAICancel()
                        refreshTable()

                        message.success('操作成功！')
                    } else {
                        'msg' in data ? message.error(data.msg) : message.error('操作失败！')

                        setLoading(false)
                    }

                    this.setState({loading: false})
                })
        })
    }

    render() {
        const { getFieldProps, getFieldValue } = this.props.form
        const { groups, netTypes, EAICancel, EAIModal } = this.props

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }

        const groupProps = getFieldProps('group', {
            rules: [
                { required: true, type: 'number', message: '请选择Group' }
            ]
        })

        const netTypeProps = getFieldProps('netType', {
            rules: [
                { required: true, message: '请选择netType' }
            ]
        })

        return( 
            <Modal ref="modal"
                width="600px"
                visible={EAIModal}
                title="修改EAI状态" 
                onCancel={EAICancel}
                footer={[
                    <Popconfirm placement="bottom" title="确定要执行这个任务吗？" onConfirm={this.handleSubmit}>
                        <Button type="primary" icon="play-circle-o" loading={this.state.loading}>确定</Button>
                    </Popconfirm>,
                    <Button 
                        key="back" 
                        type="ghost" 
                        size="large" 
                        onClick={EAICancel}
                    >
                        关 闭
                    </Button>
              ]}
            >
                <Form horizontal form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="Group"
                        hasFeedback
                    >   
                        <Select 
                            {...groupProps}
                            placeholder="请选择Group"
                        >   
                            {
                                groups.map((e, i) =>
                                    <Option value={e.value}>{e.label}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="NetType"
                    >
                        <Select 
                            {...netTypeProps} 
                            placeholder="请选择NetType"
                        >
                            {
                                netTypes.map((e, i) =>
                                    <Option value={e.value} key={i}>{e.label}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EaiModal = Form.create()(EaiModal)

export default EaiModal
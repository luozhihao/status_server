import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select, Button, Modal, Input, message, Radio } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class CdnModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            operate: '1'
        }
    }

    // 选择新建或修改
    operateFn = e => {
        this.setState({
            operate: e.target.value
        })
    }

    // 保存校验
    createCdn = e => {
        e.preventDefault()

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return
            }

            this.setState({loading: true})
            this.props.createCdn(values)
        })
    }

    // 渠道选择
    issuerChange = value => {
        let id = this.props.form.getFieldValue('cdn_id') || '',
            path = '/get_issuer_path/',
            url = this.state.operate === '2' ? path + '?issuer=' + value + '&cdn_id=' + id : path;

        return fetch(url, {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.props.form.setFieldsValue({path: data.path})
            })
    }

    // CDN名称选择
    nameChange = value => {
        return fetch('/get_cdn_info/?cdn_id=' + value, {
                method: 'GET',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.props.form.setFieldsValue({
                    cdn_ip: data.cdn_ip,
                    cdn_user: data.cdn_user,
                    cdn_pwd: data.cdn_pwd,
                    cdn_name: data.cdn_name,
                    cdn_port: data.cdn_port
                })
            })
    }

    render() {
        const { getFieldProps } = this.props.form
        const { cdnCancel, cdnModal, serverNames, cdnNames } = this.props
        const { operate, loading } = this.state

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }

        const cdnNameProps = getFieldProps('cdn_name', {
            rules: [
                { required: true, message: '请填写新CDN名称' }
            ]
        })

        const cdnAddressProps = getFieldProps('cdn_ip', {
            rules: [
                { required: true, message: '请填写CDN地址' }
            ]
        })

        const cdnPortProps = getFieldProps('cdn_port', {
            initialValue: '21',
            rules: [
                { required: true, message: '请填写CDN端口' }
            ]
        })

        const cdnUserProps = getFieldProps('cdn_user', {
            rules: [
                { required: true, message: '请填写CDN用户名' }
            ]
        })

        const cdnPasswordProps = getFieldProps('cdn_pwd', {
            rules: [
                { required: true, message: '请填写CDN密码' }
            ]
        })

        const issuerProps = getFieldProps('issuer', {
            rules: [
                { required: false, type: 'number', message: '请选择渠道' }
            ]
        })

        return(
            <Modal ref="modal"
                width="600px"
                visible={cdnModal}
                title="CDN配置" onCancel={cdnCancel}
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={this.createCdn} loading={loading}>
                    保存
                    </Button>,
                    <Button key="back" type="ghost" size="large" onClick={cdnCancel}>关 闭</Button>
                ]}
            >
                <Form horizontal form={this.props.form} className="clearfix">
                    <FormItem
                        {...formItemLayout}
                        label="操作"
                    >   
                        <RadioGroup onChange={this.operateFn} defaultValue="1">
                            <RadioButton value="1">新建</RadioButton>
                            <RadioButton value="2">修改</RadioButton>
                        </RadioGroup>
                    </FormItem>
                    {
                        this.state.operate === '2'
                        ?
                        <FormItem
                            {...formItemLayout}
                            label="CDN名称"
                            hasFeedback
                        >   
                            <Select 
                                {...getFieldProps('cdn_id', {rules: [{ required: operate === '2', type: 'number', message: '请选择CDN名称' }]})}
                                onSelect={this.nameChange}
                                placeholder="请选择CDN名称"
                            >   
                                {
                                    cdnNames.map((e, i) =>
                                        <Option value={e.value}>{e.label}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        :
                        ''
                    }
                    <FormItem
                        {...formItemLayout}
                        label="新CDN名称"
                        hasFeedback
                        style={{display: this.state.operate === '1' || this.props.form.getFieldValue('cdn_id') ? 'block' : 'none'}}
                    >
                        <Input type="text" {...cdnNameProps} placeholder="请输入CDN名称"/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN地址"
                        hasFeedback
                    >
                        <Input type="text" {...cdnAddressProps} placeholder="请输入cdn地址" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN端口"
                        hasFeedback
                    >
                        <Input type="text" {...cdnPortProps} placeholder="请输入cdn端口" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN用户名"
                        hasFeedback
                    >
                        <Input type="text" {...cdnUserProps} placeholder="请输入cdn用户名" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="CDN密码"
                        hasFeedback
                    >
                        <Input type="text" {...cdnPasswordProps} placeholder="请输入cdn密码" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="渠道"
                    >
                        <Select 
                            {...issuerProps} 
                            placeholder="请选择渠道"
                            onSelect={this.issuerChange}
                            allowClear={true}
                        >
                            {
                                serverNames.map((e, i) =>
                                    <Option value={e.IssuerId} key={i}>{e.IssuerName}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="路径"
                        hasFeedback
                    >
                        <Input 
                            type="text" 
                            {...getFieldProps('path', {rules: [{ required: this.props.form.getFieldValue('issuer') ? true : false, message: '请填写路径' }]})} 
                            placeholder="请输入文件路径"
                        />
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

CdnModal = Form.create()(CdnModal)

export default CdnModal
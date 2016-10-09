import React, { Component, PropTypes } from 'react'
import { Form, Icon, Select, Button, Modal, message, Upload } from 'antd'

import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option

class UploadModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        const { getFieldProps, getFieldValue } = this.props.form
        const { uploadCancel, uploadModal, cdnNames, serverNames, curServer } = this.props

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }

        const cdnIdProps = getFieldProps('cdn_id', {
            rules: [
                { required: true, type: 'number', message: '请选择CDN名称' }
            ]
        })

        const issuerProps = getFieldProps('issuer', {
            initialValue: curServer || '',
            rules: [
                { required: true, type: 'number', message: '请选择渠道' }
            ]
        })

        const _this = this

        const props = {
            action: '/cdn_upload/',
            data: {
                cdn_id: getFieldValue('cdn_id'),
                issuer: getFieldValue('issuer')
            },
            onChange(data) {
                if (data.file.status === 'uploading') {
                    _this.setState({loading: true})
                } else {
                    if (data) {
                        let obj = data.file.response

                        if (obj.result === 1) {
                            message.success('上传成功！')

                            uploadCancel()
                        } else {
                            'msg' in obj ? message.error(obj.msg) : message.error('上传失败！')
                           
                        }

                        _this.setState({loading: false})
                    }
                }
            }
        }

        return( 
            <Modal ref="modal"
                width="600px"
                visible={uploadModal}
                title="上传备用列表" 
                onCancel={uploadCancel}
                footer={[
                    <Button 
                        key="back" 
                        type="ghost" 
                        size="large" 
                        onClick={uploadCancel}
                    >
                        关 闭
                    </Button>
              ]}
            >
                <Form horizontal form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="CDN名称"
                        hasFeedback
                    >   
                        <Select 
                            {...cdnIdProps}
                            placeholder="请选择CDN名称"
                        >   
                            {
                                cdnNames.map((e, i) =>
                                    <Option value={e.value}>{e.label}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="渠道"
                    >
                        <Select 
                            {...issuerProps} 
                            placeholder="请选择渠道"
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
                        label="上传文件"
                    >
                        <Upload {...props}>
                            <Button type="ghost" disabled={!getFieldValue('cdn_id') || !getFieldValue('issuer')}>
                                <Icon type="upload" loading={this.state.loading} /> 选择文件并上传
                            </Button>
                        </Upload>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

UploadModal = Form.create()(UploadModal)

export default UploadModal
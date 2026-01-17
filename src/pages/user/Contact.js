/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, Typography, message, Divider, Space } from 'antd';
import { 
    MailOutlined, 
    PhoneOutlined, 
    HomeOutlined, 
    SendOutlined,
    ClockCircleOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, values);
            if (response.data.success) {
                message.success('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.');
                form.resetFields();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Thao tác thất bại, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f0f2f5', padding: '60px 20px', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <Title level={1}>Liên Hệ Với Chúng Tôi</Title>
                    <Paragraph style={{ fontSize: 16, color: '#8c8c8c' }}>
                        Mọi thắc mắc hoặc góp ý, vui lòng để lại lời nhắn. Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24h.
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {/* LEFT: INFO CARD */}
                    <Col xs={24} lg={10}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: 16, 
                                height: '100%',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)'
                            }}
                        >
                            <Title level={3} style={{ marginBottom: 30 }}>Thông Tin Liên Hệ</Title>
                            
                            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15 }}>
                                    <div style={{ background: '#e6f7ff', padding: '10px', borderRadius: 12 }}>
                                        <HomeOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Địa chỉ</Text>
                                        <Text type="secondary">123 Đường ABC, Quận 1, TP.HCM</Text>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15 }}>
                                    <div style={{ background: '#f6ffed', padding: '10px', borderRadius: 12 }}>
                                        <PhoneOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Hotline</Text>
                                        <Text type="secondary">0909 123 456</Text>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15 }}>
                                    <div style={{ background: '#fff7e6', padding: '10px', borderRadius: 12 }}>
                                        <MailOutlined style={{ color: '#fa8c16', fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Email</Text>
                                        <Text type="secondary">contact@company.com</Text>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15 }}>
                                    <div style={{ background: '#f9f0ff', padding: '10px', borderRadius: 12 }}>
                                        <ClockCircleOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: 'block' }}>Giờ làm việc</Text>
                                        <Text type="secondary">Thứ 2 - Thứ 7: 08:00 - 18:00</Text>
                                    </div>
                                </div>
                            </Space>

                            <Divider style={{ margin: '30px 0' }} />

                            {/* MAP GOOGLE */}
                            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                                <iframe
                                    title="Electric Power University"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.635300344018!2d105.78183761141312!3d21.04727338706059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3b40000001%3A0x119280f97a95079a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyDEkGnhu4duIGzhu7Fj!5e0!3m2!1svi!2s!4v1715418196614!5m2!1svi!2s"
                                    width="100%"
                                    height="220"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                />
                            </div>
                        </Card>
                    </Col>

                    {/* RIGHT: FORM CARD */}
                    <Col xs={24} lg={14}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: 16, 
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
                            }}
                        >
                            <Title level={3} style={{ marginBottom: 30 }}>Gửi Lời Nhắn</Title>
                            <Form
                                layout="vertical"
                                form={form}
                                onFinish={handleSubmit}
                                size="large"
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="name"
                                            label={<Text strong>Họ và tên</Text>}
                                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                        >
                                            <Input placeholder="Nguyễn Văn A" style={{ borderRadius: 8 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phone"
                                            label={<Text strong>Số điện thoại</Text>}
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                        >
                                            <Input placeholder="09xxxxxxx" style={{ borderRadius: 8 }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="email"
                                    label={<Text strong>Email</Text>}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Email không hợp lệ' }
                                    ]}
                                >
                                    <Input placeholder="vidu@email.com" style={{ borderRadius: 8 }} />
                                </Form.Item>

                                <Form.Item
                                    name="subject"
                                    label={<Text strong>Tiêu đề</Text>}
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                >
                                    <Input placeholder="Hỗ trợ kỹ thuật / Báo giá..." style={{ borderRadius: 8 }} />
                                </Form.Item>

                                <Form.Item
                                    name="message"
                                    label={<Text strong>Nội dung</Text>}
                                    rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                                >
                                    <TextArea 
                                        rows={4} 
                                        placeholder="Bạn cần chúng tôi giúp gì?" 
                                        style={{ borderRadius: 8 }} 
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={loading}
                                        icon={<SendOutlined />}
                                        style={{ 
                                            height: 50, 
                                            padding: '0 40px', 
                                            borderRadius: 8, 
                                            fontSize: 16, 
                                            fontWeight: 600,
                                            boxShadow: '0 4px 14px rgba(24, 144, 255, 0.3)'
                                        }}
                                    >
                                        Gửi Yêu Cầu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Contact;
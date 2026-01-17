import React from 'react';
import { Row, Col, Typography, Card, Button, Divider } from 'antd';
import {
    ToolOutlined,
    SafetyOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    ArrowRightOutlined,
    MailOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const About = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#f4f7f9', minHeight: '100vh', paddingBottom: 80 }}>
            {/* 1. Hero Section - Nhấn mạnh thương hiệu */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #cf1322 0%, #820014 100%)',
                    padding: '100px 20px',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: -50 // Tạo hiệu ứng đè khối
                }}
            >
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Title level={1} style={{ color: 'white', marginBottom: 20, fontSize: '3.5rem' }}>
                        Honda Shop
                    </Title>
                    <Paragraph style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>
                        Đồng hành cùng bạn trên mọi cung đường với phụ tùng xe máy chính hãng,
                        đạt tiêu chuẩn khắt khe nhất từ Honda Nhật Bản.
                    </Paragraph>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate('/products')}
                        style={{
                            marginTop: 30,
                            height: 50,
                            padding: '0 40px',
                            borderRadius: 25,
                            background: '#fff',
                            color: '#cf1322',
                            fontWeight: 'bold',
                            border: 'none'
                        }}
                    >
                        KHÁM PHÁ NGAY
                    </Button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

                {/* 2. Features Section - Khối nổi */}
                <Row gutter={[24, 24]} justify="center" style={{ position: 'relative', zIndex: 2 }}>
                    {[
                        {
                            icon: <ToolOutlined />,
                            title: 'Phụ tùng 100% Chính hãng',
                            desc: 'Mọi linh kiện đều có mã vạch, tem chống hàng giả và nguồn gốc rõ ràng từ nhà máy Honda.'
                        },
                        {
                            icon: <SafetyOutlined />,
                            title: 'Tiêu chuẩn An toàn',
                            desc: 'Đảm bảo khả năng vận hành tối ưu và sự an toàn tuyệt đối cho người lái xe trong mọi điều kiện.'
                        },
                        {
                            icon: <DollarOutlined />,
                            title: 'Giá thành Niêm yết',
                            desc: 'Chính sách giá minh bạch, cạnh tranh và nhiều chương trình ưu đãi hấp dẫn cho khách hàng thân thiết.'
                        },
                    ].map((item, index) => (
                        <Col xs={24} md={8} key={index}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 16,
                                    textAlign: 'center',
                                    height: '100%',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    border: 'none'
                                }}
                            >
                                <div style={{
                                    fontSize: 45,
                                    color: '#cf1322',
                                    marginBottom: 20,
                                    background: '#fff1f0',
                                    width: 80,
                                    height: 80,
                                    lineHeight: '90px',
                                    borderRadius: '50%',
                                    margin: '0 auto 20px'
                                }}>
                                    {item.icon}
                                </div>
                                <Title level={4} style={{ marginBottom: 15 }}>{item.title}</Title>
                                <Paragraph style={{ color: '#666', lineHeight: 1.6 }}>{item.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* 3. Detailed Info Section */}
                <div style={{ marginTop: 80, background: '#fff', borderRadius: 24, padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={2}>Về Chúng Tôi</Title>
                            <Divider orientation="left" style={{ borderColor: '#cf1322' }}>Uy tín tạo niềm tin</Divider>
                            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                                Honda Shop khởi đầu từ đam mê với những dòng xe máy Honda huyền thoại. Chúng tôi hiểu rằng, mỗi con ốc, bộ nhông sên dĩa hay tấm lọc gió chính hãng không chỉ giúp xe bền hơn mà còn là sự bảo đảm tính mạng cho người sử dụng.
                            </Paragraph>
                            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                                Với hơn 10 năm kinh nghiệm trong ngành phụ tùng, chúng tôi cam kết nói không với hàng giả, hàng nhái kém chất lượng.
                            </Paragraph>

                            <div style={{ marginTop: 30 }}>
                                <div style={{ marginBottom: 15 }}>
                                    <ClockCircleOutlined style={{ color: '#cf1322', marginRight: 10 }} />
                                    <Text strong>Giờ mở cửa: </Text>
                                    <Text>08:00 - 20:00 (Thứ 2 - Thứ 7) | 08:00 - 18:00 (CN)</Text>
                                </div>
                                <div style={{ marginBottom: 15 }}>
                                    <EnvironmentOutlined style={{ color: '#cf1322', marginRight: 10 }} />
                                    <Text strong>Địa chỉ: </Text>
                                    <Text>456 Honda Street, Quận 5, TP. Hồ Chí Minh</Text>
                                </div>
                                <div>
                                    <PhoneOutlined style={{ color: '#cf1322', marginRight: 10 }} />
                                    <Text strong>Hotline hỗ trợ: </Text>
                                    <Text strong style={{ color: '#cf1322', fontSize: 18 }}>0909 123 456</Text>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: -20,
                                    left: -20,
                                    width: 100,
                                    height: 100,
                                    background: '#cf1322',
                                    borderRadius: 16,
                                    zIndex: 0
                                }}></div>
                                <img
                                    src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800"
                                    alt="Honda Workshop"
                                    style={{
                                        width: '100%',
                                        borderRadius: 16,
                                        position: 'relative',
                                        zIndex: 1,
                                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* 4. Contact & Map Section */}
                <div style={{ marginTop: 60 }}>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>
                        <EnvironmentOutlined /> Tìm Chúng Tôi Tại Đây
                    </Title>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div style={{
                                padding: 10,
                                background: '#fff',
                                borderRadius: 20,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>
                                <iframe
                                    title="Honda Shop Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6697269371!2d106.6648812759058!3d10.7600489594967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee1005c45f9%3A0x717ad3409419f71!2zUXXhuq1uIDUsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                                    width="100%"
                                    height="450"
                                    style={{ border: 0, borderRadius: 12 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* 5. CTA Section */}
                <Card
                    style={{
                        marginTop: 60,
                        textAlign: 'center',
                        background: '#141414',
                        color: '#fff',
                        borderRadius: 24,
                        border: 'none',
                        padding: '30px 0'
                    }}
                >
                    <Title level={3} style={{ color: '#fff' }}>Bạn cần tư vấn kỹ thuật?</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
                        Đội ngũ kỹ thuật viên luôn sẵn sàng giải đáp mọi thắc mắc về mã phụ tùng.
                    </Paragraph>
                    <Row justify="center" gutter={16}>
                        <Col>
                            <Button type="primary" danger size="large" icon={<PhoneOutlined />}>0909 123 456</Button>
                        </Col>
                        <Col>
                            <Button ghost size="large" icon={<MailOutlined />}>Gửi Email ngay</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default About;
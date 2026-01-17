import React from 'react';
import { Result, Button, Card, Typography, Space, Divider, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
    HomeOutlined, 
    FileTextOutlined, 
    CheckCircleFilled, 
    CarOutlined, 
    CustomerServiceOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '60px 20px' }}>
            <Card 
                bordered={false} 
                style={{ 
                    maxWidth: 800, 
                    margin: '0 auto', 
                    borderRadius: 16, 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
                }}
            >
                <Result
                    status="success"
                    title={<Title level={2}>Thanh toán thành công!</Title>}
                    subTitle={
                        <Space direction="vertical">
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                Cảm ơn bạn đã tin tưởng mua sắm. Đơn hàng của bạn đã được hệ thống ghi nhận và đang chờ xác nhận.
                            </Text>
                            <Text strong>Mã đơn hàng: #ORD{Math.floor(Math.random() * 1000000)}</Text>
                        </Space>
                    }
                    extra={[
                        <Button 
                            type="primary" 
                            size="large" 
                            key="home" 
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            style={{ borderRadius: 8, height: 45 }}
                        >
                            Quay lại trang chủ
                        </Button>,
                        <Button 
                            size="large" 
                            key="history" 
                            icon={<FileTextOutlined />}
                            onClick={() => navigate('/order-history')}
                            style={{ borderRadius: 8, height: 45 }}
                        >
                            Quản lý đơn hàng
                        </Button>,
                    ]}
                />

                <Divider />

                <div style={{ padding: '0 40px 20px' }}>
                    <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>Quy trình tiếp theo</Title>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                            <CheckCircleFilled style={{ fontSize: 32, color: '#52c41a', marginBottom: 12 }} />
                            <div style={{ fontWeight: 'bold' }}>Xác nhận</div>
                            <Text type="secondary" size="small">Nhân viên sẽ gọi điện xác nhận đơn hàng</Text>
                        </Col>
                        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                            <CarOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
                            <div style={{ fontWeight: 'bold' }}>Giao hàng</div>
                            <Text type="secondary" size="small">Đơn hàng được bàn giao cho đơn vị vận chuyển</Text>
                        </Col>
                        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                            <CustomerServiceOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 12 }} />
                            <div style={{ fontWeight: 'bold' }}>Hỗ trợ 24/7</div>
                            <Text type="secondary" size="small">Liên hệ 1900 xxxx nếu có bất kỳ thắc mắc nào</Text>
                        </Col>
                    </Row>
                </div>

                <div style={{ 
                    marginTop: 40, 
                    padding: '20px', 
                    background: '#fafafa', 
                    borderRadius: 12, 
                    textAlign: 'center' 
                }}>
                    <Text type="secondary">
                        Hóa đơn điện tử đã được gửi tới email cá nhân của bạn. 
                        Vui lòng kiểm tra hộp thư đến (hoặc thư rác) để biết thêm chi tiết.
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
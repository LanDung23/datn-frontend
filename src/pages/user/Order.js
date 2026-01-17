/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Typography,
    message,
    Empty,
    Input,
    Radio,
    Form,
    Card,
    Row,
    Col,
    Divider,
    Space,
    Steps,
    Tag
} from 'antd';
import { 
    EnvironmentOutlined, 
    CreditCardOutlined, 
    ShoppingOutlined,
    CheckCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const API_URL = process.env.REACT_APP_API_URL;

const Order = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [form] = Form.useForm();
    
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    // Tính tổng tiền đơn hàng
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (user) {
            // Đổ dữ liệu từ localStorage vào Form của Ant Design
            form.setFieldsValue({
                fullName: `${user.lastname || ''} ${user.firstname || ''}`.trim(),
                phone: user.phone || '',
            });
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        if (!userId) return message.warning('Bạn cần đăng nhập');
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);
            setCartItems(res.data.data);
        } catch (error) {
            message.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const items = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }));

            const res = await axios.post(`${API_URL}/orders`, {
                userId,
                items,
                totalPrice: totalAmount,
                note: values.note || '',
                shipping_address: values.shippingAddress,
                paymentMethod: paymentMethod.toLowerCase()
            });

            // Nếu thanh toán PayPal, chuyển hướng sang trang thanh toán của PayPal
            if (paymentMethod === 'paypal' && res.data.approveUrl) {
                window.location.href = res.data.approveUrl;
                return;
            }

            // Nếu COD, xóa giỏ hàng và thông báo thành công
            await axios.delete(`${API_URL}/carts/clear/${userId}`);
            fetchCartCount();
            message.success('Đặt hàng thành công!');
            navigate('/payment-success');
        } catch (error) {
            if (error.errorFields) return; // Lỗi validation form, không cần hiện message
            message.error('Lỗi khi đặt hàng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (
                <Space>
                    <img src={product.image} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    <Text strong>{product.name}</Text>
                </Space>
            )
        },
        {
            title: 'Giá x SL',
            key: 'price_qty',
            render: (_, record) => (
                <Text>{formatCurrency(Number(record.price))} x {record.quantity}</Text>
            )
        },
        {
            title: 'Thành tiền',
            key: 'total',
            align: 'right',
            render: (_, record) => (
                <Text strong type="danger">{formatCurrency(record.price * record.quantity)}</Text>
            )
        }
    ];

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Card bordered={false} style={{ marginBottom: 24, borderRadius: 8 }}>
                    <Steps
                        current={1}
                        items={[
                            { title: 'Giỏ hàng', icon: <ShoppingOutlined /> },
                            { title: 'Xác nhận đơn hàng', icon: <CheckCircleOutlined /> },
                            { title: 'Hoàn tất', icon: <CreditCardOutlined /> },
                        ]}
                    />
                </Card>

                <Title level={2} style={{ marginBottom: 24 }}>Thanh toán</Title>

                {cartItems.length === 0 && !loading ? (
                    <Card style={{ textAlign: 'center' }}>
                        <Empty description="Giỏ hàng trống" />
                        <Button type="primary" onClick={() => navigate('/')}>Quay lại mua sắm</Button>
                    </Card>
                ) : (
                    <Row gutter={24}>
                        {/* Cột trái: Form thông tin */}
                        <Col xs={24} lg={14}>
                            <Form form={form} layout="vertical">
                                <Card 
                                    title={<Space><EnvironmentOutlined /> Thông tin giao hàng</Space>} 
                                    bordered={false} 
                                    style={{ borderRadius: 8, marginBottom: 24 }}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item 
                                                label="Họ và tên" 
                                                name="fullName"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                            >
                                                <Input placeholder="Nguyễn Văn A" size="large" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item 
                                                label="Số điện thoại" 
                                                name="phone"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                            >
                                                <Input placeholder="090..." size="large" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item 
                                        label="Địa chỉ giao hàng" 
                                        name="shippingAddress"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                    >
                                        <TextArea rows={3} placeholder="Số nhà, tên đường, phường/xã..." size="large" />
                                    </Form.Item>
                                    <Form.Item label="Ghi chú đơn hàng" name="note">
                                        <TextArea rows={2} placeholder="Ghi chú cho shipper (tùy chọn)..." />
                                    </Form.Item>
                                </Card>

                                <Card 
                                    title={<Space><CreditCardOutlined /> Phương thức thanh toán</Space>} 
                                    bordered={false} 
                                    style={{ borderRadius: 8 }}
                                >
                                    <Radio.Group 
                                        onChange={e => setPaymentMethod(e.target.value)} 
                                        value={paymentMethod}
                                        style={{ width: '100%' }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Radio.Button value="COD" style={{ width: '100%', height: 'auto', padding: '12px' }}>
                                                <Space>
                                                    <img src="https://cdn-icons-png.flaticon.com/512/6491/6491490.png" alt="cod" style={{ width: 24 }} />
                                                    <div>
                                                        <Text strong>Thanh toán khi nhận hàng (COD)</Text><br/>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>Thanh toán bằng tiền mặt khi shipper giao hàng</Text>
                                                    </div>
                                                </Space>
                                            </Radio.Button>
                                            <Radio.Button value="paypal" style={{ width: '100%', height: 'auto', padding: '12px' }}>
                                                <Space>
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174861.png" alt="paypal" style={{ width: 24 }} />
                                                    <div>
                                                        <Text strong>Thanh toán qua PayPal</Text><br/>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>Thanh toán nhanh chóng và bảo mật qua thẻ quốc tế</Text>
                                                    </div>
                                                </Space>
                                            </Radio.Button>
                                        </Space>
                                    </Radio.Group>
                                </Card>
                            </Form>
                        </Col>

                        {/* Cột phải: Tóm tắt đơn hàng */}
                        <Col xs={24} lg={10}>
                            <Card 
                                title={<Space><ShoppingOutlined /> Đơn hàng của bạn</Space>} 
                                bordered={false} 
                                style={{ borderRadius: 8, position: 'sticky', top: 24 }}
                            >
                                <Table
                                    dataSource={cartItems}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                    style={{ marginBottom: 20 }}
                                />
                                <Divider />
                                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Tạm tính:</Text>
                                    <Text>{formatCurrency(totalAmount)}</Text>
                                </div>
                                <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Phí vận chuyển:</Text>
                                    <Tag color="green">Miễn phí</Tag>
                                </div>
                                <Divider />
                                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 18 }}>Tổng thanh toán:</Text>
                                    <Title level={3} type="danger" style={{ margin: 0 }}>
                                        {formatCurrency(totalAmount)}
                                    </Title>
                                </div>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={handleConfirmOrder}
                                    loading={loading}
                                    style={{ height: 50, borderRadius: 8, fontWeight: 'bold', fontSize: 18 }}
                                >
                                    XÁC NHẬN ĐẶT HÀNG
                                </Button>
                                <Text type="secondary" style={{ textAlign: 'center', display: 'block', marginTop: 12, fontSize: '12px' }}>
                                    Bằng việc đặt hàng, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
                                </Text>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
};

export default Order;
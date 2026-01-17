/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, InputNumber, Typography, message, Popconfirm, Empty, Image, Row, Col, Card, Divider, Space, Tag } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    // Lấy giỏ hàng lần đầu
    const fetchCart = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);
            // Đảm bảo dữ liệu được sắp xếp cố định theo thời gian thêm vào
            const sortedData = res.data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setCartItems(sortedData);
            fetchCartCount();
        } catch (err) {
            message.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // XỬ LÝ CẬP NHẬT SỐ LƯỢNG (Đã sửa lỗi nhảy dòng)
    const handleQuantityChange = async (value, cartItemId) => {
        if (!value || value < 1) return;

        // BƯỚC 1: Cập nhật State cục bộ ngay lập tức (Để UI không bị nhảy)
        const updatedItems = cartItems.map(item => 
            item.id === cartItemId ? { ...item, quantity: value } : item
        );
        setCartItems(updatedItems);

        // BƯỚC 2: Gọi API chạy ngầm để đồng bộ Database
        try {
            await axios.put(`${API_URL}/carts/update`, {
                cartItemId,
                quantity: value
            });
            fetchCartCount(); // Cập nhật số tổng trên Header
        } catch (error) {
            message.error('Không thể lưu số lượng mới');
            fetchCart(); // Nếu lỗi thì mới tải lại dữ liệu chuẩn từ server
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            await axios.delete(`${API_URL}/carts/remove`, {
                data: { cartItemId }
            });
            message.success('Đã xóa sản phẩm');
            // Cập nhật state xóa dòng đó đi luôn, không cần fetch lại toàn bộ
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));
            fetchCartCount();
        } catch {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => (
                <Space size="middle">
                    <Image
                        src={product?.image}
                        alt={product?.name}
                        width={70}
                        height={70}
                        style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                    />
                    <div>
                        <Text strong style={{ fontSize: 15, display: 'block' }}>{product?.name}</Text>
                        <Tag color="blue" style={{ fontSize: 11 }}>Chính hãng</Tag>
                    </div>
                </Space>
            )
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => <Text>{formatCurrency(Number(price))}</Text>
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    // Dùng onChange trực tiếp để lấy giá trị mới nhất
                    onChange={(val) => handleQuantityChange(val, record.id)}
                    style={{ borderRadius: 6, width: 60 }}
                />
            )
        },
        {
            title: 'Thành tiền',
            align: 'right',
            key: 'total',
            render: (_, record) => (
                <Text type="danger" strong>
                    {formatCurrency(record.price * record.quantity)}
                </Text>
            )
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title="Xóa khỏi giỏ hàng?"
                    onConfirm={() => handleRemove(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <Title level={3} style={{ marginBottom: 30 }}>
                    <ShoppingCartOutlined /> Giỏ hàng của bạn
                </Title>

                {cartItems.length === 0 && !loading ? (
                    <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: 12 }}>
                        <Empty description="Giỏ hàng đang trống" />
                        <Button type="primary" onClick={() => navigate('/product')} style={{ marginTop: 20 }}>
                            Quay lại cửa hàng
                        </Button>
                    </Card>
                ) : (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
                                <Table
                                    dataSource={cartItems}
                                    columns={columns}
                                    rowKey="id" // Đảm bảo dùng ID của CartItem để React định danh đúng dòng
                                    loading={loading}
                                    pagination={false}
                                />
                            </Card>
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => navigate('/product')}
                                style={{ marginTop: 16 }}
                                type="link"
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card 
                                title="Chi tiết thanh toán" 
                                bordered={false} 
                                style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">Tạm tính ({cartItems.length} sản phẩm):</Text>
                                    <Text strong>{formatCurrency(totalAmount)}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">Phí vận chuyển:</Text>
                                    <Text success>Miễn phí</Text>
                                </div>
                                <Divider />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                    <Text strong style={{ fontSize: 16 }}>Tổng tiền:</Text>
                                    <Title level={3} style={{ margin: 0, color: '#f5222d' }}>
                                        {formatCurrency(totalAmount)}
                                    </Title>
                                </div>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={() => navigate('/order')}
                                    style={{ height: 50, borderRadius: 8, fontWeight: 'bold' }}
                                >
                                    TIẾN HÀNH ĐẶT HÀNG
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
};

export default CartPage;
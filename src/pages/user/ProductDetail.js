/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Typography, Spin, InputNumber, Button, Tag, Divider, Row, Col, Card, Breadcrumb, Space
} from 'antd';
import {
    ShoppingCartOutlined,
    ThunderboltOutlined,
    CheckCircleFilled,
    HomeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { CartContext } from './CartContext';
import toast, { Toaster } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';

const { Title, Paragraph, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const ProductDetail = () => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCartCount } = useContext(CartContext);

    const productId = location.state?.id; // Ưu tiên lấy từ state nếu có
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/products/${slug}`);
                setProduct(res.data.data);
            } catch (err) {
                toast.error('Không tải được thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
            toast.error('Vui lòng đăng nhập để mua hàng');
            return navigate('/auth/login');
        }

        // Nếu không có productId từ state, dùng id từ dữ liệu product fetch về
        const idToSubmit = productId || product?.id;

        try {
            await axios.post(`${API_URL}/carts/add`, {
                userId: user.id,
                productId: idToSubmit,
                quantity
            });
            toast.success('Đã thêm vào giỏ hàng thành công');
            fetchCartCount();
        } catch {
            toast.error('Thêm vào giỏ hàng thất bại');
        }
    };

    if (loading) return <div style={{ padding: '150px 0', textAlign: 'center' }}><Spin size="large" tip="Đang tải sản phẩm..." /></div>;
    if (!product) return <div style={{ padding: 100, textAlign: 'center' }}><Text type="secondary">Sản phẩm không tồn tại</Text></div>;

    return (
        <div style={{ background: '#f0f2f5', padding: '20px 0 60px 0', minHeight: '100vh' }}>
            <Toaster position="top-right" />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 15px' }}>
                {/* BREADCRUMB */}
                <Breadcrumb style={{ marginBottom: 20 }}>
                    <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/product')} style={{ cursor: 'pointer' }}>
                        Sản phẩm
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Row gutter={[48, 32]}>
                        {/* LEFT: IMAGE */}
                        <Col xs={24} md={10}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    border: '1px solid #f0f0f0',
                                    backgroundColor: '#fff'
                                }}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '100%', display: 'block', transition: 'transform 0.3s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                                {product.discount && (
                                    <div style={{
                                        position: 'absolute', top: 15, left: 15,
                                        background: '#ff4d4f', color: '#fff',
                                        padding: '4px 12px', borderRadius: '4px',
                                        fontWeight: 'bold', boxShadow: '0 2px 8px rgba(255,77,79,0.4)'
                                    }}>
                                        -{product.discount.percentage}%
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* RIGHT: CONTENT */}
                        <Col xs={24} md={14}>
                            <Title level={2} style={{ marginBottom: 8 }}>{product.name}</Title>

                            <Space size="middle" style={{ marginBottom: 16 }}>
                                <Tag color="blue" icon={<CheckCircleFilled />}>Chính hãng</Tag>
                                <Text type="secondary">Danh mục: <Text strong>{product.category?.name}</Text></Text>
                            </Space>

                            <div style={{
                                background: '#fafafa',
                                padding: '16px 24px',
                                borderRadius: 12,
                                marginBottom: 24
                            }}>
                                {product.discount ? (
                                    <Space align="baseline" size="large">
                                        <Text strong style={{ fontSize: 32, color: '#ff4d4f' }}>
                                            {formatCurrency(product.finalPrice)}
                                        </Text>
                                        <Text delete type="secondary" style={{ fontSize: 18 }}>
                                            {formatCurrency(product.originalPrice)}
                                        </Text>
                                    </Space>
                                ) : (
                                    <Text strong style={{ fontSize: 32, color: '#ff4d4f' }}>
                                        {formatCurrency(product.price)}
                                    </Text>
                                )}
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>Mô tả ngắn:</Text>
                                <Paragraph style={{ color: '#595959', lineHeight: '1.8' }}>
                                    {product.description || 'Thông tin chi tiết về sản phẩm này hiện đang được cập nhật.'}
                                </Paragraph>
                            </div>

                            <Divider />

                            {/* QUANTITY & ACTIONS */}
                            <Row gutter={[16, 16]} align="middle">
                                <Col>
                                    <Text strong>Số lượng: </Text>
                                    <InputNumber
                                        min={1}
                                        max={99}
                                        value={quantity}
                                        onChange={setQuantity}
                                        style={{ marginLeft: 12, borderRadius: 6, width: 80 }}
                                        size="large"
                                    />
                                </Col>
                                <Col>
                                    <Text type="secondary">({product.is_active ? 'Còn hàng' : 'Hết hàng'})</Text>
                                </Col>
                            </Row>

                            <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                                <Col xs={24} sm={12}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        disabled={!product.is_active}
                                        style={{
                                            height: 50,
                                            borderRadius: 8,
                                            fontSize: 16,
                                            fontWeight: 600,
                                            background: '#1890ff'
                                        }}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Button
                                        danger
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<ThunderboltOutlined />}
                                        disabled={!product.is_active}
                                        style={{
                                            height: 50,
                                            borderRadius: 8,
                                            fontSize: 16,
                                            fontWeight: 600,
                                            background: '#ff4d4f'
                                        }}
                                        onClick={() => {
                                            handleAddToCart();
                                            navigate('/cart');
                                        }}
                                    >
                                        Mua ngay
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetail;
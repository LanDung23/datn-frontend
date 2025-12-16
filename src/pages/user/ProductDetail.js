/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Typography,
    Spin,
    InputNumber,
    Button,
    Tag,
    Divider
} from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CartContext } from './CartContext';
import toast, { Toaster } from 'react-hot-toast';
import 'antd/dist/reset.css';
import { formatCurrency } from '../../utils/helpers';

const { Title, Paragraph, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const ProductDetail = () => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCartCount } = useContext(CartContext);

    const productId = location.state?.id;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    /* ================= FETCH PRODUCT ================= */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/products/${slug}`);
                setProduct(res.data.data);
            } catch (err) {
                toast.error('Không tải được sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    /* ================= ADD TO CART ================= */
    const handleAddToCart = async () => {
        if (!productId) return toast.error('Không tìm thấy ID sản phẩm');

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
            toast.error('Bạn cần đăng nhập');
            return navigate('/auth/login');
        }

        try {
            await axios.post(`${API_URL}/carts/add`, {
                userId: user.id,
                productId,
                quantity
            });
            toast.success('Đã thêm vào giỏ hàng');
            fetchCartCount();
        } catch {
            toast.error('Thêm vào giỏ hàng thất bại');
        }
    };

    if (loading)
        return (
            <div style={{ padding: 80, textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );

    if (!product) return <div>Sản phẩm không tồn tại</div>;

    return (
        <div style={{ background: '#f5f5f5', padding: '32px 16px' }}>
            <Toaster position="top-right" />

            <div
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: 16,
                    padding: 32,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr',
                    gap: 40
                }}
            >
                {/* ===== IMAGE ===== */}
                <div>
                    <div
                        style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            border: '1px solid #eee'
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: 420,
                                objectFit: 'cover'
                            }}
                        />
                    </div>

                    {product.discount && (
                        <Tag
                            color="red"
                            style={{
                                marginTop: 12,
                                fontSize: 14,
                                padding: '4px 12px'
                            }}
                        >
                            -{product.discount.percentage}% {product.discount.name}
                        </Tag>
                    )}
                </div>

                {/* ===== INFO ===== */}
                <div>
                    <Title level={2}>{product.name}</Title>

                    {/* PRICE */}
                    <div style={{ margin: '16px 0' }}>
                        {product.discount ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Text delete style={{ fontSize: 18, color: '#999' }}>
                                    {formatCurrency(product.originalPrice)}
                                </Text>
                                <Text strong style={{ fontSize: 28, color: '#d4380d' }}>
                                    {formatCurrency(product.finalPrice)}
                                </Text>
                            </div>
                        ) : (
                            <Text strong style={{ fontSize: 28, color: '#d4380d' }}>
                                {product.price ? formatCurrency(product.price) : 'Liên hệ'}
                            </Text>
                        )}
                    </div>

                    <Divider />

                    <Paragraph>
                        <strong>Danh mục:</strong>{' '}
                        {product.category?.name || 'Không xác định'}
                    </Paragraph>

                    <Paragraph>
                        <strong>Tình trạng:</strong>{' '}
                        {product.is_active ? (
                            <Tag color="green">Còn hàng</Tag>
                        ) : (
                            <Tag color="red">Hết hàng</Tag>
                        )}
                    </Paragraph>

                    <Paragraph>
                        <strong>Mô tả:</strong>
                        <br />
                        {product.description || 'Không có mô tả'}
                    </Paragraph>

                    {/* QUANTITY */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginTop: 24
                        }}
                    >
                        <Text strong>Số lượng:</Text>
                        <InputNumber
                            min={1}
                            max={100}
                            value={quantity}
                            onChange={setQuantity}
                        />
                    </div>

                    {/* ACTION */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 16,
                            marginTop: 32
                        }}
                    >
                        <Button
                            type="primary"
                            size="large"
                            icon={<ThunderboltOutlined />}
                            style={{ background: '#fa541c' }}
                        >
                            Mua ngay
                        </Button>

                        <Button
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleAddToCart}
                            disabled={!product.is_active}
                        >
                            Thêm vào giỏ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

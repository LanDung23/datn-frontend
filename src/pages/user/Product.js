/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Input, Checkbox, Slider, Typography,
    Spin, Badge, Empty, Space, Divider
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import {
    SearchOutlined, FilterOutlined, AppstoreOutlined, DollarCircleOutlined
} from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const Product = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');

    const [filters, setFilters] = useState({
        category: [], // Sẽ lưu mảng các name: ["Lốp xe", "Bình điện"]
        price: [0, 10000000],
        keyword: ''
    });

    // 1. FETCH PRODUCTS
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`, {
                params: {
                    // Gửi chuỗi ngăn cách bằng dấu phẩy để BE split(',')
                    categories: filters.category.join(','),
                    priceMin: filters.price[0],
                    priceMax: filters.price[1],
                    search: filters.keyword
                }
            });
            // BE trả về { success: true, data: [...], total: ... }
            setProducts(res.data.data || []);
        } catch (err) {
            toast.error('Lỗi khi tải sản phẩm');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 2. FETCH CATEGORIES (Chỉ chạy 1 lần)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                // QUAN TRỌNG: Backend Service của bạn đang lọc theo `name`
                // Nên value của Checkbox phải là cat.name
                const formatted = res.data.data.map((cat) => ({
                    label: cat.name,
                    value: cat.name
                }));
                setCategories(formatted);
            } catch (err) {
                toast.error('Lỗi khi tải danh mục');
            }
        };
        fetchCategories();
    }, []);

    // 3. DEBOUNCE SEARCH (Tránh gọi API liên tục khi đang gõ)
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, keyword: keywordInput }));
        }, 500);
        return () => clearTimeout(timer);
    }, [keywordInput]);

    // 4. AUTO FETCH KHI FILTER THAY ĐỔI
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    return (
        <div style={{ padding: '40px 20px', background: '#f8f9fa', minHeight: '100vh' }}>
            <Toaster position="top-right" />
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <Row gutter={[24, 24]}>
                    {/* SIDEBAR */}
                    <Col xs={24} lg={6}>
                        <Card variant="false" style={{ borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'sticky', top: 24 }}>
                            <Space align="center" style={{ marginBottom: 20 }}>
                                <FilterOutlined style={{ color: '#cf1322', fontSize: 20 }} />
                                <Title level={4} style={{ margin: 0 }}>Bộ lọc tìm kiếm</Title>
                            </Space>

                            {/* TÌM KIẾM */}
                            <div style={{ marginBottom: 30 }}>
                                <Text strong style={{ display: 'block', marginBottom: 10 }}>Tìm theo tên</Text>
                                <Input
                                    placeholder="Nhập tên phụ tùng..."
                                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    allowClear
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                />
                            </div>

                            <Divider />

                            {/* DANH MỤC */}
                            <div style={{ marginBottom: 30 }}>
                                <Space style={{ marginBottom: 12 }}>
                                    <AppstoreOutlined style={{ color: '#cf1322' }} />
                                    <Text strong>Phân loại phụ tùng</Text>
                                </Space>
                                {categories.length > 0 ? (
                                    <Checkbox.Group
                                        options={categories}
                                        value={filters.category}
                                        onChange={(checked) => setFilters(prev => ({ ...prev, category: checked }))}
                                        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                                    />
                                ) : <Spin size="small" />}
                            </div>

                            <Divider />

                            {/* GIÁ CẢ */}
                            <div style={{ marginBottom: 20 }}>
                                <Space style={{ marginBottom: 12 }}>
                                    <DollarCircleOutlined style={{ color: '#cf1322' }} />
                                    <Text strong>Khoảng giá (VNĐ)</Text>
                                </Space>
                                <Slider
                                    range
                                    min={0}
                                    max={10000000}
                                    step={100000}
                                    value={filters.price}
                                    tooltip={{ formatter: val => formatCurrency(val) }}
                                    onChange={(value) => setFilters(prev => ({ ...prev, price: value }))}
                                    trackStyle={{ background: '#cf1322' }}
                                    handleStyle={{ borderColor: '#cf1322' }}
                                />
                                <div style={{ background: '#fff1f0', padding: '10px', borderRadius: 8, textAlign: 'center', border: '1px solid #ffa39e' }}>
                                    <Text strong style={{ color: '#cf1322' }}>
                                        {formatCurrency(filters.price[0])} — {formatCurrency(filters.price[1])}
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* GRID SẢN PHẨM */}
                    <Col xs={24} lg={18}>
                        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px 25px', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                            <Title level={4} style={{ margin: 0 }}>
                                Tất cả phụ tùng
                                <Badge count={products.length} style={{ backgroundColor: '#cf1322', marginLeft: 10 }} overflowCount={999} />
                            </Title>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Spin size="large" tip="Đang tìm linh kiện..." />
                            </div>
                        ) : (
                            <Row gutter={[20, 20]}>
                                {products.length > 0 ? (
                                    products.map((p) => (
                                        <Col xs={12} sm={8} md={8} xl={6} key={p.id}>
                                            <Card
                                                hoverable
                                                style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }}
                                                onClick={() => navigate(`/products/${p.slug}`, { state: { id: p.id } })}
                                                cover={
                                                    <div style={{ height: 180, overflow: 'hidden' }}>
                                                        <img alt={p.name} src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                }
                                            >
                                                <Card.Meta
                                                    title={<Text strong style={{ fontSize: 14 }}>{p.name}</Text>}
                                                    description={
                                                        <div style={{ marginTop: 8 }}>
                                                            <Text strong style={{ color: '#cf1322', fontSize: 16 }}>
                                                                {formatCurrency(Number(p.finalPrice || p.price))}
                                                            </Text>
                                                            {p.discount && (
                                                                <div style={{ fontSize: 12 }}>
                                                                    <Text delete type="secondary">{formatCurrency(Number(p.originalPrice))}</Text>
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col span={24}>
                                        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '60px 0' }}>
                                            <Empty description="Không tìm thấy sản phẩm phù hợp" />
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Product;
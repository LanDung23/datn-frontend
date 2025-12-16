/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Input,
    Checkbox,
    Slider,
    Typography,
    Spin
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import 'antd/dist/reset.css';
import { formatCurrency } from '../../utils/helpers';

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const Product = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // 🔹 keyword input realtime
    const [keywordInput, setKeywordInput] = useState('');

    // 🔹 filters thực sự dùng để fetch
    const [filters, setFilters] = useState({
        category: [],
        price: [0, 10000000],
        keyword: ''
    });

    /* =========================
        FETCH PRODUCTS
    ========================= */
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`, {
                params: {
                    categories: filters.category.join(','),
                    priceMin: filters.price[0],
                    priceMax: filters.price[1],
                    search: filters.keyword
                }
            });

            setProducts(res.data.rows || []);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    /* =========================
        FETCH CATEGORIES
    ========================= */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.data.map((cat) => cat.name));
            } catch (err) {
                console.error(err);
                toast.error('Lỗi khi tải danh mục');
            }
        };
        fetchCategories();
    }, []);

    /* =========================
        DEBOUNCE SEARCH (500ms)
    ========================= */
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({
                ...prev,
                keyword: keywordInput
            }));
        }, 500);

        return () => clearTimeout(timer);
    }, [keywordInput]);

    /* =========================
        REFRESH PRODUCTS
    ========================= */
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleClickProduct = (product) => {
        navigate(`/products/${product.slug}`, { state: { id: product.id } });
    };

    return (
        <div
            style={{
                padding: '30px 20px',
                background: '#f5f5f5',
                minHeight: 'calc(100vh - 64px)'
            }}
        >
            <Toaster position="top-right" />

            <Row gutter={24}>
                {/* ===== FILTER COLUMN ===== */}
                <Col xs={24} md={6}>
                    <div
                        style={{
                            background: '#fff',
                            padding: 20,
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            position: 'sticky',
                            top: 20
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 20, color: '#cf1322' }}>
                            Lọc sản phẩm
                        </Title>

                        {/* 🔍 REALTIME SEARCH */}
                        <Input
                            placeholder="Tìm kiếm..."
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            allowClear
                            size="large"
                            style={{ marginBottom: 24 }}
                        />

                        {/* CATEGORY */}
                        <Title level={5} style={{ marginBottom: 12 }}>
                            Phân loại phụ tùng
                        </Title>
                        <Checkbox.Group
                            options={categories}
                            value={filters.category}
                            onChange={(checked) =>
                                setFilters((prev) => ({ ...prev, category: checked }))
                            }
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                marginBottom: 24
                            }}
                        />

                        {/* PRICE */}
                        <Title level={5} style={{ marginBottom: 12 }}>
                            Giá sản phẩm
                        </Title>
                        <Slider
                            range
                            min={0}
                            max={10000000}
                            step={100000}
                            value={filters.price}
                            onChange={(value) =>
                                setFilters((prev) => ({ ...prev, price: value }))
                            }
                        />
                        <div
                            style={{
                                color: '#666',
                                fontSize: 13,
                                background: '#f5f5f5',
                                padding: '8px 12px',
                                borderRadius: 6
                            }}
                        >
                            <strong>Giá:</strong>{' '}
                            {formatCurrency(filters.price[0])} -{' '}
                            {formatCurrency(filters.price[1])}
                        </div>
                    </div>
                </Col>

                {/* ===== PRODUCT COLUMN ===== */}
                <Col xs={24} md={18}>
                    <Title
                        level={4}
                        style={{
                            marginBottom: 24,
                            paddingBottom: 12,
                            borderBottom: '2px solid #cf1322'
                        }}
                    >
                        Tất cả sản phẩm
                        <span
                            style={{
                                fontSize: 14,
                                color: '#999',
                                marginLeft: 12
                            }}
                        >
                            ({products.length} sản phẩm)
                        </span>
                    </Title>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Row gutter={[24, 24]}>
                            {products.map((p) => (
                                <Col xs={12} sm={8} md={6} key={p.id}>
                                    <Card
                                        hoverable
                                        onClick={() => handleClickProduct(p)}
                                        style={{
                                            borderRadius: 12,
                                            cursor: 'pointer'
                                        }}
                                        cover={
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                style={{
                                                    height: 180,
                                                    width: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        }
                                    >
                                        <Card.Meta
                                            title={p.name}
                                            description={
                                                p.discount ? (
                                                    <>
                                                        <span
                                                            style={{
                                                                textDecoration: 'line-through',
                                                                color: '#999'
                                                            }}
                                                        >
                                                            {formatCurrency(p.originalPrice)}
                                                        </span>
                                                        <br />
                                                        <span
                                                            style={{
                                                                color: '#d4380d',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {formatCurrency(p.finalPrice)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span
                                                        style={{
                                                            color: '#d4380d',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {formatCurrency(p.price)}
                                                    </span>
                                                )
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Product;

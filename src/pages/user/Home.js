/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Input, message, Row, Col, Badge, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
    LeftOutlined, 
    RightOutlined, 
    ToolOutlined, 
    SafetyOutlined, 
    DollarOutlined, 
    RocketOutlined,
    SearchOutlined 
} from "@ant-design/icons";
import axios from "axios";
import { formatCurrency } from "../../utils/helpers";

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

// --- Styled Components (Inline for single file) ---
const arrowButtonStyle = (direction, hover) => ({
    position: "absolute",
    top: "45%",
    [direction]: -15,
    zIndex: 10,
    cursor: "pointer",
    background: hover ? "#cf1322" : "#fff",
    borderRadius: "50%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    transform: "translateY(-50%)",
});

const ArrowButton = ({ onClick, direction }) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
            style={arrowButtonStyle(direction, hover)} 
            onClick={onClick} 
            onMouseEnter={() => setHover(true)} 
            onMouseLeave={() => setHover(false)}
        >
            {direction === "left" ? 
                <LeftOutlined style={{ color: hover ? "#fff" : "#333" }} /> : 
                <RightOutlined style={{ color: hover ? "#fff" : "#333" }} />
            }
        </div>
    );
};

// --- Product Components ---
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate(`/products/${product.slug}`, { state: { id: product.id } });

    return (
        <Badge.Ribbon 
            text={`-${product.discount?.percentage}%`} 
            color="#cf1322" 
            style={{ display: product.discount ? "block" : "none" }}
        >
            <Card
                hoverable
                onClick={handleClick}
                style={{ 
                    borderRadius: 12, 
                    overflow: 'hidden', 
                    margin: "10px 8px",
                    border: '1px solid #f0f0f0'
                }}
                cover={
                    <div style={{ height: 180, overflow: 'hidden', background: '#f5f5f5' }}>
                        {product.image ? (
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ToolOutlined style={{ fontSize: 40, color: '#ccc' }} />
                            </div>
                        )}
                    </div>
                }
            >
                <div style={{ minHeight: 80 }}>
                    <Text strong ellipsis={{ tooltip: product.name }} style={{ fontSize: 15, display: 'block' }}>
                        {product.name}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                        {product.price && product.price > 0 ? (
                            <>
                                {product.discount ? (
                                    <>
                                        <Text delete type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
                                            {formatCurrency(Number(product.price))}
                                        </Text>
                                        <Text style={{ color: "#cf1322", fontWeight: 700, fontSize: 16 }}>
                                            {formatCurrency(Number(product.finalPrice))}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={{ color: "#cf1322", fontWeight: 700, fontSize: 16 }}>
                                        {formatCurrency(Number(product.price))}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text type="secondary">Liên hệ giá</Text>
                        )}
                    </div>
                </div>
            </Card>
        </Badge.Ribbon>
    );
};

const ProductSlider = ({ title, products, loading, icon }) => {
    if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>;
    if (!products || products.length === 0) return null;

    const sliderSettings = {
        dots: false,
        infinite: products.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <ArrowButton direction="right" />,
        prevArrow: <ArrowButton direction="left" />,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, borderBottom: '2px solid #f0f0f0', paddingBottom: 10 }}>
                {icon && <span style={{ marginRight: 10, color: '#cf1322', fontSize: 20 }}>{icon}</span>}
                <Title level={3} style={{ margin: 0, fontSize: 22 }}>{title}</Title>
            </div>
            <Slider {...sliderSettings}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </Slider>
        </div>
    );
};

// --- Main Home Component ---
const Home = () => {
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resFeatured, resCategories] = await Promise.all([
                    axios.get(`${API_URL}/products`, { params: { featured: true } }),
                    axios.get(`${API_URL}/categories/with-products`)
                ]);
                setFeaturedProducts(resFeatured.data.data || []);
                setCategories(resCategories.data.data || []);
            } catch (err) {
                console.error("Lỗi tải trang chủ:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (keywordInput.trim()) {
                fetchSearch(keywordInput.trim());
            } else {
                setSearchResults([]);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [keywordInput]);

    const fetchSearch = async (keyword) => {
        setSearchLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`, { params: { search: keyword } });
            setSearchResults(res.data.data || []);
        } catch (err) {
            message.error("Lỗi tìm kiếm");
        } finally {
            setSearchLoading(false);
        }
    };

    if (loading) return (
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Spin size="large" />
            <Text style={{ marginTop: 16 }} type="secondary">Đang tải dữ liệu phụ tùng...</Text>
        </div>
    );

    return (
        <div style={{ background: "#fbfbfb", minHeight: "100vh" }}>
            
            {/* 1. Hero Section */}
            <div style={{ 
                background: "linear-gradient(135deg, #1f1f1f 0%, #434343 100%)", 
                padding: "80px 20px", 
                textAlign: "center" 
            }}>
                <Title level={1} style={{ color: "#fff", marginBottom: 16 }}>
                    PHỤ TÙNG HONDA CHÍNH HÃNG
                </Title>
                <Paragraph style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, marginBottom: 40 }}>
                    Chất lượng bền bỉ - An tâm trên mọi nẻo đường
                </Paragraph>
                <div style={{ maxWidth: 650, margin: "0 auto" }}>
                    <Search
                        placeholder="Bạn cần tìm linh kiện gì cho xế yêu?"
                        enterButton={<div style={{ padding: '0 10px' }}><SearchOutlined /> Tìm kiếm</div>}
                        size="large"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        loading={searchLoading}
                        allowClear
                        style={{ height: 50 }}
                    />
                </div>
            </div>

            <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 20px" }}>
                
                {/* 2. Trust Badges */}
                <Row gutter={[24, 24]} style={{ marginTop: -40, marginBottom: 60 }}>
                    {[
                        { icon: <ToolOutlined />, title: "Chính Hãng 100%", desc: "Nhập trực tiếp từ Honda" },
                        { icon: <SafetyOutlined />, title: "Bảo Hành Uy Tín", desc: "Theo tiêu chuẩn nhà sản xuất" },
                        { icon: <DollarOutlined />, title: "Giá Tốt Nhất", desc: "Cạnh tranh nhất thị trường" },
                        { icon: <RocketOutlined />, title: "Giao Hàng Nhanh", desc: "Toàn quốc 24/7" },
                    ].map((item, index) => (
                        <Col xs={12} md={6} key={index}>
                            <Card variant="false" style={{ textAlign: 'center', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                                <div style={{ fontSize: 32, color: '#cf1322', marginBottom: 12 }}>{item.icon}</div>
                                <Title level={5} style={{ marginBottom: 4 }}>{item.title}</Title>
                                <Text type="secondary" style={{ fontSize: 13 }}>{item.desc}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* 3. Search Results Overlay-like Section */}
                {keywordInput && (
                    <div style={{ 
                        background: '#fff', 
                        padding: '30px', 
                        borderRadius: 16, 
                        marginBottom: 40, 
                        border: '2px solid #ffccc7' 
                    }}>
                        <ProductSlider 
                            title={`Kết quả tìm kiếm cho: "${keywordInput}"`} 
                            products={searchResults} 
                            loading={searchLoading} 
                        />
                        {!searchLoading && searchResults.length === 0 && (
                            <Empty description="Không tìm thấy sản phẩm nào" />
                        )}
                    </div>
                )}

                {/* 4. Main Content */}
                <ProductSlider 
                    title="SẢN PHẨM NỔI BẬT" 
                    products={featuredProducts} 
                    icon={<RocketOutlined />} 
                />

                {categories.map(cat => (
                    <ProductSlider 
                        key={cat.id} 
                        title={cat.name.toUpperCase()} 
                        products={cat.products || []} 
                    />
                ))}

            </div>
            
            {/* 5. Footer Decoration */}
            <div style={{ textAlign: 'center', padding: '60px 0', background: '#f0f0f0', marginTop: 80 }}>
                <Title level={4} type="secondary">BẠN KHÔNG TÌM THẤY PHỤ TÙNG CẦN THIẾT?</Title>
                <Text type="secondary">Gửi tin nhắn cho chúng tôi qua Zalo hoặc Hotline để được hỗ trợ tra mã miễn phí.</Text>
            </div>
        </div>
    );
};

export default Home;
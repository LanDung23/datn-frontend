/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Table, Card, Spin, message, Tag, Typography, Tabs, Empty, Space, Divider, Row, Col } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined, CarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text } = Typography;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

            const res = await axios.get(`${API_URL}/orders/user/${user.id}/details`);
            // Sắp xếp đơn mới nhất lên đầu
            const sortedOrders = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (error) {
            message.error('Lấy lịch sử đơn hàng thất bại');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // 1. HÀM RENDER TAG TRẠNG THÁI (Dùng cho cả hiển thị và lọc)
    const renderStatusTag = (status = "") => {
        const s = status.toLowerCase(); // Chuẩn hóa về chữ thường để so sánh
        if (s === 'pending' || s === 'chờ xác nhận')
            return <Tag icon={<ClockCircleOutlined />} color="warning">CHỜ XÁC NHẬN</Tag>;
        if (s === 'confirmed' || s === 'đã xác nhận')
            return <Tag icon={<CheckCircleOutlined />} color="blue">ĐÃ XÁC NHẬN</Tag>;
        if (s === 'shipping' || s === 'đang giao')
            return <Tag icon={<CarOutlined />} color="processing">ĐANG GIAO HÀNG</Tag>;
        if (s === 'paid' || s === 'đã giao' || s === 'thanh toán')
            return <Tag icon={<CheckCircleOutlined />} color="success">HOÀN TẤT</Tag>;
        if (s === 'cancelled' || s === 'đã hủy')
            return <Tag icon={<CloseCircleOutlined />} color="error">ĐÃ HỦY</Tag>;
        return <Tag color="default">{status.toUpperCase()}</Tag>;
    };

    // 2. LOGIC LỌC ĐƠN HÀNG (Sửa lỗi không hiện khi chọn tab)
    const filterOrders = (statusKey) => {
        if (statusKey === 'all') return orders;

        return orders.filter(order => {
            const s = order.status.toLowerCase();
            if (statusKey === 'pending') return s === 'pending' || s === 'chờ xác nhận';
            if (statusKey === 'shipping') return s === 'shipping' || s === 'đang giao';
            if (statusKey === 'paid') return s === 'paid' || s === 'đã giao' || s === 'thành công';
            return false;
        });
    };

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Space>
                    <img src={record.product?.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    <Text strong>{record.product?.name}</Text>
                </Space>
            )
        },
        { title: 'SL', dataIndex: 'quantity', key: 'quantity', align: 'center' },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (p) => formatCurrency(Number(p))
        }
    ];

    const OrderList = ({ data }) => (
        data.length === 0 ? (
            <Empty description="Không có đơn hàng nào" style={{ padding: '40px 0' }} />
        ) : (
            data.map((order) => (
                <Card
                    key={order.id}
                    style={{ marginBottom: '20px', borderRadius: 12 }}
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space>
                                <Text strong>#ORD{order.id}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                            </Space>
                            {renderStatusTag(order.status)}
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={order.orderItems}
                        pagination={false}
                        size="small"
                        rowKey="id"
                    />
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ textAlign: 'right' }}>
                        <Text>Tổng thanh toán: </Text>
                        <Text type="danger" strong style={{ fontSize: 18 }}>
                            {formatCurrency(Number(order.total_price))}
                        </Text>
                    </div>
                </Card>
            ))
        )
    );

    return (
        <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Title level={2}><ShoppingOutlined /> Lịch sử mua hàng</Title>

                {loading ? <Spin size="large" /> : (
                    <Tabs
                        defaultActiveKey="all"
                        items={[
                            { label: 'Tất cả', key: 'all', children: <OrderList data={filterOrders('all')} /> },
                            { label: 'Chờ xác nhận', key: 'pending', children: <OrderList data={filterOrders('pending')} /> },
                            { label: 'Đang giao', key: 'shipping', children: <OrderList data={filterOrders('shipping')} /> },
                            { label: 'Hoàn tất', key: 'paid', children: <OrderList data={filterOrders('paid')} /> },
                        ]}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
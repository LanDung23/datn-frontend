/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Avatar, Row, Col, Divider, Space, Tag } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, MailOutlined, PhoneOutlined, LockOutlined, CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import normalizeFileName from '../../utils/normalizeFileName';

const { Title, Text } = Typography;

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [userData, setUserData] = useState({});
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Vui lòng đăng nhập lại.');
            navigate('/auth/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (storedUser && storedUser.id) {
            form.setFieldsValue({
                firstname: storedUser.firstname,
                lastname: storedUser.lastname,
                email: storedUser.email,
                phone: storedUser.phone,
            });
            setUserData(storedUser);
        }
    }, [form]);

    const handleUploadChange = ({ fileList }) => {
        const rawFile = fileList?.[0]?.originFileObj;
        if (!rawFile) return;
        const newFileName = normalizeFileName(rawFile.name);
        const renamedFile = new File([rawFile], newFileName, { type: rawFile.type });
        setFile(renamedFile);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(renamedFile);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'password' && !values[key]) return;
            formData.append(key, values[key]);
        });
        if (file) formData.append('image', file);

        try {
            const res = await axios.put(`${API_URL}/users/${storedUser.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            message.success('Cập nhật thành công!');
            const updatedUser = { ...res.data.data, role: storedUser.role };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setIsEditing(false);
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            message.error('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '30px 15px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <Row gutter={[24, 24]}>
                    {/* Cột 1: Thông tin tổng quan */}
                    <Col xs={24} md={8}>
                        <Card bordered={false} style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ position: 'relative', width: 140, margin: '0 auto 20px' }}>
                                <Avatar
                                    size={140}
                                    src={previewImage || userData.image}
                                    icon={<UserOutlined />}
                                    style={{ border: '3px solid #1890ff', padding: 2, background: '#fff' }}
                                />
                                {isEditing && (
                                    <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUploadChange} accept="image/*">
                                        <Button 
                                            type="primary"
                                            shape="circle" 
                                            icon={<CameraOutlined />} 
                                            style={{ position: 'absolute', bottom: 5, right: 5, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                                        />
                                    </Upload>
                                )}
                            </div>
                            <Title level={4} style={{ marginBottom: 4 }}>{userData.lastname} {userData.firstname}</Title>
                            <Tag color="blue" style={{ borderRadius: 10, padding: '0 12px' }}>
                                {userData.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                            </Tag>
                            
                            <Divider style={{ margin: '20px 0' }} />
                            
                            <Space direction="vertical" style={{ width: '100%', textAlign: 'left' }} size={12}>
                                <div><Text type="secondary" size="small">Email</Text><br/><Text strong>{userData.email}</Text></div>
                                <div><Text type="secondary" size="small">Số điện thoại</Text><br/><Text strong>{userData.phone || 'Chưa cập nhật'}</Text></div>
                            </Space>
                        </Card>
                    </Col>

                    {/* Cột 2: Form chỉnh sửa */}
                    <Col xs={24} md={16}>
                        <Card 
                            bordered={false} 
                            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            title={<span style={{ fontSize: 18, fontWeight: 600 }}>Chi tiết hồ sơ</span>}
                            extra={!isEditing && (
                                <Button type="link" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                            )}
                        >
                            <Form form={form} layout="vertical" onFinish={onFinish} disabled={!isEditing}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Họ" name="lastname" rules={[{ required: true, message: 'Nhập họ' }]}>
                                            <Input placeholder="Họ" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Tên" name="firstname" rules={[{ required: true, message: 'Nhập tên' }]}>
                                            <Input placeholder="Tên" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Email" name="email">
                                    <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} disabled />
                                </Form.Item>

                                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
                                    <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="Số điện thoại" />
                                </Form.Item>

                                {isEditing && (
                                    <>
                                        <Divider orientation="left" plain><Text type="secondary">Bảo mật</Text></Divider>
                                        <Form.Item label="Mật khẩu mới (Nếu cần thay đổi)" name="password">
                                            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập mật khẩu mới" />
                                        </Form.Item>
                                        
                                        <div style={{ textAlign: 'right', marginTop: 30 }}>
                                            <Space>
                                                <Button icon={<CloseOutlined />} onClick={() => { setIsEditing(false); form.resetFields(); setPreviewImage(null); }}>Hủy</Button>
                                                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} style={{ padding: '0 25px' }}>Lưu thay đổi</Button>
                                            </Space>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Profile;
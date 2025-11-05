"use client";

import React from "react";
import {
	Table,
	Input,
	Pagination,
	Spin,
	Image,
	Typography,
	Layout,
	Modal,
	Button,
	Flex,
	Form,
	message,
	InputNumber,
	Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

interface Product {
	product_id: string;
	product_title: string;
	product_price: number;
	product_description?: string;
	product_image?: string;
	product_category?: string;
	created_timestamp: string;
}

interface ApiResponse {
	data: Product[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
}

export default function ProductsPage() {
	const [products, setProducts] = React.useState<Product[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [serverLoading, setServerLoading] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(1);
	const [total, setTotal] = React.useState<number>(0);
	const [search, setSearch] = React.useState<string>("");
	const [modalVisible, setModalVisible] = React.useState<boolean>(false);
	const [editingProduct, setEditingProduct] = React.useState<Product | null>(
		null
	);
	const [form] = Form.useForm();

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const res = await axios.get<ApiResponse>("/api/products", {
				params: { page, limit: 10, search },
			});

			setProducts(res.data.data);
			setTotal(res.data.pagination.total);
		} catch (err) {
			console.error("Error fetching products:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fetch data with debounce
	React.useEffect(() => {
		const timeout = setTimeout(() => fetchProducts(), 300);
		return () => clearTimeout(timeout);
	}, [page, search]);

	const handleSubmit = async () => {
		setServerLoading(true);
		message.loading({ content: "Saving product...", key: "savingProduct" });
		try {
			const values = await form.validateFields();
			if (editingProduct) {
				// update
				await axios.put("/api/product", { ...editingProduct, ...values });
				message.success({
					content: "Product updated successfully!",
					key: "savingProduct",
				});
			} else {
				// create
				await axios.post("/api/product", values);
				message.success({
					content: "Product created successfully!",
					key: "savingProduct",
				});
			}
			setServerLoading(false);
			setModalVisible(false);
			form.resetFields();
			setEditingProduct(null);
			fetchProducts();
		} catch (err) {
			setServerLoading(false);
			message.error({ content: "Failed to save product.", key: "savingProduct" });
			console.error(err);
		}
	};

	const handleDelete = (record: Product) => {
		Modal.confirm({
			title: "Are you sure you want to delete this product?",
			content: record.product_title,
			okText: "Yes, delete",
			okType: "danger",
			cancelText: "Cancel",
			okButtonProps: {
				disabled: serverLoading,
			},
			onOk: async () => {
				setServerLoading(true);
				try {
					await axios.delete("/api/product", {
						params: { product_id: record.product_id },
					});
					setServerLoading(false);
					message.success("Product deleted successfully!");
					fetchProducts();
				} catch (err) {
					console.error(err);
					setServerLoading(false);
					message.error("Failed to delete product.");
				}
			},
		});
	};

	const openCreateModal = () => {
		setEditingProduct(null);
		form.resetFields();
		setModalVisible(true);
	};

	const openEditModal = (record: Product) => {
		setEditingProduct(record);
		form.setFieldsValue(record);
		setModalVisible(true);
	};

	const columns: ColumnsType<Product> = [
		{
			title: "Image",
			dataIndex: "product_image",
			key: "image",
			render: (url) => <Image src={url} alt="product" width={60} height={60} />,
		},
		{
			title: "Title",
			dataIndex: "product_title",
			key: "title",
		},
		{
			title: "Price",
			dataIndex: "product_price",
			key: "price",
			render: (price) =>
				new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(price),
		},
		{
			title: "Category",
			dataIndex: "product_category",
			key: "category",
		},
		{
			title: "Description",
			dataIndex: "product_description",
			key: "description",
			ellipsis: true,
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<Space size="small">
					<Button type="link" onClick={() => openEditModal(record)}>
						Edit
					</Button>
					<Button type="link" danger onClick={() => handleDelete(record)}>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<Layout.Content style={{ padding: "24px", minHeight: "100vh" }}>
			<Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
				<Typography.Title level={1}>Product List</Typography.Title>
				<Button type="primary" onClick={openCreateModal}>
					+ Add Product
				</Button>
			</Flex>

			<Input.Search
				placeholder="Search products..."
				onChange={(e) => setSearch(e.target.value)}
				style={{ width: 300, marginBottom: 16 }}
				allowClear
			/>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Spin size="large" />
				</div>
			) : (
				<Table
					rowKey="product_id"
					size="small"
					columns={columns}
					dataSource={products}
					pagination={false}
				/>
			)}

			<Pagination
				current={page}
				total={total}
				pageSize={10}
				onChange={(p) => setPage(p)}
				style={{ marginTop: 16, textAlign: "right" }}
			/>

			{/* Modal Create/Edit */}
			<Modal
				title={editingProduct ? "Edit Product" : "Add Product"}
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={handleSubmit}
				okButtonProps={{
					disabled: serverLoading,
				}}
				okText={editingProduct ? "Update" : "Create"}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="product_title"
						label="Title"
						rules={[{ required: true, message: "Please input product title" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="product_price"
						label="Price"
						rules={[{ required: true, message: "Please input product price" }]}
					>
						<InputNumber className="w-full" min={1} />
					</Form.Item>

					<Form.Item name="product_category" label="Category">
						<Input />
					</Form.Item>

					<Form.Item name="product_description" label="Description">
						<Input.TextArea rows={3} />
					</Form.Item>

					<Form.Item name="product_image" label="Image URL">
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</Layout.Content>
	);
}

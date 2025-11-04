import { Button, Checkbox, Form, Input } from "antd";
import React from "react";

type FieldType = {
	username: string;
	password: string;
};

export const InnerLoginForm: React.FC = () => {
	const onFinish = (values: FieldType) => {
		console.log("Received values of form: ", values);
	};

	return (
		<Form
			name="login-form"
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
		>
			<Form.Item
				hasFeedback
				label="Email"
				name="email"
				validateDebounce={2000}
				rules={[
					{
						type: "email",
						message: "The input is not valid email!",
					},
					{
						required: true,
						message: "Please input your email!",
					},
				]}
			>
				<Input placeholder="Input your email." required />
			</Form.Item>
			<Form.Item
				label="Password"
				name="password"
				hasFeedback
				rules={[
					{
						required: true,
						message: "Please input your password!",
					},
				]}
			>
				<Input.Password placeholder="Input your password" required />
			</Form.Item>
			<Form.Item>
				<Form.Item name="remember" valuePropName="checked" noStyle>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>
			</Form.Item>

			<Form.Item>
				<Button block type="primary" htmlType="submit">
					Log in
				</Button>
			</Form.Item>
		</Form>
	);
};

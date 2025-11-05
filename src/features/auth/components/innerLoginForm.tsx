import { Button, Checkbox, Form, Input, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "~/contexts/authContext";
import { firebaseAuth } from "~/libs/firebase/firebase";

type FieldType = {
	email: string;
	password: string;
  remember: boolean;
};

export const InnerLoginForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  if(user) {
    router.push("/products");
  }

	const onFinish = async (values: FieldType) => {
    message.loading({ content: 'Logging in...', key: 'login' });
    try {
      await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
      router.push("/products");
      message.success({ content: 'Logged in successfully!', key: 'login' });
    } catch (error: any) {
      console.log(error)
      message.error({ content: `Login failed: ${error.message}`, key: 'login' });
    }
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

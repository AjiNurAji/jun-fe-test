"use client";

import { Card, Flex } from "antd";
import { InnerLoginForm } from "./components/innerLoginForm";
import loginCss from "./styles/login.module.css";

const LoginPage = () => {
	return (
		<div className="h-screen container">
			<Flex justify="center" align="center" className="h-full">
				<Card className={loginCss.loginBox}>
          <div className={loginCss.headerCard}>
            <h1>Welcome Back</h1>
            <p className="desc">Lorem ipsum dolor sit amet.</p>
          </div>
					<Flex vertical gap={15}>
            <InnerLoginForm />
          </Flex>
				</Card>
			</Flex>
		</div>
	);
};

export default LoginPage;
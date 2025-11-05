"use client";
import { message } from "antd";
import React from "react";

const DefaultLayout = ({ children }: React.PropsWithChildren) => {
	const [, contextHolder] = message.useMessage();
	return (
		<main>
			{contextHolder}
			{children}
		</main>
	);
};

export default DefaultLayout;

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const search = url.searchParams.get("search") || "";
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";

	try {
		const res = await axios.get("http://localhost:8001/api/web/v1/products", {
			params: { search, page, limit },
		});
		return NextResponse.json(res.data);
	} catch (error: any) {
		console.error("API error:", error.message);
		return NextResponse.json(
			{ message: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}

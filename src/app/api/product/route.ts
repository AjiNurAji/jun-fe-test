import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "http://localhost:8001/api/web/v1/product";

// Create Product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await axios.post(BASE_URL, body);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Create product error:", err.message);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

// Edit Product
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const res = await axios.put(BASE_URL, body);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Update product error:", err.message);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

// Delete Product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json({ message: "Missing product_id" }, { status: 400 });
    }

    const res = await axios.delete(BASE_URL, { data: { product_id } });
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Delete product error:", err.message);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
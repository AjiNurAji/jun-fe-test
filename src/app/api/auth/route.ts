"use server";

import { NextRequest, NextResponse } from "next/server";

export default async function handle(req: NextRequest, res: NextResponse) {
  console.log(req)
}

export {handle as POST};
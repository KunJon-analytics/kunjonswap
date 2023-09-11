import urlParamsToObject from "@/lib/urlParamsToObject";
import { NextResponse } from "next/server";
import qs from "qs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryObject = urlParamsToObject(searchParams);
  const query = qs.stringify(queryObject);
  const res = await fetch(`https://api.0x.org/swap/v1/price?${query}`, {
    headers: {
      "Content-Type": "application/json",
      "0x-api-key": process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();

  return NextResponse.json(data);
}

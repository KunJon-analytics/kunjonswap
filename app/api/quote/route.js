// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import qs from "qs";
import { NextResponse } from "next/server";
import urlParamsToObject from "@/lib/urlParamsToObject";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryObject = urlParamsToObject(searchParams);
  const query = qs.stringify(queryObject);
  const response = await fetch(`https://api.0x.org/swap/v1/quote?${query}`, {
    headers: {
      "Content-Type": "application/json",
      "0x-api-key": process.env.DATA_API_KEY,
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}

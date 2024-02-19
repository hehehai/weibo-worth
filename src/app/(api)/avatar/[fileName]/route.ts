import { NextResponse } from "next/server";
import { z } from "zod";

export const revalidate = 21600; // 6h

const imagePrefix = "https://wx1.sinaimg.cn/orj480";

const worthParamsSchema = z.object({
  fileName: z.coerce
    .string()
    .min(1, { message: "图片路径不可为空" })
    .regex(/\.(png|jpg|jpeg)$/i, { message: "图片路径格式错误" }),
});

export async function GET(
  _request: Request,
  { params }: { params: { fileName: string } }
) {
  try {
    const { fileName } = worthParamsSchema.parse(params);
    const res = await fetch(`${imagePrefix}/${fileName}`);
    const blob = await res.blob();

    const headers = new Headers();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    headers.set("Content-Type", contentType);
    headers.set('Content-Length', String(blob.size))
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 400 });
    }
    return new Response("Server Error", { status: 500 });
  }
}

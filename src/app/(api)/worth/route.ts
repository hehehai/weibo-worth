import { getUserHistoryByUID, getUserInfoByUID } from "@/lib/functions";
import { z } from "zod";

export const revalidate = 21600; // 6h

const worthParamsSchema = z.object({
  uid: z.coerce
    .string()
    .min(1, { message: "请填写UID" })
    .max(256, { message: "UID不能超过256位" }),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  try {
    const params = worthParamsSchema.parse({ uid });
    const [userInfo, userHistory] = await Promise.allSettled([getUserInfoByUID(params.uid), getUserHistoryByUID(params.uid)])

    const data = {
      user: userInfo.status === "fulfilled" ? userInfo.value : null,
      history: userHistory.status === "fulfilled" ? userHistory.value : null
    }

    return Response.json(data)
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 400 });
    }
    return new Response("Server Error", { status: 500 });
  }
}

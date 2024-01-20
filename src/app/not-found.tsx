import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl">404</h1>
      <p className="mt-8 mb-14">您要查找的页面不存在</p>
      <Button variant={"outline"} asChild>
        <a href="/">返回首页</a>
      </Button>
    </div>
  );
}

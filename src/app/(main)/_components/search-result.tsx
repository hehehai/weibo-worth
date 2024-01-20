import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchUserByKeyword } from "@/lib/functions";
import Link from "next/link";

const SearchResult = async ({ searchValue }: { searchValue: string }) => {
  const result = await searchUserByKeyword(searchValue);
  return (
    <div className="max-md:container">
      <Card>
        <CardContent className="p-0">
          {result?.length ? (
            <ScrollArea className="md:h-[660px] md:w-[540px] rounded-lg">
              <div className="divide-y divide-slate-400/20">
                {result.map((item) => (
                  <div key={item.user.id} className="flex items-center p-3 md:p-4">
                    <div className="flex-auto">
                      <div className="font-medium text-base">
                        @{item.user.screen_name}
                      </div>
                      {item.user.verified_reason ? (
                        <div className="mt-1 text-slate-700">
                          {item.user.verified_reason}
                        </div>
                      ) : (
                        item.user.description && (
                          <div
                            v-else-if="item.user.description"
                            className="mt-1 text-slate-700"
                          >
                            {item.user.description}
                          </div>
                        )
                      )}
                      <div className="mt-1 text-slate-400">
                        <span className="mr-4">
                          粉丝数 {item.user.followers_count_str}
                        </span>
                        <span>微博数 {item.user.statuses_count}</span>
                      </div>
                    </div>
                    <Button variant={"outline"} asChild>
                      <Link href={`/?uid=${item.user.id}`}>选择</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            "未找到相关结果"
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResult;

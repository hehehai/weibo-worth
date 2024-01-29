import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchUserByKeyword } from "@/lib/functions";
import Link from "next/link";
import { memo } from "react";

const SearchResult = memo(async ({ searchValue }: { searchValue: string }) => {
  const result = await searchUserByKeyword(searchValue);
  return (
    <div className="max-md:container">
      <Card>
        <CardContent className="p-0">
          {result?.length ? (
            <ScrollArea className="md:h-[660px] md:w-[540px] rounded-lg">
              <div className="divide-y divide-slate-400/20">
                {result.map((item) => (
                  <div key={item.id} className="flex items-center p-3 md:p-4">
                    <div className="flex-auto">
                      <div className="font-medium text-lg">
                        @{item.screen_name}
                      </div>
                      {item.verified_reason ? (
                        <div className="mt-1 text-slate-700">
                          {item.verified_reason}
                        </div>
                      ) : (
                        item.description && (
                          <div className="mt-1 text-slate-700">
                            {item.description}
                          </div>
                        )
                      )}
                      <div className="text-sm mt-1 text-slate-400">
                        <span className="mr-4">
                          粉丝数 {item.followers_count_str}
                        </span>
                        <span>微博数 {item.statuses_count}</span>
                      </div>
                    </div>
                    <Button variant={"outline"} asChild>
                      <Link href={`/?uid=${item.id}`}>选择</Link>
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
});

SearchResult.displayName = "SearchResult";

export default SearchResult;

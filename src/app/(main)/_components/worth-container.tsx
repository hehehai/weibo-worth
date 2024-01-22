"use client";

import { LoadingIcon, StarIcon, WeiboIcon } from "@/components/icons";
import { cn, downloadFile } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { convertHistoryChart } from "@/lib/worth";
import { useWorthCNY } from "@/hooks/useWorthCNY";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { useToast } from "@/components/ui/use-toast";
import { ClientWeiboUser } from "@/lib/functions";
import { WeiboUserHistoryRes } from "@/lib/weibo-data";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data: {
    user: ClientWeiboUser | null,
    history: WeiboUserHistoryRes | null
  } = await res.json();
  const { user, history } = data;
  return {
    user,
    history: history ? convertHistoryChart(history) : null,
  };
};

const WorthContainer = ({ uid }: { uid: string }) => {
  const { toast } = useToast();
  const worthCardRef = useRef(null);
  const { data, error, isLoading } = useSWRImmutable(
    `/worth?uid=${uid}`,
    fetcher
  );
  const worthCNY = useWorthCNY(data?.user);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportImage = useCallback(async () => {
    try {
      if (!worthCardRef.current) {
        throw new Error("worthCardRef.current is null");
      }
      setExportLoading(true);
      let dataUrl = "";
      const minDataLength = 2000000;
      let i = 0;
      const maxAttempts = 10;

      // fix： https://github.com/bubkoo/html-to-image/issues/361
      while (dataUrl.length < minDataLength && i < maxAttempts) {
        dataUrl = await toPng(worthCardRef.current, { pixelRatio: 1.5 });
        i += 1;
      }
      const fileName = data?.user?.screen_name ?? uid;
      downloadFile(`${fileName}.png`, dataUrl);
      toast({
        title: "图片导出成功",
        description: `已保存至本地: ${fileName}.png`,
      });
    } catch (err) {
      toast({
        title: "图片导出失败",
        description: "github 反馈",
      });
    } finally {
      setExportLoading(false);
    }
  }, [worthCardRef]);

  if (isLoading) {
    return <LoadingIcon className="text-2xl"></LoadingIcon>;
  } else if (error) {
    return (
      <div className="text-center">
        <span className="i-lucide-badge-alert"></span>
        用户数据加载失败
      </div>
    );
  }

  return (
    <div className="max-md:container md:w-[520px]">
      <div
        ref={worthCardRef}
        className="bg-white w-full md:min-h-[600px] rounded-3xl overflow-hidden border-4 border-gray-300"
      >
        <div className="w-full h-full p-5 md:p-8 bg-yellow-50/50">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="ios-rounded relative w-24 h-24 md:w-[120px] md:h-[120px] bg-gray-300 overflow-hidden shrink-0">
              <img
                src={data?.user?.avatar_hd}
                alt={data?.user?.screen_name}
                crossOrigin="anonymous"
                className="absolute w-[88px] h-[88px] md:w-[112px] md:h-[112px] left-1 top-1 ios-rounded object-cover"
              />
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-semibold pb-2 md:pb-3">
                @{data?.user?.screen_name}
              </div>
              <div className="flex items-center gap-5 md:gap-10">
                <div>
                  <div className="text-xl md:text-2xl font-din leading-8 break-keep">
                    {data?.user?.followers_count}
                    <div className="h-[10px] rounded-full bg-gray-300 -mt-4 -mr-1"></div>
                  </div>
                  <div className="text-sm leading-4 text-gray-500 mt-1">
                    粉丝
                  </div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-din leading-8 break-keep">
                    {data?.user?.statuses_count}
                    <div className="h-[10px] rounded-full bg-gray-300 -mt-4 -mr-1"></div>
                  </div>
                  <div className="text-[14px] leading-4 text-gray-500 mt-1">
                    微博
                  </div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-din leading-8 break-keep">
                    {data?.user?.follow_count}
                    <div className="h-[10px] rounded-full bg-gray-300 -mt-4 -mr-1"></div>
                  </div>
                  <div className="text-[14px] leading-4 text-gray-500 mt-1">
                    关注
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-8">
            {data?.history && (
              <div className="flex gap-1 justify-center flex-col w-max">
                <div className="flex justify-between text-sm font-din text-zinc-400 pl-4">
                  <span>2010</span>
                  <span className="-mr-1">2024</span>
                </div>
                <div className="flex gap-1">
                  <div className="flex flex-col justify-between text-sm font-din text-zinc-400">
                    <span>01</span>
                    <span>12</span>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {Object.entries(data?.history).map(([year, points]) => (
                      <div className="flex flex-col gap-1" key={year}>
                        {points.map((item) => (
                          <div
                            key={item.i}
                            className={cn(
                              "w-4 h-4 md:w-6 md:h-6 rounded-[5px] md:rounded-md",
                              item.point ? item.color : "bg-gray-100"
                            )}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-8 flex justify-between items-end">
            <div>
              <WeiboIcon className="text-2xl"></WeiboIcon>
              <span className="text-xs text-gray-400">微博账号总价值</span>
            </div>
            <div className="font-din text-5xl md:text-6xl leading-[72px]">
              ¥{worthCNY}
              <div className="h-[12px] rounded-full bg-gray-300 -mt-6 -mx-1"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:flex items-center justify-between mt-10 max-md:space-y-4">
        <div className="flex items-center max-md:justify-center space-x-1 text-orange-500">
          <StarIcon></StarIcon>
          <a
            href="https://speechless.fun"
            target="_blank"
            className="text-sm hover:underline"
          >
            备份 @{data?.user?.screen_name} 的微博
          </a>
        </div>
        <Button
          size={"lg"}
          className="max-md:w-full space-x-1"
          onClick={handleExportImage}
        >
          {exportLoading ? (
            <LoadingIcon className="text-lg"></LoadingIcon>
          ) : (
            <span className="i-lucide-download text-lg"></span>
          )}
          <span>下载图片</span>
        </Button>
      </div>
    </div>
  );
};

export default WorthContainer;

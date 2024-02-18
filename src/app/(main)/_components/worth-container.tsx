import { WeiboIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { calculateAccountValue, convertStringToNumber } from "@/lib/worth";
import { convertHistoryChart } from "@/lib/worth";
import {
  ClientWeiboUser,
  getUserHistoryByUID,
  getUserInfoByUID,
} from "@/lib/functions";
import { ExportWrapper } from "./export-wrapper";

function getWorthCNY(user?: ClientWeiboUser | null) {
  if (!user) {
    return "0";
  }
  const value = calculateAccountValue({
    followerCount: convertStringToNumber(user.followers_count),
    articleCount: user.statuses_count,
    urankLevel: user.urank,
    mbrankLevel: user.mbrank,
  });

  return new Intl.NumberFormat("ja-JP", {
    // style: "currency",
    currency: "JPY",
  }).format(value);
}

const WorthContainer = async ({ uid }: { uid: string }) => {
  const [userInfo, userHistory] = await Promise.allSettled([
    getUserInfoByUID(uid),
    getUserHistoryByUID(uid),
  ]);

  const data = {
    user: userInfo.status === "fulfilled" ? userInfo.value : null,
    history:
      userHistory.status === "fulfilled"
        ? userHistory.value
          ? convertHistoryChart(userHistory.value)
          : null
        : null,
  };
  const worthCNY = getWorthCNY(data?.user);

  return (
    <div className="max-md:container md:w-[520px]">
      <ExportWrapper userName={data?.user?.screen_name ?? uid} uid={uid}>
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
      </ExportWrapper>
    </div>
  );
};

WorthContainer.displayName = "WorthContainer";

export default WorthContainer;

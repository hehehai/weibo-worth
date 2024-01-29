import { ENV, getLinkFileName } from "./utils";
import type { WeiboRes, WeiboSearchRes, WeiboUser, WeiboUserHistoryRes, WeiboUserRes } from "./weibo-data";
import { pick } from "lodash-es";

const mobileHeaders = {
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E302 Safari/604.1",
  Cookie: `MLOGIN=0; M_WEIBOCN_PARAMS=fid%3D100103type%253D3%2526q%253D%25E9%25A9%25AC%2526t%253D%26uicode%3D10000011; WEIBOCN_FROM=1110006030; _T_WM=53364308629; mweibo_short_token=b23e04a5f2; XSRF-TOKEN=47c416`,
  Host: "m.weibo.cn",
};

const desktopHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Cookie: ENV.SELF_COOKIE,
  Host: "weibo.com",
};

function replaceUserAvatar(avatarLink: string | null | undefined) {
  if (!avatarLink) {
    return '';
  }
  return "/avatar/" + getLinkFileName(avatarLink);
}

const clientWeiboUserKeys = [
  "id",
  "screen_name",
  "description",
  "avatar_hd",
  "follow_count",
  "followers_count",
  "followers_count_str",
  "mbrank",
  "statuses_count",
  "urank",
  "verified_reason",
] as const;

export type ClientWeiboUser = Pick<
  WeiboUser,
  (typeof clientWeiboUserKeys)[number]
>;

function pickUserInfo(user: WeiboUser): ClientWeiboUser {
  return pick(user, clientWeiboUserKeys);
}

const searchUser = `https://m.weibo.cn/api/container/getIndex`;
const userInfo = `https://m.weibo.cn/api/container/getIndex?containerid=100505`;
const userMonthHistory = `https://weibo.com/ajax/profile/mbloghistory?uid=`;

export async function searchUserByKeyword(
  keyword: string
) {
  try {
    if (!keyword) {
      return [];
    }
    const fetchUrl = `${searchUser}?containerid=100103type=3%26q=${keyword}%26t=&page_type=searchall`;
    const response = await fetch(fetchUrl, {
      headers: mobileHeaders,
      next: {
        // 6 小时
        revalidate: 60 * 60 * 6,
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data: WeiboRes<WeiboSearchRes> = await response.json();
    if (data?.ok != 1 || !data?.data?.cards) {
      throw new Error("数据获取失败");
    }
    const filterResult = data.data.cards.find(
      (card: { card_type: number }) => card.card_type == 11
    );
    const userList: ClientWeiboUser[] = (filterResult?.card_group ?? []).map(
      (group) =>
        pickUserInfo({
          ...group.user,
          avatar_hd: replaceUserAvatar(group.user.avatar_hd),
        })
    );

    if (/^\d+$/.test(keyword) && !userList.length) {
      const resProfile = await getUserInfoByUID(keyword);
      if (resProfile) {
        userList.push(resProfile);
      }
    }

    return userList;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getUserInfoByUID(uid: string) {
  try {
    const response = await fetch(`${userInfo}${uid}`, {
      headers: mobileHeaders,
      next: {
        // 6 小时
        revalidate: 60 * 60 * 6,
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data:  WeiboRes<WeiboUserRes> = await response.json();
    if (data?.ok != 1 || !data?.data?.userInfo) {
      throw new Error("获取用户信息失败");
    }

    return pickUserInfo({
      ...data.data.userInfo,
      avatar_hd: replaceUserAvatar(data.data.userInfo.avatar_hd),
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getUserHistoryByUID(uid: string) {
  try {
    const response = await fetch(`${userMonthHistory}${uid}`, {
      headers: desktopHeaders,
      next: {
        // 12 小时
        revalidate: 60 * 60 * 12,
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data: WeiboRes<WeiboUserHistoryRes> = await response.json();
    if (data?.ok != 1 || !data?.data) {
      throw new Error("获取用户历史失败");
    }
    return data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

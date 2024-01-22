export interface WeiboRes<T> {
  ok: number;
  data: T;
}

export interface WeiboUser {
  id: number;
  screen_name: string; // 微博昵称
  profile_image_url: string; // 个人主页背景
  profile_url: string;
  statuses_count: number; // 微博数
  verified: boolean; // 是否认证
  verified_type: number;
  verified_type_ext?: number;
  verified_reason?: string; // 认证描述
  close_blue_v: boolean;
  description: string;
  gender: "f" | "m"; // 性别
  mbtype: number;
  svip: number;
  urank: number; // 账号等级
  mbrank: number; // 会员等级
  follow_me: boolean;
  following: boolean;
  follow_count: number; // 粉丝数
  followers_count: string;
  followers_count_str: string;
  cover_image_phone: string; // 个人主页背景（移动端）
  avatar_hd: string; // 头像
  badge: { [key: string]: number };
  special_follow: boolean;
}

// 微博搜索
export interface WeiboSearchRes {
  cards: {
    card_type: number;
    card_group: CardGroup[];
  }[];
}

export interface WeiboSearchCardGroup {
  card_type: number;
  scheme: string;
  user: WeiboUser;
}

// 个人信息
export interface WeiboUserRes {
  userInfo: WeiboUser;
}

// 历史数据
export interface WeiboUserHistoryRes {
  [key: string]: string[];
}

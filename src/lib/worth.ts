const defaultUser = [
  {
    s: '来去之间',
    uid: '1111681197'
  },
  {
    s: '马思纯',
    uid: '1738498871'
  },
  {
    s: '陈坤',
    uid: '1087770692'
  },
  {
    s: '郎咸平',
    uid: '1684388950'
  },
  {
    s: '胡锡进',
    uid: '1989660417'
  },
  {
    s: '上网奇才',
    uid: '1572151190'
  },
  {
    s: '张颂文',
    uid: '1218966851'
  },
  {
    s: '彭昱畅',
    uid: '2286552551'
  }
]

export function getRandomUser() {
  return defaultUser[Math.floor(Math.random() * defaultUser.length)]
}

const currentYear = new Date().getFullYear();
const startYear = currentYear - 14;
const chartColors = [
  "bg-orange-300",
  "bg-green-300",
  "bg-sky-300",
  "bg-purple-300",
];

// 单位转换
export function convertStringToNumber(str: string) {
  // 判断字符串是否以"亿"结尾
  if (str.endsWith("亿")) {
    // 去除字符串末尾的"亿"字符
    const numStr = str.slice(0, -1);
    // 将字符串转换为数字并乘以一亿
    const number = parseFloat(numStr) * 100000000;
    return number;
  }
  // 判断字符串是否以"万"结尾
  else if (str.endsWith("万")) {
    // 去除字符串末尾的"万"字符
    const numStr = str.slice(0, -1);
    // 将字符串转换为数字并乘以一万
    const number = parseFloat(numStr) * 10000;
    return number;
  } else {
    // 字符串不以"亿"或"万"结尾，直接将字符串转换为数字
    const number = parseFloat(str);
    return number;
  }
}

// 价值计算
export function calculateAccountValue(account: {
  followerCount: number;
  articleCount: number;
  urankLevel: number;
  mbrankLevel?: number;
}) {
  const { followerCount, articleCount, urankLevel, mbrankLevel = 0 } = account;

  // 粉丝价值
  let followerValue = 0;
  if (followerCount <= 100000) {
    followerValue = 0.4;
  } else if (followerCount <= 1000000) {
    followerValue = 0.35;
  } else {
    const extraFollowers = Math.floor((followerCount - 1000000) / 5000000);
    followerValue = 0.03 + extraFollowers * 0.01;
  }

  // 文章价值
  const articleValue = 0.2;

  // 账号等级价值
  const urankValue = (urankLevel - 1) * (urankLevel - 1) * 10;

  // 会员等级价值
  const mbrankValue = (mbrankLevel - 1) * (mbrankLevel - 1) * 100;

  // 计算总价值
  const totalValue =
    followerCount * followerValue +
    articleCount * articleValue +
    urankValue +
    mbrankValue;

  return Number(Number(totalValue).toFixed(0));
}

// 生成月份
function genMonths(points: string[] = []) {
  return Array.from({ length: 12 }, (_, i) => {
    const block = i + 1;
    const result = { i, point: false, color: "" };
    if (points.includes(String(block))) {
      result.point = true;
      // 随机取色
      result.color =
        chartColors[Math.floor(Math.random() * chartColors.length)];
    }
    return result;
  });
}

// 转换历史为 chart
export function convertHistoryChart(history: Record<string, string[]>) {
  const chartMap: Record<
    string,
    {
      i: number;
      point: boolean;
      color: string;
    }[]
  > = {};
  for (let i = startYear; i <= currentYear; i++) {
    chartMap[i] = genMonths(history[i]);
  }
  return chartMap;
}

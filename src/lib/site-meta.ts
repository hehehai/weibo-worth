export const baseHost = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://weibo.hehehai.cn'

export const siteMeta = {
  siteName: '微博账号估值',
  host: baseHost,
  title: "微博账号估值 - 测测你的微博账号值多少钱?",
  description: "输入微博账号快速估算微博账号价值！ 快来试试吧~",
  keywords: "微博账号,账号估值,微博价值，账号分享，多少钱，微博估价，微博实时，微博号",
  ogImage: baseHost + '/og.jpg'
}

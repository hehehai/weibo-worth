import { calculateAccountValue, convertStringToNumber } from "@/lib/worth";
import { useEffect, useState } from "react";

export function useWorthCNY(user: any) {
  const [worth, setWorth] = useState('0')

  useEffect(() => {
    if (user?.id) {
      const value = calculateAccountValue({
        followerCount: convertStringToNumber(
          user.followers_count
        ),
        articleCount: user.statuses_count,
        urankLevel: user.urank,
        mbrankLevel: user.mbrank,
      })

      const worthCNY = new Intl.NumberFormat("ja-JP", {
        // style: "currency",
        currency: "JPY",
      }).format(value);
      setWorth(worthCNY)
    } else {
      setWorth('0')
    }
  }, [user?.id])

  return worth
}

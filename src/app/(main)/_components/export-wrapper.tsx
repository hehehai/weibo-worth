"use client";

import { LoadingIcon, StarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { downloadFile } from "@/lib/utils";
import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";

export const ExportWrapper = ({
  userName,
  uid,
  children,
}: {
  userName: string;
  uid: string;
  children: React.ReactNode;
}) => {
  const { toast } = useToast();
  const worthCardRef = useRef(null);
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
      const fileName = userName ?? uid;
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
  }, [worthCardRef.current]);

  return (
    <>
      <div
        ref={worthCardRef}
        className="bg-white w-full md:min-h-[600px] rounded-3xl overflow-hidden border-4 border-gray-300"
      >
        {children}
      </div>

      <div className="md:flex items-center justify-between mt-10 max-md:space-y-4">
        <div className="flex items-center max-md:justify-center space-x-1 text-orange-500">
          <StarIcon></StarIcon>
          <a
            href="https://speechless.fun"
            target="_blank"
            className="text-sm hover:underline"
          >
            备份 @{userName} 的微博
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
    </>
  );
};

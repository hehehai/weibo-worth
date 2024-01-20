"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface FormElements extends HTMLFormControlsCollection {
  searchInput: HTMLInputElement;
}
interface SearchFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const SearchInput = ({ defaultValue }: { defaultValue?: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent<SearchFormElement>) => {
    e.preventDefault();
    const searchValue = e.currentTarget.elements.searchInput.value;
    if (!searchValue?.trim()) {
      return toast({
        title: "输入微博账号名称或账号 ID",
        description: (
          <div>
            <p>账号 ID 如何获取？</p>
            <ul>
              <li>任意账号详情页面 weibo.com/u/[xxxxxxxxxx]</li>
              <li>其中 [xxxxxxxxxx] 为账号 ID</li>
            </ul>
          </div>
        ),
      });
    }

    const params = new URLSearchParams();
    params.set("s", searchValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleQuestion = () => {
    toast({
      title: "账号 ID 如何获取？",
      description: (
        <div>
          <Image
            src="/images/question-id.jpg"
            alt="question-id"
            className="w-full rounded-md mb-2 border border-zinc-300"
            width={875}
            height={400}
          ></Image>
          <ul>
            <li>
              任意账号详情页面 <code>weibo.com/u/[xxxxxxxxxx]</code>
            </li>
            <li>
              其中 <code>[xxxxxxxxxx]</code> 为账号 ID
            </li>
          </ul>
        </div>
      ),
    });
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="md:flex">
        <label className="sr-only" htmlFor="searchInput">
          搜索:
        </label>
        <Input
          id="searchInput"
          size={"lg"}
          type="text"
          defaultValue={defaultValue}
          placeholder="输入微博账号名称或账号 ID"
        />
        <Button size={"lg"} className="mt-4 md:mt-0 md:ml-3 max-md:w-full" type="submit">
          <span className="i-lucide-calculator mr-2 text-lg"></span>
          开始评估
        </Button>
      </form>
      <div className="flex items-center space-x-1 text-sm mt-2 text-stone-500">
        <span className="i-lucide-help-circle"></span>
        <span
          className="pl-2 pr-1 py-0.5 rounded-sm hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleQuestion}
        >
          账号 ID 如何获取？
        </span>
      </div>
    </div>
  );
};

export default SearchInput;

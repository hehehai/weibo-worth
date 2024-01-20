import SearchInput from "@/app/(main)/_components/search-input";
import SearchResult from "@/app/(main)/_components/search-result";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { z } from "zod";
import { ContentBlurGradient } from "./_components/content-blur-gradient";
import WorthContainer from "./_components/worth-container";
import { P, match } from "ts-pattern";
import { getRandomUser } from "@/lib/worth";

const SearchParamsSchema = z.object({
  s: z.coerce.string().max(256).optional().default(""),
  uid: z.coerce.string().optional().default(""),
});

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = SearchParamsSchema.parse(
    Object.keys(searchParams ?? {}).length ? searchParams : getRandomUser()
  );

  return (
    <main className="md:flex">
      <div className="md:w-1/2 pt-28 md:pt-0 md:min-h-screen relative grid-line-bg flex items-center justify-center border-b md:border-r border-zinc-100">
        <Button variant={"ghost"} className="absolute top-5 right-5" asChild>
          <a href="https://github.com/hehehai/weibo-worth" target="_blank">
            <span className="i-lucide-github mr-1"></span>
            GitHub
          </a>
        </Button>
        <section className="max-md:container md:max-w-3xl pb-36 md:pb-60">
          <div>
            <div className="space-x-3 mb-7 text-5xl md:text-6xl">
              <span className="i-lucide-badge-japanese-yen text-orange-400"></span>
              <span className="i-lucide-badge-dollar-sign text-indigo-400"></span>
              <span className="i-lucide-badge-euro text-pink-400"></span>
            </div>
            <div className="text-balance text-5xl md:text-6xl font-semibold space-y-4">
              <h2>你的微博账号</h2>
              <h3>值多少钱？</h3>
            </div>
          </div>
          <div className="md:w-[460px] mt-16">
            <SearchInput defaultValue={query.s}></SearchInput>
          </div>
        </section>
      </div>
      <div className="md:w-1/2 flex-grow-0 relative flex items-center justify-center py-20">
        <div className="relative z-10">
          {match(query)
            .with({ uid: P.when((t) => !!t) }, () => (
              <WorthContainer uid={query.uid}></WorthContainer>
            ))
            .with({ s: P.when((t) => !!t) }, () => (
              <Suspense fallback={null}>
                <SearchResult searchValue={query.s} />
              </Suspense>
            ))
            .otherwise(() => (
              <div>Show Cases</div>
            ))}
        </div>
        <ContentBlurGradient />
      </div>
    </main>
  );
}
